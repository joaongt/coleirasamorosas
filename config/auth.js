import jwt from 'jsonwebtoken';

// How long a login lasts (cookie and JWT)
export const LOGIN_DAYS = 7;

// Read the user from the token cookie (or the "token=..." Authorization header).
// Returns the decoded token, or null when there is no valid token.
export function getUserFromToken(req) {
  let token = req.cookies && req.cookies.token;

  const authHeader = req.headers.authorization;
  if (!token && authHeader) {
    const match = authHeader.match(/(?:^|;\s*)token=([^;]+)/);
    token = match ? match[1] : null;
  }

  if (!token) return null;

  try {
    return jwt.verify(token, process.env.SECRET);
  } catch (error) {
    return null;
  }
}

// Makes the login state available to every page (userLogged in the templates)
export function loadUser(req, res, next) {
  const user = getUserFromToken(req);
  req.user = user;
  res.locals.userLogged = !!user;
  next();
}

// Blocks a route for visitors who are not logged in
export function requireLogin(req, res, next) {
  if (req.user) return next();

  if (req.accepts(['html', 'json']) === 'json') {
    return res.status(401).json({ msg: 'Faça o login primeiro' });
  }
  res.redirect('/login');
}
