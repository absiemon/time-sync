import db from '../config/mySQL_DB.js'
import fs from 'fs'

export const createPersons = async (req, res) => {
    const fields = req.body;

    try {
        let insertedFileds = [];
        let query = 'INSERT INTO persons (';
        
        for (const [key, value] of Object.entries(fields)) {
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

        db.query(query, insertedFileds, (err, result) => {
            if (err) {
                res.status(500).json({ status: false, error: `Internal server error ${err}` });
            }
            else {
                res.status(200).json({ status: true, data: result });
            }
        })

    } catch (err) {
        res.status(500).json({ status: false, error: `Internal server error ${err}` });
    }
};

export const getAllPersons = async (req, res) => {
    const {name} = req.query;
    const {emp_id}  =  req.user;
    try {
        if(name && name !== 'undefined'){
            const query = `SELECT * FROM persons WHERE emp_id = ? AND name LIKE '${name}%'`;
            db.query(query, [emp_id], (err, result) => {
                if (err) {
                    res.status(500).json({ status: false, error: `Internal server error ${err}` });
                }
                else {
                    res.status(200).json({ status: true, data: result });
                }
            })
        }

        else{
            const query = 'SELECT * FROM persons WHERE emp_id = ?';
            db.query(query, [emp_id], (err, result) => {
                if (err) {
                    res.status(500).json({ status: false, error: `Internal server error ${err}` });
                }
                else {
                    res.status(200).json({ status: true, data: result });
                }
            })
        }

    } catch (err) {
        res.status(500).json({ status: false, error: `Internal server error ${err}` });
    }
}

export const getSinglePersons = async (req, res) => {
    const id = req.params.id;
    try {
        const query = 'SELECT * FROM persons WHERE id = ?';
        db.query(query, [id], (err, result) => {
            if (err) {
                res.status(500).json({ status: false, error: `Internal server error ${err}` });
            }
            else {
                res.status(200).json({ status: true, data: result });
            }
        })

    } catch (err) {
        res.status(500).json({ status: false, error: `Internal server error ${err}` });
    }
}

export const updatePersons = async (req, res) => {
    const id = req.params.id;
    const fieldsToUpdate = req.body;

    try {
        let query = "UPDATE persons SET ";

        let updateValues = [];
        for (const [key, value] of Object.entries(fieldsToUpdate)) {
            query += `${key}=?,`;
            updateValues.push(value);
            
        }
        query = query.slice(0, -1); // Removing last comma

        query += " WHERE id=?"
        updateValues.push(id);

        db.query(query, updateValues, (err, result) => {
            if (err) {
                res.status(500).json({ status: false, error: `Internal server error ${err}` });
            }
            else {
                res.status(200).json({ status: true, data: result });
            }
        })

    } catch (err) {
        res.status(500).json({ status: false, error: `Internal server error ${err}` });
    } 
}

export const deletePersons = async (req, res) => {
    const id = req.params.id;

    try {
        const query = 'DELETE FROM persons WHERE id = ?';
        db.query(query, [id], (err, result) => {
            if (err) {
                res.status(500).json({ status: false, error: `Internal server error ${err}` });
            }
            else {
                res.status(200).json({ status: true, data: result });
            }
        })

    } catch (err) {
        res.status(500).json({ status: false, error: `Internal server error ${err}` });
    } 
}
