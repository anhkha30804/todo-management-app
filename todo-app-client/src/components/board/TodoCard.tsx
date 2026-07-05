'use client'

import { format } from 'date-fns'
import { CalendarDays, Loader2, Pencil, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Todo, TodoStatus, TodoPriority } from '@/types/todo.types'
import { PRIORITY_CONFIG, STATUS_CONFIG } from '@/constants/todo.constants'
import { useUpdateTodo, useDeleteTodo } from '@/hooks/useTodos'
import { toast } from 'sonner'
import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'

interface TodoCardProps {
   todo: Todo
   onEdit: (todo: Todo) => void
   isOverlay?: boolean
}

const NEXT_STATUS: Record<TodoStatus, TodoStatus> = {
   [TodoStatus.PENDING]: TodoStatus.IN_PROGRESS,
   [TodoStatus.IN_PROGRESS]: TodoStatus.COMPLETED,
   [TodoStatus.COMPLETED]: TodoStatus.PENDING
}

function fmtDate(iso: string) {
   return format(new Date(iso), 'MMM d')
}

export function TodoCard({ todo, onEdit, isOverlay }: TodoCardProps) {
   const { mutate: updateTodo } = useUpdateTodo()
   const { mutate: deleteTodo } = useDeleteTodo()

   const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
      id: todo._id,
      disabled: isOverlay
   })

   const style = {
      transform: transform ? CSS.Translate.toString(transform) : undefined,
      opacity: isDragging ? 0.3 : undefined
   }

   const handleStatusCycle = (e: React.MouseEvent) => {
      e.stopPropagation()
      updateTodo(
         { id: todo._id, payload: { status: NEXT_STATUS[todo.status] } },
         { onError: () => toast.error('Failed to update status') }
      )
   }

   const handleDelete = (e: React.MouseEvent) => {
      e.stopPropagation()
      deleteTodo(todo._id, {
         onSuccess: () => toast.success('Task deleted'),
         onError: () => toast.error('Failed to delete task')
      })
   }

   const dateLabel = [
      todo.start_date && fmtDate(todo.start_date),
      todo.end_date && fmtDate(todo.end_date)
   ]
      .filter(Boolean)
      .join(' – ')

   if (isDragging) {
      return (
         <div
            ref={setNodeRef}
            style={style}
            className="h-[100px] w-full rounded-xl border border-dashed border-slate-200 bg-slate-50/50"
         />
      )
   }

   return (
      <div
         ref={setNodeRef}
         style={style}
         {...listeners}
         {...attributes}
         className={cn(
            'group relative bg-white rounded-xl p-4 select-none cursor-grab active:cursor-grabbing',
            'border border-slate-200/80 shadow-sm hover:shadow-md hover:-translate-y-[1px] hover:border-slate-300 transition-all duration-200',
            isOverlay && 'shadow-xl scale-[1.02] border-primary/40',
            todo.isMutating && 'pointer-events-none'
         )}
         onClick={todo.isMutating ? undefined : () => onEdit(todo)}
      >
         {/* Hover actions */}
         <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <button
               onClick={(e) => {
                  e.stopPropagation()
                  onEdit(todo)
               }}
               className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 transition-colors"
               title="Edit"
            >
               <Pencil size={12} />
            </button>
            <button
               onClick={handleDelete}
               className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-700 transition-colors"
               title="Delete"
            >
               <Trash2 size={12} />
            </button>
         </div>

         {/* Badges row */}
         <div className="flex flex-wrap items-center gap-1.5 mb-2">
            <span
               className={cn(
                  'text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider',
                  PRIORITY_CONFIG[todo.priority].badgeClass
               )}
            >
               {PRIORITY_CONFIG[todo.priority].label}
            </span>
            {todo.isOverdue && (
               <span className="text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider bg-red-50 text-red-600 border border-red-100">
                  Overdue
               </span>
            )}
         </div>

         {/* Title */}
         <p
            className={cn(
               'text-[13px] font-semibold leading-snug text-slate-800 line-clamp-1 pr-12 transition-all',
               todo.status === TodoStatus.COMPLETED && 'line-through text-slate-400 font-normal'
            )}
         >
            {todo.title}
         </p>

         {/* Description */}
         {todo.description && (
            <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
               {todo.description}
            </p>
         )}

         {/* Footer */}
         <div className="flex items-center justify-between mt-3">
            <button
               onClick={handleStatusCycle}
               className="flex items-center gap-1.5 group/s"
               title="Click to cycle status"
            >
               <span
                  className={cn(
                     'w-2 h-2 rounded-full transition-transform group-hover/s:scale-125',
                     STATUS_CONFIG[todo.status].dotClass
                  )}
               />
               <span className="text-[11px] text-slate-500 group-hover/s:text-slate-700 font-medium transition-colors">
                  {STATUS_CONFIG[todo.status].label}
               </span>
            </button>

            {dateLabel && (
               <div className="flex items-center gap-1 text-[11px] text-slate-400">
                  <CalendarDays size={11} />
                  <span className="font-medium">{dateLabel}</span>
               </div>
            )}
         </div>

         {/* Optimistic mutation overlay */}
         {todo.isMutating && (
            <div className="absolute inset-0 z-30 flex items-center justify-center rounded-xl bg-white/60 backdrop-blur-[1px]">
               <Loader2 className="h-5 w-5 animate-spin text-violet-600" />
            </div>
         )}
      </div>
   )
}
