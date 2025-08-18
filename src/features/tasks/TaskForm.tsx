import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { CreateTaskDto, TaskItem } from "../../api/types";
import { useCreateTask, useUpdateTask, apiErrorMessage } from "./hooks";

const schema = z.object({
  title: z.string().min(1, "Enter a title"),
  description: z.string().optional(),
  completed: z.boolean().optional(),
});
type FormData = z.infer<typeof schema>;

type Props = {
  initial?: TaskItem;            
  onSaved?: () => void;
  onCancelEdit?: () => void;
};

export default function TaskForm({ initial, onSaved, onCancelEdit }: Props) {
  const isEditing = !!initial;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: initial?.title ?? "",
      description: initial?.description ?? "",
      completed: initial?.completed ?? false,
    },
  });

  useEffect(() => {
    reset({
      title: initial?.title ?? "",
      description: initial?.description ?? "",
      completed: initial?.completed ?? false,
    });
  }, [initial, reset]);

  const createMut = useCreateTask();
  const updateMut = useUpdateTask();

  const onSubmit = async (data: FormData) => {
    try {
      if (isEditing && initial) {
        await updateMut.mutateAsync({ id: initial.id, dto: data as CreateTaskDto });
      } else {
        await createMut.mutateAsync(data as CreateTaskDto);
      }
      reset({ title: "", description: "", completed: false });
      onSaved?.();
    } catch (err) {
      console.error(err);
    }
  };

  const submitError =
    createMut.isError ? apiErrorMessage(createMut.error) :
    updateMut.isError ? apiErrorMessage(updateMut.error) : null;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-xl border bg-white p-4 shadow-sm"
    >
      <div className="mb-2">
        <label className="block text-sm font-medium">Title</label>
        <input
          className="mt-1 w-full rounded border px-3 py-2"
          placeholder="E.g.: Buy coffee"
          {...register("title")}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div className="mb-2">
        <label className="block text-sm font-medium">Description (optional)</label>
        <textarea
          className="mt-1 w-full rounded border px-3 py-2"
          rows={3}
          placeholder="Task details..."
          {...register("description")}
        />
      </div>

      {isEditing && (
        <label className="mb-3 inline-flex items-center gap-2 text-sm">
          <input type="checkbox" className="size-4" {...register("completed")} />
          Mark as completed
        </label>
      )}

      {submitError && (
        <p className="mt-2 text-sm text-red-600">{submitError}</p>
      )}

      <div className="mt-3 flex items-center gap-2">
        <button
          type="submit"
          disabled={isSubmitting || createMut.isPending || updateMut.isPending}
          className="rounded bg-black px-4 py-2 text-white disabled:opacity-60"
        >
          {isEditing
            ? (updateMut.isPending ? "Saving..." : "Save changes")
            : (createMut.isPending ? "Adding..." : "Add")}
        </button>

        {isEditing && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="rounded border px-4 py-2"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
