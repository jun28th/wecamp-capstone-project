import { useState } from "react";

export function useTaskModals({ addTask, editTask, removeTask }) {
  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskPendingDelete, setTaskPendingDelete] = useState(null);

  const openCreateForm = () => {
    setEditingTask(null);
    setFormOpen(true);
  };

  const openEditForm = (task) => {
    setEditingTask(task);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditingTask(null);
  };

  const handleSave = async (data) => {
    const success = editingTask ? await editTask(editingTask.id, data) : await addTask(data);
    if (success) closeForm();
  };

  const handleConfirmDelete = async () => {
    const success = await removeTask(taskPendingDelete.id);
    if (success) setTaskPendingDelete(null);
  };

  return {
    formOpen, editingTask, taskPendingDelete,
    openCreateForm, openEditForm, closeForm,
    handleSave, handleConfirmDelete,
    setTaskPendingDelete,
  };
}