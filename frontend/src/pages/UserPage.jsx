import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTasks } from '../hooks/useTasks';
import { api } from '../utils/api';
import UserDashboard from '../components/User/UserDashboard';
import TaskList from '../components/User/TaskList';
import { CheckSquare, BarChart3, Clock } from 'lucide-react';

const UserPage = () => {
  const { user } = useAuth();
  const { tasks, fetchTasks, loading } = useTasks();
  const [activeTab, setActiveTab] = useState('tasks');
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchTasks();
    fetchUserStats();
  }, []);

  const fetchUserStats = async () => {
    try {
      const response = await api.get(`/users/${user?.id}/stats`);
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch user stats:', error);
    }
  };

  const tabs = [
    { id: 'tasks', label: 'My Tasks', icon: CheckSquare },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'activity', label: 'Activity', icon: Clock }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome back, {user?.name}! Here are your assigned tasks.
        </p>
      </div>

      {/* Quick Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card text-center">
            <div className="text-2xl font-bold text-primary-600">{stats.stats.totalTasks}</div>
            <div className="text-sm text-gray-600">Total Tasks</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-green-600">{stats.stats.completedTasks}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.stats.pendingTasks}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.stats.completionRate}%</div>
            <div className="text-sm text-gray-600">Completion Rate</div>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'tasks' && (
          <TaskList 
            tasks={tasks} 
            loading={loading}
            fetchTasks={fetchTasks}
          />
        )}
        
        {activeTab === 'dashboard' && (
          <UserDashboard 
            stats={stats}
            tasks={tasks}
          />
        )}
        
        {activeTab === 'activity' && (
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <p className="text-gray-600">Activity tracking coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserPage;
