import TaskRow from "./TaskRow";
import { useTasks } from "./hooks";
import type { TaskItem } from "../../api/types";

type Props = {
  onEdit: (t: TaskItem) => void;
};

export default function TaskList({ onEdit }: Props) {
  const { data, isLoading, isError, error, refetch, isFetching } = useTasks();

  if (isLoading) {
    return (
      <div className="rounded border bg-white p-4">
        <p className="animate-pulse text-sm text-gray-500">Loading tasks…</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded border bg-white p-4">
        <p className="text-sm text-red-600">
          Failed to load. { (error as any)?.message ?? "" }
        </p>
        <button onClick={() => refetch()} className="mt-2 rounded border px-3 py-1 text-sm">
          Try again
        </button>
      </div>
    );
  }

  const tasks = data ?? [];
  const pendingCount = tasks.filter(t => !t.completed).length;

  const taskLabel = tasks.length === 1 ? "task" : "tasks";
  const pendingLabel = pendingCount === 1 ? "pending" : "pending";

  return (
    <div className="rounded-xl border bg-white">
      <div className="flex items-center justify-between border-b p-3">
        <p className="text-sm text-gray-700">
          {tasks.length} {taskLabel} — {pendingCount} {pendingLabel}
        </p>
        <button
          onClick={() => refetch()}
          className="rounded border px-3 py-1 text-sm"
        >
          {isFetching ? "Refreshing…" : "Refresh"}
        </button>
      </div>

      {tasks.length === 0 ? (
        <div className="p-4 text-sm text-gray-600">No tasks found.</div>
      ) : (
        <ul className="divide-y p-3">
          {tasks.map((t) => (
            <TaskRow key={t.id} task={t} onEdit={onEdit} />
          ))}
        </ul>
      )}
    </div>
  );
}
