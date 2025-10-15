# Full-Stack Todo App

A comprehensive task management system with admin and user panels, analytics, and real-time updates.

## 🚀 Features

### Admin Panel
- **Task Management**: Create, assign, edit, and delete tasks
- **User Management**: View all users, their roles, and performance
- **Analytics Dashboard**: 
  - Task completion rates
  - User performance metrics
  - Time-based analytics
  - Task status distribution
- **Task Assignment**: Assign tasks to specific users with due dates

### User Panel
- **Personal Dashboard**: View assigned tasks with performance metrics
- **Task Management**: Mark tasks as completed/pending
- **Task History**: View completed and pending tasks
- **Real-time Updates**: Get notifications for task status changes

## 🛠️ Tech Stack

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcrypt for password hashing
- express-validator for validation

### Frontend
- React.js
- Tailwind CSS
- React Router for navigation
- Axios for API calls
- React Hook Form for form handling
- Chart.js for analytics

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## 🚀 Installation & Setup

### 1. Clone the repository
```bash
git clone <repository-url>
cd todo-app
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/todo-app
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

Start the frontend development server:
```bash
npm run dev
```

### 4. Database Setup
Make sure MongoDB is running on your system. The app will automatically create the necessary collections.

## 📱 Usage

### 1. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### 2. Create Accounts
- Register as an Admin to access admin features
- Register as a User to access user features

### 3. Admin Features
- Create and assign tasks to users
- View analytics dashboard
- Manage users
- Monitor task completion rates

### 4. User Features
- View assigned tasks
- Mark tasks as completed
- Track personal performance
- View task history

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Tasks (Admin)
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Tasks (User)
- `GET /api/user/tasks` - Get user's tasks
- `PUT /api/user/tasks/:id/status` - Update task status

### Analytics
- `GET /api/analytics/dashboard` - Admin analytics
- `GET /api/analytics/user/:id` - User performance

## 🗄️ Database Schema

### User Schema
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ['admin', 'user']),
  createdAt: Date,
  updatedAt: Date
}
```

### Task Schema
```javascript
{
  title: String (required),
  description: String,
  assignedTo: ObjectId (ref: User),
  assignedBy: ObjectId (ref: User),
  status: String (enum: ['pending', 'in-progress', 'completed']),
  priority: String (enum: ['low', 'medium', 'high']),
  dueDate: Date,
  createdAt: Date,
  updatedAt: Date,
  completedAt: Date
}
```

### Analytics Schema
```javascript
{
  userId: ObjectId (ref: User),
  taskId: ObjectId (ref: Task),
  action: String (enum: ['assigned', 'started', 'completed']),
  timestamp: Date,
  completionTime: Number (in hours)
}
```

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Role-based access control
- Input validation and sanitization
- CORS configuration
- Rate limiting

## 📊 Analytics Features

- Task completion rates
- User performance metrics
- Time tracking
- Status distribution charts
- Export functionality

## 🎨 UI/UX Features

- Responsive design with Tailwind CSS
- Modern and clean interface
- Real-time updates
- Interactive charts and graphs
- Form validation
- Loading states
- Error handling

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB Atlas or use a cloud MongoDB service
2. Update the MONGODB_URI in your environment variables
3. Deploy to platforms like Heroku, Railway, or AWS

### Frontend Deployment
1. Build the frontend: `npm run build`
2. Deploy to platforms like Vercel, Netlify, or AWS S3

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues or have questions, please:
1. Check the documentation
2. Search existing issues
3. Create a new issue with detailed information

## 🔄 Updates

- Real-time task status updates
- Email notifications (coming soon)
- Mobile app (coming soon)
- Advanced analytics (coming soon)
