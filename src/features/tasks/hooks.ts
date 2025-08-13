import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";

import {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
} from "../../api/taskitem";

import type {
  TaskItem,
  CreateTaskDto,
  UpdateTaskDto,
  ApiProblemDetails,
} from "../../api/types";

// -------------------- Query Keys --------------------
const qk = {
  all: ["tasks"] as const,
  byId: (id: number) => ["tasks", id] as const,
};

// -------------------- Helpers --------------------
function findIndexById(list: TaskItem[], id: number) {
  return list.findIndex((t) => t.id === id);
}

export function apiErrorMessage(err: unknown): string {
  const anyErr = err as any;
  const data: ApiProblemDetails | undefined = anyErr?.response?.data;
  if (data?.title) return data.title;
  if (data?.detail) return data.detail!;
  if (data?.errors) {
    const firstKey = Object.keys(data.errors)[0];
    if (firstKey) return data.errors[firstKey][0];
  }
  return anyErr?.message ?? "Erro inesperado.";
}

// -------------------- Queries --------------------
export function useTasks(options?: Partial<UseQueryOptions<TaskItem[]>>) {
  return useQuery({
    queryKey: qk.all,
    queryFn: ({ signal }) => getTasks(signal),
    // Ajuste fino de UX/perf:
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    retry: 1,
    ...options,
  });
}

export function useTask(id: number, enabled = true) {
  return useQuery({
    queryKey: qk.byId(id),
    queryFn: ({ signal }) => getTask(id, signal),
    enabled,
    staleTime: 30_000,
    retry: 1,
  });
}

// -------------------- Mutations (optimistic) --------------------

// CREATE
export function useCreateTask() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateTaskDto) => createTask(dto),

    // Optimistic add
    onMutate: async (dto) => {
      await qc.cancelQueries({ queryKey: qk.all });

      const prev = qc.getQueryData<TaskItem[]>(qk.all) ?? [];

      // id temporário negativo para não colidir
      const temp: TaskItem = {
        id: -Date.now(),
        title: dto.title,
        description: dto.description,
        completed: !!dto.completed,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      qc.setQueryData<TaskItem[]>(qk.all, [temp, ...prev]);

      return { prev, tempId: temp.id };
    },

    onError: (_err, _dto, ctx) => {
      if (!ctx) return;
      qc.setQueryData<TaskItem[]>(qk.all, ctx.prev);
    },

    onSuccess: (serverItem, _dto, ctx) => {
      const current = qc.getQueryData<TaskItem[]>(qk.all) ?? [];
      const idx = findIndexById(current, ctx?.tempId ?? -999);
      if (idx >= 0) {
        const next = current.slice();
        next[idx] = serverItem;
        qc.setQueryData(qk.all, next);
      } else {
        qc.invalidateQueries({ queryKey: qk.all });
      }
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: qk.all });
    },
  });
}

// UPDATE
export function useUpdateTask() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: UpdateTaskDto }) =>
      updateTask(id, dto),

    onMutate: async ({ id, dto }) => {
      await qc.cancelQueries({ queryKey: qk.all });

      const prev = qc.getQueryData<TaskItem[]>(qk.all) ?? [];

      const idx = findIndexById(prev, id);
      if (idx >= 0) {
        const next = prev.slice();
        next[idx] = { ...next[idx], ...dto, updatedAt: new Date().toISOString() };
        qc.setQueryData(qk.all, next);
      }

      return { prev };
    },

    onError: (_err, _vars, ctx) => {
      if (!ctx) return;
      qc.setQueryData<TaskItem[]>(qk.all, ctx.prev);
    },

    onSuccess: (serverItem) => {
      const current = qc.getQueryData<TaskItem[]>(qk.all) ?? [];
      const idx = findIndexById(current, serverItem.id);
      if (idx >= 0) {
        const next = current.slice();
        next[idx] = serverItem;
        qc.setQueryData(qk.all, next);
      }
    },

    onSettled: (_res, _err, vars) => {
      qc.invalidateQueries({ queryKey: qk.all });
      if (vars?.id) qc.invalidateQueries({ queryKey: qk.byId(vars.id) });
    },
  });
}

// TOGGLE completed
export function useToggleTask() {
  const mutate = useUpdateTask();
  return {
    toggle: (task: TaskItem) =>
      mutate.mutate({ id: task.id, dto: { completed: !task.completed } }),
    ...mutate,
  };
}

// DELETE
export function useDeleteTask() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteTask(id),

    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: qk.all });

      const prev = qc.getQueryData<TaskItem[]>(qk.all) ?? [];
      const next = prev.filter((t) => t.id !== id);
      qc.setQueryData(qk.all, next);

      return { prev };
    },

    onError: (_err, _id, ctx) => {
      if (!ctx) return;
      qc.setQueryData<TaskItem[]>(qk.all, ctx.prev);
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: qk.all });
    },
  });
}
