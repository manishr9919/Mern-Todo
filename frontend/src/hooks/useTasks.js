import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import toast from 'react-hot-toast';

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTasks = async (endpoint = '/tasks/user') => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(endpoint);
      setTasks(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch tasks');
      toast.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (taskData) => {
    try {
      const response = await api.post('/tasks', taskData);
      setTasks(prev => [response.data.task, ...prev]);
      toast.success('Task created successfully');
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to create task';
      toast.error(message);
      return { success: false, message };
    }
  };

  const updateTaskStatus = async (taskId, status) => {
    try {
      const response = await api.put(`/tasks/${taskId}/status`, { status });
      setTasks(prev => 
        prev.map(task => 
          task._id === taskId ? { ...task, status } : task
        )
      );
      toast.success('Task status updated');
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update task';
      toast.error(message);
      return { success: false, message };
    }
  };

  const updateTask = async (taskId, taskData) => {
    try {
      const response = await api.put(`/tasks/${taskId}`, taskData);
      setTasks(prev => 
        prev.map(task => 
          task._id === taskId ? response.data.task : task
        )
      );
      toast.success('Task updated successfully');
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update task';
      toast.error(message);
      return { success: false, message };
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks(prev => prev.filter(task => task._id !== taskId));
      toast.success('Task deleted successfully');
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to delete task';
      toast.error(message);
      return { success: false, message };
    }
  };

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTaskStatus,
    updateTask,
    deleteTask
  };
};
