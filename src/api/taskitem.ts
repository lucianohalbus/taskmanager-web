import api from "./axios"; 
import type { TaskItem, CreateTaskDto, UpdateTaskDto } from "./types";

const BASE = "/taskitem";

function normalizeTask(raw: any): TaskItem {
  const id =
    raw?.id ?? raw?.taskItemId ?? raw?.Id;

  const title =
    raw?.title ?? raw?.name ?? raw?.Title ?? raw?.Name ?? "";

  const completed =
    (typeof raw?.completed === "boolean" && raw.completed) ||
    (typeof raw?.isCompleted === "boolean" && raw.isCompleted) ||
    (typeof raw?.done === "boolean" && raw.done) ||
    false;

  const description =
    raw?.description ?? raw?.Description ?? undefined;

  const createdAt =
    raw?.createdAt ?? raw?.created ?? raw?.CreatedAt ?? undefined;

  const updatedAt =
    raw?.updatedAt ?? raw?.updated ?? raw?.UpdatedAt ?? undefined;

  return {
    id,
    title,
    completed,
    description,
    createdAt,
    updatedAt,
    ...raw, 
  };
}

function toApiPayload(input: CreateTaskDto | UpdateTaskDto) {
  const payload: any = {};
  if (typeof input.title !== "undefined") payload.title = input.title;
  if (typeof input.description !== "undefined") payload.description = input.description;

  if (typeof input.completed !== "undefined") {
    payload.completed = input.completed;
    payload.isCompleted = input.completed;
    payload.done = input.completed;
  }

  return payload;
}

// --- CRUD ---
// GET /taskitem
export async function getTasks(signal?: AbortSignal): Promise<TaskItem[]> {
  const { data } = await api.get(`${BASE}`, { signal });
  return Array.isArray(data) ? data.map(normalizeTask) : [];
}

// GET /taskitem/{id}
export async function getTask(id: number, signal?: AbortSignal): Promise<TaskItem> {
  const { data } = await api.get(`${BASE}/${id}`, { signal });
  return normalizeTask(data);
}

// POST /taskitem
export async function createTask(dto: CreateTaskDto): Promise<TaskItem> {
  const payload = toApiPayload(dto);
  const { data } = await api.post(`${BASE}`, payload);
  return normalizeTask(data);
}

// PUT /taskitem/{id}
export async function updateTask(id: number, dto: UpdateTaskDto): Promise<TaskItem> {
  const payload = toApiPayload(dto);
  const { data } = await api.put(`${BASE}/${id}`, payload);
  return normalizeTask(data);
}

// DELETE /taskitem/{id}
export async function deleteTask(id: number): Promise<void> {
  await api.delete(`${BASE}/${id}`);
}
