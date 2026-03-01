import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Papa from 'papaparse'

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL または SUPABASE_SERVICE_ROLE_KEY が未設定です')
  }
  return createClient(url, key)
}

// CSVの¥付き数値を整数に変換
function parseSalary(val: string): number | null {
  if (!val || val.trim() === '' || val.trim() === '¥0') return null
  const cleaned = val.replace(/[¥,\s]/g, '')
  const num = parseInt(cleaned, 10)
  return isNaN(num) ? null : num
}

// CSVの列名 → DBカラム名のマッピング
function csvRowToDbRecord(row: Record<string, string>, index: number) {
  return {
    facility: row['施設名']?.trim() || '',
    job_type: row['職種']?.trim() || '',
    employment_type: row['雇用形態']?.trim() || '',
    title: row['タイトル']?.trim() || '',
    title_message: row['タイトルメッセージ']?.trim() || null,
    appeal_content: row['アピール内容']?.trim() || null,
    salary_type: row['給料種別']?.trim() || null,
    base_salary_min: parseSalary(row['基本給\n(下限)'] || row['基本給(下限)'] || ''),
    base_salary_max: parseSalary(row['基本給\n(上限、年齢、経験年数による)'] || row['基本給(上限、年齢、経験年数による)'] || ''),
    qualification_allowance_min: parseSalary(row['資格手当\n（下限）'] || row['資格手当（下限）'] || ''),
    qualification_allowance_max: parseSalary(row['資格手当\n（上限、保有資格による。最も高い資格1つに支給）'] || row['資格手当（上限、保有資格による。最も高い資格1つに支給）'] || ''),
    job_allowance_min: parseSalary(row['職務手当\n(下限)'] || row['職務手当(下限)'] || ''),
    job_allowance_max: parseSalary(row['職務手当\n(上限)'] || row['職務手当(上限)'] || ''),
    monthly_total_min: parseSalary(row['毎月支給額\n（下限）'] || row['毎月支給額（下限）'] || ''),
    monthly_total_max: parseSalary(row['毎月支給額\n（上限）'] || row['毎月支給額（上限）'] || ''),
    overtime_allowance_min: parseSalary(row['みなし残業手当\n（下限、月20時間）'] || row['みなし残業手当（下限、月20時間）'] || ''),
    overtime_allowance_max: parseSalary(row['みなし残業手当\n（上限、月20時間）'] || row['みなし残業手当（上限、月20時間）'] || ''),
    total_salary_min: parseSalary(row['給与総額\n(下限)'] || row['給与総額(下限)'] || ''),
    total_salary_max: parseSalary(row['給与総額\n(上限)'] || row['給与総額(上限)'] || ''),
    oncall_allowance: row['オンコール手当\n(発生毎支給)']?.trim() || row['オンコール手当(発生毎支給)']?.trim() || null,
    night_shift_allowance: row['夜勤手当\n(発生毎支給)']?.trim() || row['夜勤手当(発生毎支給)']?.trim() || null,
    year_end_allowance: row['年末年始手当']?.trim() || null,
    adjustment_allowance: row['調整手当']?.trim() || null,
    commuting_allowance: row['通勤手当']?.trim() || null,
    bonus: row['賞与']?.trim() || null,
    incentive_allowance: row['インセンティブ手当']?.trim() || null,
    payroll_cutoff: row['賃金締め切り日']?.trim() || null,
    working_hours: row['勤務時間']?.trim() || null,
    holidays: row['休日']?.trim() || null,
    other_benefits: row['その他']?.trim() || null,
    job_description: row['仕事の内容']?.trim() || null,
    required_qualifications: row['必要資格']?.trim() || null,
    is_active: true,
    sort_order: index,
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'ファイルが見つかりません' }, { status: 400 })
    }

    const text = await file.text()

    // PapaParse でCSVパース
    const result = Papa.parse<Record<string, string>>(text, {
      header: true,
      skipEmptyLines: true,
    })

    if (result.errors.length > 0) {
      console.error('CSV parse errors:', result.errors)
    }

    const rows = result.data
    if (rows.length === 0) {
      return NextResponse.json({ error: 'CSVにデータが見つかりません' }, { status: 400 })
    }

    const records = rows.map((row, i) => csvRowToDbRecord(row, i))

    // 施設名・職種・雇用形態が空のものは除外
    const validRecords = records.filter(r => r.facility && r.job_type && r.employment_type && r.title)

    if (validRecords.length === 0) {
      return NextResponse.json({ error: '有効な求人データがありません' }, { status: 400 })
    }

    const supabase = getSupabase()

    // このCSVに含まれるキーを収集
    const uploadedKeys = validRecords.map(r => `${r.facility}__${r.job_type}__${r.employment_type}`)

    // UPSERT（facility + job_type + employment_type がユニーク制約）
    const { error: upsertError } = await supabase
      .from('job_listings')
      .upsert(validRecords, {
        onConflict: 'facility,job_type,employment_type',
      })

    if (upsertError) {
      console.error('Upsert error:', upsertError)
      return NextResponse.json({ error: 'アップロードに失敗しました: ' + upsertError.message }, { status: 500 })
    }

    // CSVに含まれない既存求人を is_active=false に
    const { data: allJobs, error: fetchError } = await supabase
      .from('job_listings')
      .select('id, facility, job_type, employment_type')

    if (!fetchError && allJobs) {
      const toDeactivate = allJobs
        .filter(j => !uploadedKeys.includes(`${j.facility}__${j.job_type}__${j.employment_type}`))
        .map(j => j.id)

      if (toDeactivate.length > 0) {
        await supabase
          .from('job_listings')
          .update({ is_active: false })
          .in('id', toDeactivate)
      }
    }

    return NextResponse.json({
      success: true,
      uploaded: validRecords.length,
      message: `${validRecords.length}件の求人をアップロードしました`,
    })
  } catch (err) {
    console.error('Upload error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
