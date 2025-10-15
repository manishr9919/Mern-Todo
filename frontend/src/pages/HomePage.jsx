import React, { useState } from 'react';
import Login from '../components/Auth/Login';
import Register from '../components/Auth/Register';
import { CheckCircle, Users, BarChart3, Clock } from 'lucide-react';

const HomePage = () => {
  const [isLogin, setIsLogin] = useState(true);

  const features = [
    {
      icon: <CheckCircle className="w-8 h-8 text-primary-600" />,
      title: 'Task Management',
      description: 'Create, assign, and track tasks with ease. Mark tasks as completed and monitor progress.'
    },
    {
      icon: <Users className="w-8 h-8 text-primary-600" />,
      title: 'User Roles',
      description: 'Admin and user roles with different permissions. Admins can assign tasks and view analytics.'
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-primary-600" />,
      title: 'Analytics Dashboard',
      description: 'Comprehensive analytics for task completion rates, user performance, and time tracking.'
    },
    {
      icon: <Clock className="w-8 h-8 text-primary-600" />,
      title: 'Real-time Updates',
      description: 'Get real-time updates on task status changes and completion notifications.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Features */}
          <div className="space-y-8">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Full-Stack Todo App
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                A comprehensive task management system with admin and user panels, 
                analytics, and real-time updates.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="card hover:shadow-lg transition-shadow">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right side - Auth Forms */}
          <div className="card max-w-md mx-auto lg:mx-0">
            {isLogin ? (
              <Login onSwitchToRegister={() => setIsLogin(false)} />
            ) : (
              <Register onSwitchToLogin={() => setIsLogin(true)} />
            )}
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Built With</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              'React', 'Express.js', 'MongoDB', 'Tailwind CSS', 
              'JWT Authentication', 'Mongoose', 'Chart.js'
            ].map((tech) => (
              <span
                key={tech}
                className="px-4 py-2 bg-primary-100 text-primary-800 rounded-full text-sm font-medium"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
