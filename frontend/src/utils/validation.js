export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const validateName = (name) => {
  return name.length >= 2 && name.length <= 50;
};

export const validateTaskTitle = (title) => {
  return title.length >= 3 && title.length <= 100;
};

export const validateTaskDescription = (description) => {
  return !description || description.length <= 500;
};

export const validateDueDate = (dueDate) => {
  if (!dueDate) return true;
  const date = new Date(dueDate);
  const now = new Date();
  return date > now;
};

export const getValidationErrors = (data, type) => {
  const errors = {};

  switch (type) {
    case 'user':
      if (!validateName(data.name)) {
        errors.name = 'Name must be between 2 and 50 characters';
      }
      if (!validateEmail(data.email)) {
        errors.email = 'Please enter a valid email address';
      }
      if (!validatePassword(data.password)) {
        errors.password = 'Password must be at least 6 characters long';
      }
      break;

    case 'task':
      if (!validateTaskTitle(data.title)) {
        errors.title = 'Title must be between 3 and 100 characters';
      }
      if (!validateTaskDescription(data.description)) {
        errors.description = 'Description cannot exceed 500 characters';
      }
      if (!validateDueDate(data.dueDate)) {
        errors.dueDate = 'Due date must be in the future';
      }
      if (!data.assignedTo) {
        errors.assignedTo = 'Please select a user to assign the task to';
      }
      break;

    default:
      break;
  }

  return errors;
};
