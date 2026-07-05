'use client'

import { Plus, ClipboardCheck } from 'lucide-react'
import { Todo, TodoStatus } from '@/types/todo.types'
import { STATUS_CONFIG } from '@/constants/todo.constants'
import { TodoCard } from './TodoCard'
import { useDroppable } from '@dnd-kit/core'
import { cn } from '@/lib/utils'

const TOP_BORDER_CLASS: Record<TodoStatus, string> = {
   [TodoStatus.PENDING]: 'border-t-violet-500',
   [TodoStatus.IN_PROGRESS]: 'border-t-amber-500',
   [TodoStatus.COMPLETED]: 'border-t-teal-500'
}

interface KanbanColumnProps {
   status: TodoStatus
   todos: Todo[]
   onEdit: (todo: Todo) => void
   onAdd: () => void
}

export function KanbanColumn({ status, todos, onEdit, onAdd }: KanbanColumnProps) {
   const config = STATUS_CONFIG[status]
   const isCompleted = status === TodoStatus.COMPLETED

   const { setNodeRef, isOver } = useDroppable({
      id: status
   })

   return (
      <div
         className={cn(
            'flex flex-col h-full transition-all duration-300',
            isCompleted ? 'flex-[2] min-w-[540px]' : 'flex-1 min-w-[260px]'
         )}
      >
         {/* Column header */}
         <div className="flex items-center justify-between px-1.5 pb-3 shrink-0 select-none">
            <div className="flex items-center gap-1.5">
               <span className="text-sm font-bold text-slate-800 tracking-tight">
                  {config.label}
               </span>
               <span className="text-sm font-normal text-slate-400">{todos.length}</span>
            </div>
            {status === TodoStatus.PENDING && (
               <button
                  onClick={onAdd}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                  title={`Add to ${config.label}`}
               >
                  <Plus size={15} />
               </button>
            )}
         </div>

         {/* Cards + add button container */}
         <div
            className={cn(
               'flex-1 bg-slate-50/50 rounded-2xl border border-slate-200/80 flex flex-col overflow-hidden shadow-xs border-t-4',
               TOP_BORDER_CLASS[status]
            )}
         >
            {/* Cards list */}
            <div
               ref={setNodeRef}
               className={cn(
                  'flex-1 overflow-y-auto p-3 min-h-0 transition-colors duration-150 rounded-t-2xl',
                  isCompleted
                     ? 'grid grid-cols-1 xl:grid-cols-2 gap-2.5 content-start'
                     : 'flex flex-col gap-2.5',
                  isOver && 'bg-slate-100/50'
               )}
            >
               {todos.length === 0 ? (
                  <div className="col-span-full flex-1 flex flex-col items-center pt-[180px] px-4 text-center select-none">
                     <div className="w-10 h-10 rounded-xl bg-white border border-slate-200/80 flex items-center justify-center text-slate-400 mb-3 shadow-xs">
                        <ClipboardCheck size={16} />
                     </div>
                     <p className="text-xs font-semibold text-slate-700">No tasks here</p>
                     <p className="text-[10px] text-slate-400 mt-1">
                        Drag tasks or click add to create
                     </p>
                  </div>
               ) : (
                  todos.map((todo) => <TodoCard key={todo._id} todo={todo} onEdit={onEdit} />)
               )}
            </div>

            {/* Add task */}
            {status === TodoStatus.PENDING && (
               <div className="px-3 pb-3 pt-1 shrink-0">
                  <button
                     onClick={onAdd}
                     className="w-full flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 bg-white border border-slate-200/80 hover:bg-slate-50 hover:border-slate-300 active:scale-98 transition-all cursor-pointer shadow-xs"
                  >
                     <Plus size={12} />
                     Add task
                  </button>
               </div>
            )}
         </div>
      </div>
   )
}
