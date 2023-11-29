import jwt from 'jsonwebtoken';
import db from '../config/mySQL_DB.js'
const jwt_secret = process.env.JWT_SECRET;

const verifyToken = (req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
        return res.status(200).json({ login_status: false, user: null});
    }
    try {
        jwt.verify(token, jwt_secret, {}, async (err, data) => {
            if (err) {
                return res.status(498).json({ error: "Error in verifying token. Invalid token" });
            }
            else {
                const id = data?.id;
                db.query('SELECT * FROM employees WHERE emp_id=?', [id], (error, results) => {
                    if (error) {
                        return res.status(401).json({ error: 'Unauthorized access.' });
                    }
                    else {
                        const userData = results[0];
                        const response = {
                            emp_id: userData.emp_id,
                            emp_name: userData.name,
                            email: userData.email,
                            emp_image: userData.emp_image,
                            created_at: userData.created_at,
                            updated_at: userData.updated_at
                        }
                        req.user = response;
                        next();
                    }
                })
            }
           
        })
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(200).json({ login_status: false, user: null});
        }
        return res.status(422).json({ error: "Cannot get the user", details: err.message });
    }

}

export default verifyToken;