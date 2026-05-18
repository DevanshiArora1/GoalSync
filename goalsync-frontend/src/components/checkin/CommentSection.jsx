import { useState } from 'react'

export default function CommentSection({ comments, onAddComment, readOnly = false, accent = 'sky' }) {
  const [draft, setDraft] = useState('')
  const btnClass =
    accent === 'sky'
      ? 'bg-sky-600 hover:bg-sky-500 shadow-sky-900/30'
      : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/30'

  function handleSubmit(e) {
    e.preventDefault()
    if (!draft.trim()) return
    onAddComment(draft)
    setDraft('')
  }

  return (
    <div className="space-y-4">
      <h4 className="text-xs font-medium uppercase tracking-wide text-zinc-500">Manager comments</h4>

      {comments.length === 0 ? (
        <p className="text-sm text-zinc-600 py-2">No comments yet.</p>
      ) : (
        <ul className="space-y-3 max-h-48 overflow-y-auto pr-1">
          {comments.map((c) => (
            <li
              key={c.id}
              className="rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2.5"
            >
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-xs font-semibold text-zinc-300">{c.authorName}</span>
                <span className="text-[10px] text-zinc-600">{c.date}</span>
                {c.role === 'manager' && (
                  <span className="text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded bg-sky-500/15 text-sky-400">
                    Manager
                  </span>
                )}
              </div>
              <p className="text-sm text-zinc-400 leading-relaxed">{c.text}</p>
            </li>
          ))}
        </ul>
      )}

      {!readOnly && onAddComment && (
        <form onSubmit={handleSubmit} className="space-y-2">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={2}
            placeholder="Add feedback on progress…"
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950/80 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500/50 resize-none"
          />
          <button
            type="submit"
            disabled={!draft.trim()}
            className={`rounded-lg px-4 py-2 text-xs font-semibold text-white transition shadow-lg disabled:opacity-40 disabled:cursor-not-allowed ${btnClass}`}
          >
            Post comment
          </button>
        </form>
      )}
    </div>
  )
}
