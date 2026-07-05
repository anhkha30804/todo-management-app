import { http } from "@/lib/api";
import { ApiResponse, CreateTodoPayload, Todo, TodoQueryParams, UpdateTodoPayload } from "@/types/todo.types";

const buildQuery = (params: TodoQueryParams) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") query.append(key, String(value));
  });
  return query.toString();
};

export const todoService = {
  getAll: (params: TodoQueryParams = {}) => {
    const query = buildQuery(params);
    return http.get<ApiResponse<Todo[]>>(`/todos${query ? `?${query}` : ""}`);
  },

  getOne: (id: string) => http.get<ApiResponse<Todo>>(`/todos/${id}`),

  create: (payload: CreateTodoPayload) => http.post<ApiResponse<Todo>>("/todos", payload),

  update: (id: string, payload: UpdateTodoPayload) => http.patch<ApiResponse<Todo>>(`/todos/${id}`, payload),

  toggle: (id: string) => http.patch<ApiResponse<Todo>>(`/todos/${id}/toggle`, {}),

  remove: (id: string) => http.delete<void>(`/todos/${id}`)
};
