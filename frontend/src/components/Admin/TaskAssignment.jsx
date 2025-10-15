import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTasks } from '../../hooks/useTasks';
import { validateTaskTitle, validateTaskDescription, validateDueDate } from '../../utils/validation';
import { Calendar, User, Flag, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

const TaskAssignment = ({ users, tasks, fetchTasks }) => {
  const [showForm, setShowForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const { createTask, updateTask, deleteTask } = useTasks();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError
  } = useForm();

  const onSubmit = async (data) => {
    // Client-side validation
    if (!validateTaskTitle(data.title)) {
      setError('title', { message: 'Title must be between 3 and 100 characters' });
      return;
    }

    if (!validateTaskDescription(data.description)) {
      setError('description', { message: 'Description cannot exceed 500 characters' });
      return;
    }

    if (!validateDueDate(data.dueDate)) {
      setError('dueDate', { message: 'Due date must be in the future' });
      return;
    }

    const result = await createTask(data);
    if (result.success) {
      reset();
      setShowForm(false);
      fetchTasks();
    }
  };

  const handleUpdateTask = async (taskId, taskData) => {
    const result = await updateTask(taskId, taskData);
    if (result.success) {
      fetchTasks();
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    const result = await deleteTask(taskId);
    if (result.success) {
      fetchTasks();
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filterStatus === 'all') return true;
    return task.status === filterStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Task Management</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary"
        >
          {showForm ? 'Cancel' : 'Create New Task'}
        </button>
      </div>

      {/* Create Task Form */}
      {showForm && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Task</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Task Title *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FileText className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...register('title', { required: 'Title is required' })}
                    className="input-field pl-10"
                    placeholder="Enter task title"
                  />
                </div>
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assign To *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    {...register('assignedTo', { required: 'Please select a user' })}
                    className="input-field pl-10"
                  >
                    <option value="">Select user</option>
                    {users.map(user => (
                      <option key={user._id} value={user._id}>
                        {user.name} ({user.email})
                      </option>
                    ))}
                  </select>
                </div>
                {errors.assignedTo && (
                  <p className="text-red-500 text-sm mt-1">{errors.assignedTo.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Flag className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    {...register('priority')}
                    className="input-field pl-10"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...register('dueDate')}
                    type="datetime-local"
                    className="input-field pl-10"
                  />
                </div>
                {errors.dueDate && (
                  <p className="text-red-500 text-sm mt-1">{errors.dueDate.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                {...register('description')}
                rows={3}
                className="input-field"
                placeholder="Enter task description"
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
              )}
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
              >
                Create Task
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Task Filters */}
      <div className="flex space-x-4">
        <button
          onClick={() => setFilterStatus('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            filterStatus === 'all'
              ? 'bg-primary-100 text-primary-800'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All Tasks
        </button>
        <button
          onClick={() => setFilterStatus('pending')}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            filterStatus === 'pending'
              ? 'bg-primary-100 text-primary-800'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Pending
        </button>
        <button
          onClick={() => setFilterStatus('in-progress')}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            filterStatus === 'in-progress'
              ? 'bg-primary-100 text-primary-800'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          In Progress
        </button>
        <button
          onClick={() => setFilterStatus('completed')}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            filterStatus === 'completed'
              ? 'bg-primary-100 text-primary-800'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Completed
        </button>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredTasks.map((task) => (
          <div key={task._id} className="card">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {task.title}
                  </h3>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(task.status)}`}>
                    {task.status}
                  </span>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                </div>
                
                {task.description && (
                  <p className="text-gray-600 mb-3">{task.description}</p>
                )}
                
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    {task.assignedTo.name}
                  </div>
                  {task.dueDate && (
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(task.dueDate).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => handleDeleteTask(task._id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
        
        {filteredTasks.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No tasks found for the selected filter.
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskAssignment;
