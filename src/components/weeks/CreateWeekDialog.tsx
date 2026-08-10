"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createWeek } from "@/lib/weeks";

export default function CreateWeekDialog() {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [deadline, setDeadline] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!deadline) return;

    try {
      setIsSaving(true);

      // Convert datetime-local to ISO string
      const isoDeadline = new Date(deadline).toISOString();

      await createWeek(isoDeadline);

      setDeadline("");
      setOpen(false);

      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Unable to create week.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className="rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700">
          + Create Week
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40" />

        <Dialog.Content className="fixed left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-xl">
          <Dialog.Title className="mb-4 text-xl font-bold">
            Create New Week
          </Dialog.Title>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">
                Deadline
              </label>

              <input
                type="datetime-local"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full rounded border p-2"
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Dialog.Close asChild>
                <button
                  type="button"
                  disabled={isSaving}
                  className="rounded border px-4 py-2"
                >
                  Cancel
                </button>
              </Dialog.Close>

              <button
                type="submit"
                disabled={isSaving}
                className="rounded bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-700 disabled:opacity-50"
              >
                {isSaving ? "Creating..." : "Create Week"}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}