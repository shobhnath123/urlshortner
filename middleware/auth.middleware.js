import { validateUserToken } from '../utils/token.js';
/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export function authenticationMiddleware(req, res, next) {
  const authHeader = req.headers['authorization']?.split(' ')[1];
  if (!authHeader) return next();
    if(!authHeader.startsWith('Bearer ')) {
      return res.status(400).json({ message: 'Authorization header must start with Bearer ' });
    }
    const [_, token] = req.headers['authorization'].split(' ');
    const payload = validateUserToken(token);
    req.user = payload;
    next();

}