import type { TaskItem } from "../../api/types";
import { useDeleteTask, useToggleTask } from "./hooks";

type Props = {
  task: TaskItem;
  onEdit: (t: TaskItem) => void;
};

export default function TaskRow({ task, onEdit }: Props) {
  const { toggle, isPending: toggling } = useToggleTask();
  const del = useDeleteTask();

  const onToggle = () => toggle(task);
  const onDelete = () => {
    if (confirm(`Excluir "${task.title}"?`)) del.mutate(task.id);
  };

  return (
    <li className="flex items-start justify-between gap-3 rounded border bg-white p-3">
      <label className="flex flex-1 items-start gap-3">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={onToggle}
          disabled={toggling}
          className="mt-1 size-4"
        />
        <div>
          <p className={`font-medium ${task.completed ? "line-through text-gray-500" : ""}`}>
            {task.title}
          </p>
          {task.description && (
            <p className="text-sm text-gray-600">{task.description}</p>
          )}
        </div>
      </label>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onEdit(task)}
          className="rounded border px-3 py-1 text-sm"
        >
          Editar
        </button>
        <button
          onClick={onDelete}
          disabled={del.isPending}
          className="rounded bg-red-600 px-3 py-1 text-sm text-white disabled:opacity-60"
        >
          {del.isPending ? "Excluindo..." : "Excluir"}
        </button>
      </div>
    </li>
  );
}
