import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js';

export const verifyUser = (req, res, next) => {
    // Retrieve the JWT token from cookies
    const token = req.cookies.access_token;

    // Check if token exists
    if (!token) {
        // If token doesn't exist, return a 401 Unauthorized error
        return next(errorHandler(401, 'Unauthorized'));
    }

    // Verify the JWT token
    jwt.verify(token, process.env.JWT_SECRET||'leo7', (err, user) => {
        // If there's an error while verifying the token
        if (err) {
            // Return a 401 Unauthorized error
            return next(errorHandler(401, 'Unauthorized'));
        }

        // Assuming your decoded token contains user information,
        // assign the decoded user object to the request object
        req.user = user;

        // Log the decoded user information for debugging
        console.log('Decoded User:', user);

        // Call the next middleware in the chain
        next();
    });
};
