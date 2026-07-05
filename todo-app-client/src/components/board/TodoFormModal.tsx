'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useCreateTodo, useUpdateTodo } from '@/hooks/useTodos'
import {
  CreateTodoPayload,
  Todo,
  TodoPriority,
  TodoStatus,
  UpdateTodoPayload
} from '@/types/todo.types'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

interface TodoFormModalProps {
  open: boolean
  onClose: () => void
  todo?: Todo | null
  defaultStatus?: TodoStatus
}

function toLocal(iso?: string) {
  if (!iso) return ''
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function toIso(local: string) {
  if (!local) return undefined
  return new Date(local).toISOString()
}

const EMPTY = {
  title: '',
  description: '',
  priority: TodoPriority.MEDIUM,
  status: TodoStatus.PENDING,
  start_date: '',
  end_date: ''
}

export function TodoFormModal({ open, onClose, todo, defaultStatus }: TodoFormModalProps) {
  const isEdit = !!todo
  const { mutate: createTodo, isPending: creating } = useCreateTodo()
  const { mutate: updateTodo, isPending: updating } = useUpdateTodo()
  const saving = creating || updating

  const [form, setForm] = useState(EMPTY)

  const minStartDate = isEdit ? undefined : toLocal(new Date().toISOString())
  const minEndDate = form.start_date || (isEdit ? undefined : toLocal(new Date().toISOString()))

  useEffect(() => {
    if (!open) return
    if (todo) {
      setForm({
        title: todo.title,
        description: todo.description ?? '',
        priority: todo.priority,
        status: todo.status,
        start_date: toLocal(todo.start_date),
        end_date: toLocal(todo.end_date)
      })
    } else {
      setForm({ ...EMPTY, status: TodoStatus.PENDING })
    }
  }, [open, todo, defaultStatus])

  const set = (key: keyof typeof EMPTY) => (val: string) => setForm((f) => ({ ...f, [key]: val }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.title.trim()) {
      toast.error('Title is required')
      return
    }
    if (form.title.length > 200) {
      toast.error('Title cannot exceed 200 characters')
      return
    }
    if (form.description.length > 1000) {
      toast.error('Description cannot exceed 1000 characters')
      return
    }
    if (!form.start_date) {
      toast.error('Start date is required')
      return
    }
    if (!form.end_date) {
      toast.error('End date is required')
      return
    }
    if (new Date(form.end_date) < new Date(form.start_date)) {
      toast.error('End date must be after start date')
      return
    }

    if (isEdit) {
      const payload: UpdateTodoPayload = {
        title: form.title.trim(),
        description: form.description.trim() || undefined,
        priority: form.priority,
        status: form.status,
        start_date: toIso(form.start_date),
        end_date: toIso(form.end_date)
      }
      updateTodo(
        { id: todo._id, payload },
        {
          onSuccess: () => {
            toast.success('Task updated')
            onClose()
          },
          onError: () => toast.error('Failed to update task')
        }
      )
    } else {
      const payload: CreateTodoPayload = {
        title: form.title.trim(),
        description: form.description.trim() || undefined,
        priority: form.priority,
        status: TodoStatus.PENDING,
        start_date: toIso(form.start_date),
        end_date: toIso(form.end_date)
      }
      createTodo(payload, {
        onSuccess: () => {
          toast.success('Task created')
          onClose()
        },
        onError: () => toast.error('Failed to create task')
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-[460px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Task' : 'New Task'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-1">
          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="fm-title">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="fm-title"
              placeholder="What needs to be done?"
              value={form.title}
              onChange={(e) => set('title')(e.target.value)}
              maxLength={200}
              autoFocus
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="fm-desc">Description</Label>
            <Textarea
              id="fm-desc"
              placeholder="Add details..."
              value={form.description}
              onChange={(e) => set('description')(e.target.value)}
              rows={3}
              maxLength={1000}
              className="resize-none"
            />
          </div>

          {/* Priority + Status */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label>Priority</Label>
              <Select
                value={form.priority}
                onValueChange={(v) => v && set('priority')(v as string)}
              >
                <SelectTrigger>
                  <SelectValue>
                    {form.priority === TodoPriority.LOW && 'Low'}
                    {form.priority === TodoPriority.MEDIUM && 'Medium'}
                    {form.priority === TodoPriority.HIGH && 'High'}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={TodoPriority.LOW}>Low</SelectItem>
                  <SelectItem value={TodoPriority.MEDIUM}>Medium</SelectItem>
                  <SelectItem value={TodoPriority.HIGH}>High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>Status</Label>
              <Select
                value={form.status}
                onValueChange={(v) => v && set('status')(v as string)}
                disabled={!isEdit}
              >
                <SelectTrigger>
                  <SelectValue>
                    {form.status === TodoStatus.PENDING && 'Pending'}
                    {form.status === TodoStatus.IN_PROGRESS && 'In Progress'}
                    {form.status === TodoStatus.COMPLETED && 'Completed'}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={TodoStatus.PENDING}>Pending</SelectItem>
                  <SelectItem value={TodoStatus.IN_PROGRESS}>In Progress</SelectItem>
                  <SelectItem value={TodoStatus.COMPLETED}>Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="fm-start">
                Start Date <span className="text-destructive">*</span>
              </Label>
              <input
                id="fm-start"
                type="datetime-local"
                value={form.start_date}
                onChange={(e) => set('start_date')(e.target.value)}
                min={minStartDate}
                className="h-9 px-3 py-2 text-sm border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="fm-end">
                End Date <span className="text-destructive">*</span>
              </Label>
              <input
                id="fm-end"
                type="datetime-local"
                value={form.end_date}
                onChange={(e) => set('end_date')(e.target.value)}
                min={minEndDate}
                className="h-9 px-3 py-2 text-sm border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="bg-linear-to-r from-teal-600 to-emerald-600 text-white shadow-sm border border-emerald-500/20 hover:opacity-90 active:scale-[0.98] transition-all"
            >
              {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Task'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
