// Middleware function to check if the user is an admin
export const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
      // User is an admin, grant access to the route
      return next();
    } else {
      // User is not an admin, deny access with a forbidden status
      return res.status(403).json({ message: 'Access denied. Only admins are allowed.' });
    }
  };
  

  