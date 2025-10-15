module.exports = {
  PORT: process.env.PORT || 5000,
  MONGODB_URI: process.env.MONGODB_URI || "mongodb+srv://manishr9919:manish123@cluster0.wy1qe.mongodb.net/todo-cursor?retryWrites=true&w=majority&appName=Cluster0",
  JWT_SECRET: process.env.JWT_SECRET || 'masai',
  NODE_ENV: process.env.NODE_ENV || 'development'
};
