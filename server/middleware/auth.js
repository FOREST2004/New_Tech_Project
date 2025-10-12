import jwt from "jsonwebtoken";


export function authMiddleware(req, res, next) {
 
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ message: "No token provided" });
  
  
 
  const token = authHeader; 
 
  if (!token) return res.sendStatus(401).json({ message: "Invalid token format"});

  
 
   try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    next();
  } catch (err) {
    return res.status(403).json({ message: "Token invalid or expired" });
  }
}



export function requireRole(roles) {
  
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const allowedRoles = Array.isArray(roles) ? roles : [roles];
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied: requires role(s) ${allowedRoles.join(", ")}. Your role: ${req.user.role}`,
      });
    }

    next();
  };
}
