import { todoService } from '@/services/todo.service'
import {
  ApiResponse,
  CreateTodoPayload,
  Todo,
  TodoQueryParams,
  UpdateTodoPayload
} from '@/types/todo.types'
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

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
    onMutate: async ({ id, payload }) => {
      await queryClient.cancelQueries({ queryKey: TODO_KEYS.all })
      const previousQueries = queryClient.getQueriesData<ApiResponse<Todo[]>>({
        queryKey: TODO_KEYS.all
      })

      queryClient.setQueriesData<ApiResponse<Todo[]>>({ queryKey: TODO_KEYS.all }, (old) => {
        if (!old) return old
        return {
          ...old,
          data: old.data.map((t) => (t._id === id ? { ...t, ...payload, isMutating: true } : t))
        }
      })

      return { previousQueries }
    },
    onError: (err, newTodo, context) => {
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, value]) => {
          queryClient.setQueryData(queryKey, value)
        })
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: TODO_KEYS.all })
    }
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
