export interface Facility {
  id: string
  slug: string
  name: string
  address: string
  status: 'open' | 'coming_soon'
  openDate?: string
  description?: string
  imageUrl?: string
  googleMapsUrl?: string
  minnanoKaigoUrl?: string
  jobMedleyUrl?: string
}

export interface JobListing {
  id: string
  facility: string
  job_type: string
  employment_type: string
  title: string
  title_message: string | null
  appeal_content: string | null
  salary_type: string | null
  base_salary_min: number | null
  base_salary_max: number | null
  qualification_allowance_min: number | null
  qualification_allowance_max: number | null
  job_allowance_min: number | null
  job_allowance_max: number | null
  monthly_total_min: number | null
  monthly_total_max: number | null
  overtime_allowance_min: number | null
  overtime_allowance_max: number | null
  total_salary_min: number | null
  total_salary_max: number | null
  oncall_allowance: string | null
  night_shift_allowance: string | null
  year_end_allowance: string | null
  adjustment_allowance: string | null
  commuting_allowance: string | null
  bonus: string | null
  incentive_allowance: string | null
  payroll_cutoff: string | null
  working_hours: string | null
  holidays: string | null
  other_benefits: string | null
  job_description: string | null
  required_qualifications: string | null
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface NewsPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  category: string
  is_published: boolean
  published_at: string | null
  created_at: string
  updated_at: string
}

export interface ContactFormData {
  lastName: string
  firstName: string
  email: string
  jobTitle?: string
  company?: string
  message: string
  agreedToPrivacyPolicy: boolean
}

export interface RecruitFormData {
  lastName: string
  firstName: string
  email: string
  phone: string
  jobType: string
  facility: string
  jobListingId?: string
  jobTitle?: string
  message?: string
  agreedToPrivacyPolicy: boolean
}
