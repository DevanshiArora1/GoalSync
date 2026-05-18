import { useEffect, useState } from 'react'
import {
  THRUST_AREAS,
  UOM_TYPES,
  MIN_WEIGHTAGE,
  TARGET_TOTAL_WEIGHTAGE,
  validateGoalForm,
  getTotalWeightage,
} from '../../lib/goalValidation'

const emptyForm = {
  thrustArea: '',
  title: '',
  description: '',
  uomType: '',
  target: '',
  weightage: '',
}

export default function GoalFormModal({ open, onClose, onSave, goals, editingGoal, saving = false }) {
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')

  useEffect(() => {
    if (!open) return
    if (editingGoal) {
      setForm({
        thrustArea: editingGoal.thrustArea,
        title: editingGoal.title,
        description: editingGoal.description,
        uomType: editingGoal.uomType,
        target: String(editingGoal.target),
        weightage: String(editingGoal.weightage),
      })
    } else {
      setForm(emptyForm)
    }
    setErrors({})
    setSubmitError('')
  }, [open, editingGoal])

  if (!open) return null

  const otherTotal = getTotalWeightage(goals.filter((g) => g.id !== editingGoal?.id))
  const remaining = TARGET_TOTAL_WEIGHTAGE - otherTotal

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined, form: undefined }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const nextErrors = validateGoalForm(form, goals, editingGoal?.id)
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }
    setSubmitError('')
    const payload = {
      thrustArea: form.thrustArea.trim(),
      title: form.title.trim(),
      description: form.description.trim(),
      uomType: form.uomType,
      target: Number(form.target),
      weightage: Number(form.weightage),
    }
    try {
      const ok = await onSave(payload)
      if (ok !== false) onClose()
    } catch (err) {
      setSubmitError(err.message || 'Could not save goal')
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="goal-form-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close modal"
      />
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-zinc-700/80 bg-zinc-900 shadow-2xl shadow-black/40">
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-zinc-800 bg-zinc-900/95 backdrop-blur px-6 py-5">
          <div>
            <h2 id="goal-form-title" className="text-lg font-semibold text-zinc-50">
              {editingGoal ? 'Edit goal' : 'Create new goal'}
            </h2>
            <p className="text-xs text-zinc-500 mt-1">
              {remaining}% weightage available · min {MIN_WEIGHTAGE}% per goal
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition"
            aria-label="Close"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {errors.form && (
            <p className="rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2 text-sm text-red-400">
              {errors.form}
            </p>
          )}

          <Field label="Thrust area" error={errors.thrustArea} required>
            <select
              name="thrustArea"
              value={form.thrustArea}
              onChange={handleChange}
              className={inputClass(errors.thrustArea)}
            >
              <option value="">Select thrust area</option>
              {THRUST_AREAS.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Goal title" error={errors.title} required>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Increase enterprise pipeline by 25%"
              className={inputClass(errors.title)}
            />
          </Field>

          <Field label="Description" error={errors.description} required>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder="Measurable outcome and success criteria"
              className={inputClass(errors.description)}
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="UOM type" error={errors.uomType} required>
              <select
                name="uomType"
                value={form.uomType}
                onChange={handleChange}
                className={inputClass(errors.uomType)}
              >
                <option value="">Select unit</option>
                {UOM_TYPES.map((uom) => (
                  <option key={uom} value={uom}>
                    {uom}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Target" error={errors.target} required>
              <input
                name="target"
                type="number"
                min="0"
                step="any"
                value={form.target}
                onChange={handleChange}
                placeholder="100"
                className={inputClass(errors.target)}
              />
            </Field>
          </div>

          <Field label="Weightage (%)" error={errors.weightage} required>
            <input
              name="weightage"
              type="number"
              min={MIN_WEIGHTAGE}
              max={TARGET_TOTAL_WEIGHTAGE}
              step="1"
              value={form.weightage}
              onChange={handleChange}
              placeholder={`${MIN_WEIGHTAGE}–${remaining}`}
              className={inputClass(errors.weightage)}
            />
          </Field>

          {submitError && (
            <p className="rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2 text-sm text-red-400">
              {submitError}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="flex-1 rounded-lg border border-zinc-700 px-4 py-2.5 text-sm font-medium text-zinc-300 hover:bg-zinc-800 transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500 transition shadow-lg shadow-emerald-900/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving…' : editingGoal ? 'Save changes' : 'Add goal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function Field({ label, error, required, children }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-zinc-400 uppercase tracking-wide">
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </span>
      <div className="mt-1.5">{children}</div>
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </label>
  )
}

function inputClass(hasError) {
  return `w-full rounded-lg border bg-zinc-950/80 px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 transition ${
    hasError
      ? 'border-red-500/50 focus:ring-red-500/30'
      : 'border-zinc-700 focus:border-emerald-500/50 focus:ring-emerald-500/20'
  }`
}
