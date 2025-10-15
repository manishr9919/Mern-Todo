import React, { useState } from 'react';
import { useTasks } from '../../hooks/useTasks';
import { Calendar, User, Flag, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const TaskList = ({ tasks, loading, fetchTasks }) => {
  const [filterStatus, setFilterStatus] = useState('all');
  const { updateTaskStatus } = useTasks();

  const handleStatusChange = async (taskId, newStatus) => {
    const result = await updateTaskStatus(taskId, newStatus);
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'in-progress': return <Clock className="h-4 w-4" />;
      case 'pending': return <AlertCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">My Tasks</h2>
        <div className="text-sm text-gray-600">
          {tasks.length} total tasks
        </div>
      </div>

      {/* Task Filters */}
      <div className="flex flex-wrap gap-2">
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
          <div 
            key={task._id} 
            className={`card ${
              isOverdue(task.dueDate) && task.status !== 'completed' 
                ? 'border-red-200 bg-red-50' 
                : ''
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {task.title}
                  </h3>
                  <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(task.status)}`}>
                    {getStatusIcon(task.status)}
                    <span className="ml-1">{task.status}</span>
                  </span>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                  {isOverdue(task.dueDate) && task.status !== 'completed' && (
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                      Overdue
                    </span>
                  )}
                </div>
                
                {task.description && (
                  <p className="text-gray-600 mb-3">{task.description}</p>
                )}
                
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    Assigned by {task.assignedBy.name}
                  </div>
                  {task.dueDate && (
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </div>
                  )}
                  <div className="flex items-center">
                    <Flag className="h-4 w-4 mr-1" />
                    Priority: {task.priority}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col space-y-2 ml-4">
                {task.status === 'pending' && (
                  <button
                    onClick={() => handleStatusChange(task._id, 'in-progress')}
                    className="btn-primary text-sm"
                  >
                    Start Task
                  </button>
                )}
                
                {task.status === 'in-progress' && (
                  <button
                    onClick={() => handleStatusChange(task._id, 'completed')}
                    className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
                  >
                    Mark Complete
                  </button>
                )}
                
                {task.status === 'completed' && (
                  <div className="flex items-center text-green-600 text-sm">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Completed
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {filteredTasks.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <CheckCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No tasks found for the selected filter.</p>
            <p className="text-sm">Check back later for new assignments!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList;
