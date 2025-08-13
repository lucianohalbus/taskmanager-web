import { useState } from "react";
import type { TaskItem } from "../api/types";
import TaskList from "../features/tasks/TaskList";
import TaskForm from "../features/tasks/TaskForm";

export default function TasksPage() {
  const [editing, setEditing] = useState<TaskItem | null>(null);

  return (
    <div className="mx-auto max-w-3xl p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Minhas Tasks</h1>
        <p className="text-sm text-gray-600">
          Crie, edite, conclua e exclua tarefas. Atualizações são otimistas.
        </p>
      </header>

      <section className="mb-6">
        <TaskForm
          key={editing?.id ?? "create"}
          initial={editing ?? undefined}
          onSaved={() => setEditing(null)}
          onCancelEdit={() => setEditing(null)}
        />
      </section>

      <section>
        <TaskList onEdit={(t) => setEditing(t)} />
      </section>
    </div>
  );
}
