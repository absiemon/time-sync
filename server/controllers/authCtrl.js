import db from '../config/mySQL_DB.js'
import jwt from "jsonwebtoken"
import { uplaodToS3, deleteFromS3 } from '../services/FilesOperation.js'
import { generateRandomUserId } from '../services/generateUserId.js';

import nodemailer from 'nodemailer'
// const EMAIL = process.env.SMTP_EMAIL
// const PASSWORD = process.env.SMTP_PASSWORD
let otp;
let otpExpiryTime;

const fields = 'emp_id, name, email, gender, phone, address, country, state, city, dob, created_at, emp_image, updated_at FROM employees'

export const createUser = async (req, res) => {
    let fields = req.body;

    try {
        let query = 'SELECT * FROM employees WHERE email = ?';
        db.query(query, [fields.email], (err, result) => {
            if (err) {
                return res.status(500).json({ status: false, error: 'Internal server error' });
            }
            if (result.length > 0) {
                return res.status(200).json({ status: true, data: `User with this email already existed` });
            }
        })

        const userId = generateRandomUserId();
        const newFields = { ...fields, emp_id: userId }

        let insertedFileds = [];
        query = 'INSERT INTO employees (';

        for (const [key, value] of Object.entries(newFields)) {

            query += `${key}, `
            insertedFileds.push(value);
        }
        query = query.slice(0, -2); // Removing last comma space
        query += ') VALUES ('
        insertedFileds.map((m) => {
            query += '?, '
        })
        query = query.slice(0, -2); // Removing last comma and space
        query += ')'

        console.log(query)
        console.log(insertedFileds)
        db.query(query, insertedFileds, (err, result) => {
            if (err) {
                return res.status(500).json({ status: false, error: 'Internal server error' });
            }
            if (result && result.affectedRows > 0) {
                // Create and sign JWT token
                const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1d' });

                // Set token as cookie and send success response
                res.cookie('token', token, {
                    httpOnly: true,
                    secure: true, // Make sure to set to true if your site is served over HTTPS
                    sameSite: 'None', // Set SameSite attribute to 'None' for cross-site cookies
                    maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
                });
                return res.status(201).json({ login_status: true, message: 'User created successfully' });
            }
            else {
                res.status(400).json({ status: false, error: 'Failed to insert data. No rows affected.' });
            }
        })
    } catch (err) {
        res.status(500).json({ status: false, error: 'Internal server error' });
    }
};

export const getSingleUser = async (req, res) => {
    const id = req.params.id;
    try {
        const query = `SELECT ${fields} WHERE emp_id = ?`;
        db.query(query, [id], (err, result) => {
            if (err) {
                return res.status(500).json({ status: false, error: 'Internal server error' });
            }
            else {
                res.status(200).json({ status: true, data: result });
            }
        })

    } catch (err) {
        res.status(500).json({ status: false, error: 'Internal server error' });
    }
}

export const updateUser = async (req, res) => {
    const id = req.params.id;
    const fieldsToUpdate = req.body;

    try {
        let query = "UPDATE employees SET ";

        let updateValues = [];
        for (const [key, value] of Object.entries(fieldsToUpdate)) {
            query += `${key}=?,`;
            updateValues.push(value);
        }
        query = query.slice(0, -1); // Removing last comma

        query += " WHERE emp_id=?"
        updateValues.push(id);

        db.query(query, updateValues, (err, result) => {
            if (err) {
                return res.status(500).json({ status: false, error: `Internal server error ${err}` });
            }
            else {
                res.status(200).json({ status: true, data: result });
            }
        })

    } catch (err) {
        return res.status(500).json({ status: false, error: `Internal server error ${err}` });
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user exists
        const selectUserQuery = 'SELECT * FROM employees WHERE email = ?';
        db.query(selectUserQuery, [email], (error, results) => {
            if (error) {
                return res.status(500).json({ error: 'Internal server error.' });
            }

            if (results.length === 0) {
                return res.status(401).json({ error: 'Invalid email or password.' });
            }

            const user = results[0];

            // Check if password is correct
            if (user.password !== password) {
                return res.status(401).json({ error: 'Invalid email or password.' });
            }
            else {
                // Create and sign JWT token
                const token = jwt.sign({ id: user.emp_id }, process.env.JWT_SECRET, { expiresIn: '1d' });

                // Set token as cookie and send success response
                res.cookie('token', token, {
                    httpOnly: true,
                    secure: true, // Make sure to set to true if your site is served over HTTPS
                    sameSite: 'None', // Set SameSite attribute to 'None' for cross-site cookies
                    maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
                });
                return res.status(200).json({ login_status: true, message: 'Login successful.' });
            }
        });
    }
    catch (err) {
        res.status(422).json({ error: "Failed to login user", details: err.message });
    }
}

export const profile = async (req, res) => {
    try {
        const response = req.user
        return res.status(200).json({ login_status: true, user: response })
    }
    catch (err) {
        res.status(422).json({ error: "Failed to fetch user", details: err.message });
    }
}

export const logout = async (req, res) => {
    res.clearCookie('token');
    return res.status(200).json({ message: 'Logout successful.' });
}


export const uploadEmpImage = async (req, res) => {
    const id = req.params.id;
    try {
        const filesUrl = [];
        for (let i = 0; i < req.files.length; i++) {
            const { originalname, mimetype, path } = req.files[i];
            const url = await uplaodToS3(path, originalname, mimetype);
            filesUrl.push(url);
        }
        const fieldsToUpdate = {
            emp_image: filesUrl[0]
        }

        let query = "UPDATE employees SET ";

        let updateValues = [];
        for (const [key, value] of Object.entries(fieldsToUpdate)) {
            query += `${key}=?,`;
            updateValues.push(value);
        }
        query = query.slice(0, -1); // Removing last comma

        query += " WHERE emp_id=?"
        updateValues.push(id);

        db.query(query, updateValues, (err, result) => {
            if (err) {
                return res.status(500).json({ status: false, error: `Internal server error ${err}` });
            }
            else {
                res.status(200).json({ status: true, data: result });
            }
        })

    } catch (err) {
        return res.status(500).json({ status: false, error: `Internal server error ${err}` });

    }
}


export const sendMail = async(req, res) => {

    const { userEmail} = req.body;

    try {
        console.log(userEmail)
        let query = 'SELECT * FROM employees WHERE email = ?';
        db.query(query, [userEmail], (err, result) => {
            if (err) {
                return res.status(500).json({ status: false, error: `Internal server error ${err}` });
            }
            if (result.length === 0) {
                console.log("here")
                return res.status(200).json({ status: false, data: `No user found of that email address` });
            }
        })

        let config = {
            service : 'gmail',
            auth : {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        }
        let transporter = nodemailer.createTransport(config);
    
        otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
        otpExpiryTime = new Date();
        otpExpiryTime.setMinutes(otpExpiryTime.getMinutes() + 5);
    
        let message = {
            from : "TimeSync siemonab@gmail.com",
            to : userEmail,
            subject: "Otp for password reset is:",
            html: "<h3>OTP for account verification is </h3>"  + "<h1 style='font-weight:bold;'>" + otp +"</h1>"
        }
    
        transporter.sendMail(message).then(() => {
            return res.status(200).json({
                status: true, data: "you should receive an email"
            })
        }).catch(error => {
            return res.status(500).json({ status: false, error: `Internal server error ${error}` });
        })
    } catch (err) {
        return res.status(500).json({ status: false, error: `Internal server error ${err}` });
        
    }
}

export const verifyOtp = async(req, res) => {
    const { requestedOtp } = req.body;
    try {
        console.log(requestedOtp, otp)
        console.log(typeof(requestedOtp), typeof(otp))
        const currentTime = new Date();

        console.log(currentTime, otpExpiryTime)
        if (currentTime > otpExpiryTime) {
            return res.status(200).json({ status: false, data: "Otp has been expired! please regenerate otp" });
        }
        if (requestedOtp === otp) {
            otp = null;
            otpExpiryTime = null;
            return res.status(200).json({ status: true, data: "Otp successfully verified!" });
            
        } 
        else {
            return res.status(200).json({ status: false, data: "Otp does not match" });
        }
    } 
    catch (err) {
        return res.status(500).json({ status: false, error: `Internal server error ${err}` });
    }
}

export const updatePassword = async (req, res) => {
    const email = req.body.email;
    const fieldsToUpdate = req.body;

    try {
        let query = "UPDATE employees SET ";

        let updateValues = [];
        for (const [key, value] of Object.entries(fieldsToUpdate)) {
            query += `${key}=?,`;
            updateValues.push(value);
        }
        query = query.slice(0, -1); // Removing last comma

        query += " WHERE email=?"
        updateValues.push(email);

        db.query(query, updateValues, (err, result) => {
            if (err) {
                return res.status(500).json({ status: false, error: `Internal server error ${err}` });
            }
            else {
                res.status(200).json({ status: true, data: result });
            }
        })

    } catch (err) {
        return res.status(500).json({ status: false, error: `Internal server error ${err}` });
    }
}