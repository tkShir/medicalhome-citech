'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

interface NewsPost {
  id: string
  title: string
  slug: string
  category: string
  is_published: boolean
  published_at: string | null
  created_at: string
  updated_at: string
}

interface NewsPostDetail extends NewsPost {
  excerpt: string
  content: string
}

type View = 'list' | 'create' | 'edit'

// ---- Rich Text Editor ----

function ToolbarBtn({
  onClick,
  title,
  children,
}: {
  onClick: () => void
  title: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => {
        e.preventDefault() // Prevent blur on editor
        onClick()
      }}
      title={title}
      className="px-2 py-1 text-xs font-mono border border-lightgray bg-white text-darkgray hover:bg-offwhite transition-colors"
    >
      {children}
    </button>
  )
}

function RichTextEditor({
  initialValue,
  onChange,
  postId,
}: {
  initialValue: string
  onChange: (html: string) => void
  postId?: string
}) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const savedRangeRef = useRef<Range | null>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = initialValue
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const saveRange = useCallback(() => {
    const sel = window.getSelection()
    if (sel && sel.rangeCount > 0 && editorRef.current?.contains(sel.anchorNode)) {
      savedRangeRef.current = sel.getRangeAt(0).cloneRange()
    }
  }, [])

  const restoreRangeOrEnd = useCallback(() => {
    editorRef.current?.focus()
    if (savedRangeRef.current) {
      const sel = window.getSelection()
      if (sel) {
        sel.removeAllRanges()
        sel.addRange(savedRangeRef.current)
      }
    } else if (editorRef.current) {
      const range = document.createRange()
      range.selectNodeContents(editorRef.current)
      range.collapse(false)
      const sel = window.getSelection()
      if (sel) {
        sel.removeAllRanges()
        sel.addRange(range)
      }
    }
  }, [])

  const exec = useCallback(
    (command: string, val?: string) => {
      editorRef.current?.focus()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(document as any).execCommand(command, false, val ?? null)
      if (editorRef.current) onChange(editorRef.current.innerHTML)
    },
    [onChange]
  )

  const handleBlock = useCallback(
    (tag: string) => {
      editorRef.current?.focus()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(document as any).execCommand('formatBlock', false, tag)
      if (editorRef.current) onChange(editorRef.current.innerHTML)
    },
    [onChange]
  )

  const handleLink = useCallback(() => {
    const url = prompt('リンクのURLを入力してください:')
    if (url) exec('createLink', url)
  }, [exec])

  const handleVideoUrl = useCallback(() => {
    saveRange()
    const url = prompt('動画のURLを入力してください（YouTube URL または動画ファイルのURL）:')
    if (!url) return

    restoreRangeOrEnd()

    let html = ''
    const ytMatch = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    )
    if (ytMatch) {
      const videoId = ytMatch[1]
      html = `<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;margin:1em 0;"><iframe src="https://www.youtube.com/embed/${videoId}" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" allowfullscreen loading="lazy"></iframe></div>`
    } else {
      html = `<video src="${url}" controls style="max-width:100%;display:block;margin:1em 0;"></video>`
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(document as any).execCommand('insertHTML', false, html)
    if (editorRef.current) onChange(editorRef.current.innerHTML)
  }, [onChange, saveRange, restoreRangeOrEnd])

  async function handleImageUpload(file: File) {
    if (!postId) {
      alert('画像をアップロードするには、まず「保存する」を押して記事を作成してください。')
      return
    }
    setUploadingImage(true)
    saveRange()

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch(`/api/admin/news/${postId}/assets`, {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'アップロードに失敗しました')

      restoreRangeOrEnd()
      const html = `<img src="${data.asset.url}" alt="" style="max-width:100%;height:auto;display:block;margin:1em 0;" />`
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(document as any).execCommand('insertHTML', false, html)
      if (editorRef.current) onChange(editorRef.current.innerHTML)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'エラーが発生しました')
    } finally {
      setUploadingImage(false)
    }
  }

  return (
    <div className="border border-lightgray">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 bg-offwhite border-b border-lightgray">
        <ToolbarBtn onClick={() => handleBlock('p')} title="段落">
          本文
        </ToolbarBtn>
        <ToolbarBtn onClick={() => handleBlock('h2')} title="見出し2">
          H2
        </ToolbarBtn>
        <ToolbarBtn onClick={() => handleBlock('h3')} title="見出し3">
          H3
        </ToolbarBtn>
        <div className="w-px bg-lightgray mx-0.5" />
        <ToolbarBtn onClick={() => exec('bold')} title="太字">
          <strong>B</strong>
        </ToolbarBtn>
        <ToolbarBtn onClick={() => exec('italic')} title="斜体">
          <em>I</em>
        </ToolbarBtn>
        <div className="w-px bg-lightgray mx-0.5" />
        <ToolbarBtn onClick={() => exec('insertUnorderedList')} title="箇条書き">
          ・リスト
        </ToolbarBtn>
        <ToolbarBtn onClick={() => exec('insertOrderedList')} title="番号リスト">
          1. リスト
        </ToolbarBtn>
        <div className="w-px bg-lightgray mx-0.5" />
        <ToolbarBtn onClick={handleLink} title="リンクを挿入">
          リンク
        </ToolbarBtn>
        <div className="w-px bg-lightgray mx-0.5" />
        {/* Image upload */}
        <label
          className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-sans border border-lightgray cursor-pointer transition-colors ${
            uploadingImage
              ? 'bg-lightgray text-midgray cursor-not-allowed'
              : 'bg-white text-darkgray hover:bg-offwhite'
          }`}
          title="画像を挿入"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          {uploadingImage ? 'アップロード中...' : '画像'}
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            className="sr-only"
            disabled={uploadingImage}
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleImageUpload(file)
              e.target.value = ''
            }}
          />
        </label>
        {/* Video URL */}
        <ToolbarBtn onClick={handleVideoUrl} title="動画URLを挿入">
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            動画
          </span>
        </ToolbarBtn>
      </div>

      {/* Editable area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={() => {
          if (editorRef.current) onChange(editorRef.current.innerHTML)
        }}
        onMouseUp={saveRange}
        onKeyUp={saveRange}
        className="news-editor-content min-h-64 p-4 font-sans text-sm text-darkgray leading-relaxed focus:outline-none"
      />
    </div>
  )
}

// ---- Main NewsSection ----

export default function NewsSection() {
  const [view, setView] = useState<View>('list')
  const [posts, setPosts] = useState<NewsPost[]>([])
  const [loading, setLoading] = useState(true)
  const [editingPost, setEditingPost] = useState<NewsPostDetail | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)

  // Form fields
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('お知らせ')
  const [isPublished, setIsPublished] = useState(false)
  const [publishedAt, setPublishedAt] = useState('')
  const [savedPostId, setSavedPostId] = useState<string | undefined>(undefined)
  const [editorKey, setEditorKey] = useState(0)
  const [setupOpen, setSetupOpen] = useState(false)

  async function loadPosts() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/news')
      const data = await res.json()
      setPosts(data.posts || [])
    } catch {
      setError('読み込みに失敗しました')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPosts()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function resetForm() {
    setTitle('')
    setSlug('')
    setExcerpt('')
    setContent('')
    setCategory('お知らせ')
    setIsPublished(false)
    setPublishedAt(toLocalDatetimeString(new Date()))
    setSavedPostId(undefined)
    setEditingPost(null)
    setEditorKey((k) => k + 1)
  }

  function toLocalDatetimeString(date: Date) {
    const pad = (n: number) => String(n).padStart(2, '0')
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
  }

  function openCreate() {
    resetForm()
    setView('create')
    setError(null)
    setSuccess(null)
  }

  async function openEdit(post: NewsPost) {
    setError(null)
    setSuccess(null)
    const res = await fetch(`/api/admin/news/${post.id}`)
    const data = await res.json()
    if (!res.ok) {
      setError('記事の読み込みに失敗しました')
      return
    }
    const full: NewsPostDetail = data.post
    setEditingPost(full)
    setTitle(full.title)
    setSlug(full.slug)
    setExcerpt(full.excerpt || '')
    setContent(full.content || '')
    setCategory(full.category || 'お知らせ')
    setIsPublished(full.is_published)
    setPublishedAt(
      full.published_at
        ? toLocalDatetimeString(new Date(full.published_at))
        : toLocalDatetimeString(new Date())
    )
    setSavedPostId(full.id)
    setEditorKey((k) => k + 1)
    setView('edit')
  }

  function handleTitleChange(val: string) {
    setTitle(val)
    // Auto-generate slug only when creating and slug hasn't been manually set
    if (!editingPost && !savedPostId) {
      const date = new Date().toISOString().slice(0, 10).replace(/-/g, '')
      const rand = Math.random().toString(36).slice(2, 6)
      setSlug(`news-${date}-${rand}`)
    }
  }

  async function handleSave() {
    if (!title.trim() || !slug.trim()) {
      setError('タイトルとスラッグは必須です')
      return
    }

    setSaving(true)
    setError(null)
    setSuccess(null)

    const payload = {
      title: title.trim(),
      slug: slug.trim(),
      excerpt: excerpt.trim(),
      content,
      category: category.trim() || 'お知らせ',
      is_published: isPublished,
      published_at: new Date(publishedAt).toISOString(),
    }

    try {
      let res: Response
      const targetId = editingPost?.id || savedPostId

      if (targetId) {
        res = await fetch(`/api/admin/news/${targetId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      } else {
        res = await fetch('/api/admin/news', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      }

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || '保存に失敗しました')

      // After first save of a new post, switch to edit mode
      if (!editingPost && !savedPostId && data.post) {
        setEditingPost(data.post)
        setSavedPostId(data.post.id)
        setView('edit')
      }

      setSuccess('保存しました')
      await loadPosts()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('この記事を削除しますか？画像などのアセットも含めて完全に削除されます。この操作は取り消せません。')) return
    setDeletingId(id)
    try {
      const res = await fetch(`/api/admin/news/${id}`, { method: 'DELETE' })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || '削除に失敗しました')
      }
      await loadPosts()
    } catch (err) {
      setError(err instanceof Error ? err.message : '削除に失敗しました')
    } finally {
      setDeletingId(null)
    }
  }

  async function handleTogglePublish(post: NewsPost) {
    setTogglingId(post.id)
    try {
      const res = await fetch(`/api/admin/news/${post.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          is_published: !post.is_published,
          published_at: post.published_at || new Date().toISOString(),
        }),
      })
      if (!res.ok) throw new Error('更新に失敗しました')
      await loadPosts()
    } catch {
      setError('公開状態の変更に失敗しました')
    } finally {
      setTogglingId(null)
    }
  }

  function fmtDate(s: string | null) {
    if (!s) return '—'
    return new Date(s).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
  }

  const publishedCount = posts.filter((p) => p.is_published).length
  const draftCount = posts.filter((p) => !p.is_published).length

  // ---- List view ----
  if (view === 'list') {
    return (
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
        {error && (
          <div className="bg-pink-light border border-pink-main/30 text-pink-main font-sans text-sm p-3">
            {error}
          </div>
        )}

        <div className="bg-white border border-lightgray p-6 md:p-8">
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-serif text-base text-green-deeper">お知らせ管理</h2>
            <div className="flex items-center gap-3">
              <span className="font-sans text-xs text-green-dark bg-green-light px-2 py-0.5">
                公開 {publishedCount}
              </span>
              <span className="font-sans text-xs text-midgray bg-offwhite border border-lightgray px-2 py-0.5">
                下書き {draftCount}
              </span>
              <button
                onClick={openCreate}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-green-main text-white font-sans text-xs font-medium hover:bg-green-dark transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                新規作成
              </button>
            </div>
          </div>
          <div className="w-6 h-0.5 bg-green-main mb-6" />

          {loading ? (
            <div className="py-12 text-center">
              <p className="font-sans text-sm text-midgray">読み込み中...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="py-12 text-center border border-dashed border-lightgray">
              <p className="font-sans text-sm text-midgray mb-2">お知らせがありません</p>
              <p className="font-sans text-xs text-midgray/70">「新規作成」から記事を作成してください</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-sans">
                <thead>
                  <tr className="border-b border-lightgray">
                    <th className="text-left py-2 pr-4 text-midgray font-medium">タイトル</th>
                    <th className="text-left py-2 pr-4 text-midgray font-medium hidden md:table-cell">
                      カテゴリ
                    </th>
                    <th className="text-left py-2 pr-4 text-midgray font-medium">状態</th>
                    <th className="text-left py-2 pr-4 text-midgray font-medium hidden md:table-cell">
                      公開日
                    </th>
                    <th className="text-left py-2 text-midgray font-medium">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post) => (
                    <tr
                      key={post.id}
                      className={`border-b border-lightgray/50 hover:bg-offwhite/50 ${
                        !post.is_published ? 'opacity-60' : ''
                      }`}
                    >
                      <td className="py-3 pr-4 text-darkgray max-w-xs truncate">{post.title}</td>
                      <td className="py-3 pr-4 text-darkgray hidden md:table-cell">{post.category}</td>
                      <td className="py-3 pr-4">
                        {post.is_published ? (
                          <span className="text-green-dark bg-green-light px-2 py-0.5">公開</span>
                        ) : (
                          <span className="text-midgray bg-offwhite border border-lightgray px-2 py-0.5">
                            下書き
                          </span>
                        )}
                      </td>
                      <td className="py-3 pr-4 text-darkgray hidden md:table-cell">
                        {fmtDate(post.published_at)}
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => openEdit(post)}
                            className="text-green-dark hover:text-green-deeper underline"
                          >
                            編集
                          </button>
                          <button
                            onClick={() => handleTogglePublish(post)}
                            disabled={togglingId === post.id}
                            className="text-darkgray/60 hover:text-darkgray underline disabled:opacity-50"
                          >
                            {togglingId === post.id ? '...' : post.is_published ? '非公開' : '公開'}
                          </button>
                          <button
                            onClick={() => handleDelete(post.id)}
                            disabled={deletingId === post.id}
                            className="text-pink-main hover:text-pink-main/70 underline disabled:opacity-50"
                          >
                            {deletingId === post.id ? '...' : '削除'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Setup instructions (collapsible) */}
        <div className="bg-white border border-lightgray">
          <button
            type="button"
            onClick={() => setSetupOpen((v) => !v)}
            className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-offwhite/60 transition-colors"
          >
            <span className="font-serif text-base text-green-deeper">初回セットアップ</span>
            <svg
              className={`w-4 h-4 text-midgray flex-shrink-0 transition-transform duration-200 ${setupOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {setupOpen && (
            <div className="px-6 pb-6 border-t border-lightgray">
              <div className="w-6 h-0.5 bg-green-main mt-4 mb-4" />
              <p className="font-sans text-xs text-darkgray/70 mb-4 leading-relaxed">
                初回利用時は Supabase の SQL Editor で以下の SQL を実行し、Storage に{' '}
                <strong>news-assets</strong>（パブリック）バケットを作成してください。
              </p>
              <pre className="bg-offwhite p-4 text-xs font-mono text-darkgray/80 overflow-x-auto whitespace-pre leading-relaxed rounded">
{`-- 1. news_posts テーブル
CREATE TABLE IF NOT EXISTS news_posts (
  id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  title        TEXT        NOT NULL,
  slug         TEXT        NOT NULL UNIQUE,
  excerpt      TEXT        DEFAULT '',
  content      TEXT        DEFAULT '',
  category     TEXT        DEFAULT 'お知らせ',
  is_published BOOLEAN     DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ DEFAULT now(),
  updated_at   TIMESTAMPTZ DEFAULT now()
);

-- 2. news_assets テーブル
CREATE TABLE IF NOT EXISTS news_assets (
  id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  news_post_id UUID        REFERENCES news_posts(id) ON DELETE CASCADE,
  asset_type   TEXT        NOT NULL CHECK (asset_type IN ('image', 'video')),
  url          TEXT        NOT NULL,
  storage_path TEXT,
  file_name    TEXT,
  sort_order   INTEGER     DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT now()
);

-- 3. updated_at 自動更新トリガー
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ language 'plpgsql';

CREATE TRIGGER update_news_posts_updated_at
  BEFORE UPDATE ON news_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 4. Storage: Dashboard > Storage > New bucket
--    名前: news-assets  /  Public bucket: ON`}
              </pre>
            </div>
          )}
        </div>
      </div>
    )
  }

  // ---- Editor view (create / edit) ----
  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <button
        onClick={() => {
          resetForm()
          setView('list')
          setError(null)
          setSuccess(null)
        }}
        className="inline-flex items-center gap-1.5 font-sans text-xs text-midgray hover:text-darkgray transition-colors mb-6"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        一覧に戻る
      </button>

      <div className="bg-white border border-lightgray p-6 md:p-8 space-y-6">
        <div>
          <h2 className="font-serif text-base text-green-deeper mb-1">
            {view === 'create' ? '新規作成' : '記事を編集'}
          </h2>
          <div className="w-6 h-0.5 bg-green-main" />
        </div>

        {error && (
          <div className="bg-pink-light border border-pink-main/30 text-pink-main font-sans text-sm p-3">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-light border border-green-main/30 text-green-deeper font-sans text-sm p-3">
            {success}
          </div>
        )}

        {/* Title */}
        <div>
          <label className="block font-sans text-xs text-darkgray font-medium mb-1.5">
            タイトル <span className="text-pink-main">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="記事のタイトルを入力"
            className="w-full border border-lightgray px-3 py-2 font-sans text-sm text-darkgray focus:outline-none focus:border-green-main transition-colors"
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block font-sans text-xs text-darkgray font-medium mb-1.5">
            スラッグ（URL） <span className="text-pink-main">*</span>
          </label>
          <div className="flex items-center gap-2">
            <span className="font-sans text-xs text-midgray flex-shrink-0">/news/</span>
            <input
              type="text"
              value={slug}
              onChange={(e) =>
                setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))
              }
              placeholder="news-20251101-abc1"
              className="flex-1 border border-lightgray px-3 py-2 font-sans text-sm text-darkgray focus:outline-none focus:border-green-main transition-colors"
            />
          </div>
          <p className="font-sans text-xs text-midgray mt-1">半角英数字・ハイフンのみ使用できます</p>
        </div>

        {/* Category */}
        <div>
          <label className="block font-sans text-xs text-darkgray font-medium mb-1.5">カテゴリ</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="お知らせ"
            className="w-48 border border-lightgray px-3 py-2 font-sans text-sm text-darkgray focus:outline-none focus:border-green-main transition-colors"
          />
        </div>

        {/* Excerpt */}
        <div>
          <label className="block font-sans text-xs text-darkgray font-medium mb-1.5">
            概要（一覧ページに表示される短い説明）
          </label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={3}
            placeholder="記事の概要を入力してください..."
            className="w-full border border-lightgray px-3 py-2 font-sans text-sm text-darkgray focus:outline-none focus:border-green-main transition-colors resize-y"
          />
        </div>

        {/* Content */}
        <div>
          <label className="block font-sans text-xs text-darkgray font-medium mb-1.5">本文</label>
          {view === 'create' && !savedPostId && (
            <p className="font-sans text-xs text-amber-600 bg-amber-50 border border-amber-200 px-3 py-2 mb-2">
              ※ 画像を挿入するには、先に「保存する」を押して記事を作成してください。
            </p>
          )}
          <RichTextEditor
            key={editorKey}
            initialValue={content}
            onChange={setContent}
            postId={savedPostId}
          />
        </div>

        {/* Publish settings */}
        <div className="border border-lightgray p-4 space-y-4">
          <h3 className="font-sans text-xs font-medium text-darkgray">公開設定</h3>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsPublished((v) => !v)}
              className={`relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full transition-colors focus:outline-none ${
                isPublished ? 'bg-green-main' : 'bg-lightgray'
              }`}
              role="switch"
              aria-checked={isPublished}
            >
              <span
                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
                  isPublished ? 'translate-x-[18px]' : 'translate-x-0.5'
                }`}
              />
            </button>
            <span className="font-sans text-sm text-darkgray">
              {isPublished ? '公開' : '下書き（非公開）'}
            </span>
          </div>

          <div>
            <label className="block font-sans text-xs text-darkgray font-medium mb-1.5">公開日時</label>
            <input
              type="datetime-local"
              value={publishedAt}
              onChange={(e) => setPublishedAt(e.target.value)}
              className="border border-lightgray px-3 py-2 font-sans text-sm text-darkgray focus:outline-none focus:border-green-main transition-colors"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 pt-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-green-main text-white font-sans text-sm font-medium hover:bg-green-dark disabled:bg-lightgray disabled:text-midgray disabled:cursor-not-allowed transition-colors"
          >
            {saving ? '保存中...' : '保存する'}
          </button>
          <button
            onClick={() => {
              resetForm()
              setView('list')
              setError(null)
              setSuccess(null)
            }}
            className="font-sans text-sm text-midgray hover:text-darkgray transition-colors"
          >
            キャンセル
          </button>
          {savedPostId && (
            <a
              href={`/news/${slug}`}
              target="_blank"
              rel="noreferrer"
              className="font-sans text-xs text-green-dark hover:underline ml-auto"
            >
              記事を確認 →
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
