import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTasks } from '../hooks/useTasks';
import { api } from '../utils/api';
import AdminDashboard from '../components/Admin/AdminDashboard';
import TaskAssignment from '../components/Admin/TaskAssignment';
import AnalyticsBoard from '../components/Admin/AnalyticsBoard';
import { Users, Plus, BarChart3 } from 'lucide-react';

const AdminPage = () => {
  const { user } = useAuth();
  const { tasks, fetchTasks } = useTasks();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchAnalytics();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data.users);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await api.get('/analytics/dashboard');
      setAnalytics(response.data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'tasks', label: 'Task Management', icon: Plus },
    { id: 'users', label: 'User Management', icon: Users }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
        <p className="text-gray-600 mt-2">
          Welcome back, {user?.name}! Manage tasks, users, and view analytics.
        </p>
      </div>

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
        {activeTab === 'dashboard' && (
          <AnalyticsBoard analytics={analytics} loading={loading} />
        )}
        
        {activeTab === 'tasks' && (
          <TaskAssignment 
            users={users} 
            tasks={tasks} 
            fetchTasks={() => fetchTasks('/tasks')}
          />
        )}
        
        {activeTab === 'users' && (
          <AdminDashboard 
            users={users} 
            fetchUsers={fetchUsers}
            tasks={tasks}
          />
        )}
      </div>
    </div>
  );
};

export default AdminPage;
