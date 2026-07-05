import { todoService } from '@/services/todo.service'
import { CreateTodoPayload, TodoQueryParams, UpdateTodoPayload } from '@/types/todo.types'
import { useMutation, useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query'

export const TODO_KEYS = {
  all: ['todos'] as const,
  list: (params: TodoQueryParams) => ['todos', 'list', params] as const,
  detail: (id: string) => ['todos', 'detail', id] as const
}

export function useTodos(params: TodoQueryParams = {}) {
  return useQuery({
    queryKey: TODO_KEYS.list(params),
    queryFn: () => todoService.getAll(params),
    placeholderData: keepPreviousData
  })
}

export function useTodo(id: string) {
  return useQuery({
    queryKey: TODO_KEYS.detail(id),
    queryFn: () => todoService.getOne(id),
    enabled: !!id
  })
}

export function useCreateTodo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateTodoPayload) => todoService.create(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: TODO_KEYS.all })
  })
}

export function useUpdateTodo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateTodoPayload }) =>
      todoService.update(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: TODO_KEYS.all })
  })
}

export function useToggleTodo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => todoService.toggle(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: TODO_KEYS.all })
  })
}

export function useDeleteTodo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => todoService.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: TODO_KEYS.all })
  })
}
