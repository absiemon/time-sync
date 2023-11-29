import db from '../config/mySQL_DB.js'
import { uplaodToS3, deleteFromS3 } from '../services/FilesOperation.js'
import { generateRandomUserId } from '../services/generateUserId.js';

const fields = 'emp_id, emp_name, department, designation, email, gender, phone, address, country, state, city, address2, dob, joining_date, basic_salary, emp_status, service_terms, emp_image, emp_cv, total_leave, login_email, password, role, certificates, created_by, updated_at FROM employees'

export const createEmployee = async (req, res) => {
    let fields = req.body;

    try {
        const userId = generateRandomUserId();
        const newFields = {...fields, emp_id: userId}

        let insertedFileds = [];
        let query = 'INSERT INTO employees (';

        for (const [key, value] of Object.entries(newFields)) {

            if (key === 'upload_emp_img' || key === 'upload_emp_cv' || key === 'upload_certificates') {
                continue;
            }
            else {
                query += `${key}, `
                insertedFileds.push(value);
            }
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
                return res.status(500).json({ status: false, error: 'Internal server error' });
            }
            if (result && result.affectedRows > 0) {
                res.status(201).json({ status: true, data: `Inserted ${result.affectedRows} row(s)` });
            } else {
                res.status(400).json({ status: false, error: 'Failed to insert data. No rows affected.' });
            }
        })
    } catch (err) {
        res.status(500).json({ status: false, error: 'Internal server error' });
    }
};

export const getAllEmployee = async (req, res) => {
    const { name, dep_name, page, pageSize } = req.query;
    try {
        let query = `SELECT  ${fields}`;
        let countQuery = 'SELECT COUNT(*) AS totalRows FROM employees';

        if (name && name !== 'undefined') {
            query += ` WHERE emp_name LIKE ?`;
            const searchTerm = `%${name}%`;

            db.query(query, [searchTerm], (err, result) => {
                if (err) {
                    return res.status(500).json({ status: false, error: 'Internal server error' });
                }
                else {
                    res.status(200).json({ status: true, data: result });
                }
            })
        }
        else if (dep_name) {
            const query = `SELECT ${fields} WHERE department = ?`;
            db.query(query, [dep_name], (err, result) => {
                if (err) {
                    return res.status(500).json({ status: false, error: 'Internal server error' });
                }
                else {
                    res.status(200).json({ status: true, data: result });
                }
            })
        }
        else {
            query += ` LIMIT ? OFFSET ?`;
            const offset = page ? (page - 1) * pageSize : 0;
            const limit = pageSize ? parseInt(pageSize) : 10;

            db.query(countQuery, (err, countResult) => {
                if (err) {
                    return res.status(500).json({ status: false, error: 'Internal server error' });
                }
                const totalRows = countResult[0].totalRows;
                db.query(query, [limit, offset], (err, result) => {
                    if (err) {
                        return res.status(500).json({ status: false, error: 'Internal server error' });
                    }
                    else {
                        const meta = {
                            total: totalRows,
                            totalPages: Math.ceil(totalRows / pageSize),
                            pageNo: page,
                        }
                        res.status(200).json({ status: true, meta: meta, data: result });
                    }
                });
            })

        }

    } catch (err) {
        res.status(500).json({ status: false, error: 'Internal server error' });
    }
}

export const getSingleEmployee = async (req, res) => {
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

export const updateEmployee = async (req, res) => {
    const id = req.params.id;
    const fieldsToUpdate = req.body;

    try {
        let query = "UPDATE employees SET ";

        let updateValues = [];
        for (const [key, value] of Object.entries(fieldsToUpdate)) {
            if (key === 'upload_emp_img' || key === 'upload_emp_cv' || key === 'upload_certificates') {
                continue;
            }

            else {
                query += `${key}=?,`;
                updateValues.push(value);
            }
        }
        query = query.slice(0, -1); // Removing last comma

        query += " WHERE emp_id=?"
        updateValues.push(id);

        db.query(query, updateValues, (err, result) => {
            if (err) {
                return res.status(500).json({ status: false, error: 'Internal server error' });
            }
            else {
                res.status(200).json({ status: true, data: result });
            }
        })

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const deleteEmployee = async (req, res) => {
    const id = req.params.id;

    try {
        const query = 'DELETE FROM employees WHERE emp_id = ?';
        db.query(query, [id], (err, result) => {
            if (err) {
                return res.status(500).json({ status: false, error: 'Internal server error' });
            }
            else {
                res.status(200).json({ status: true, data: result });
            }
        })

    } catch (err) {
        console.error(err);
        res.status(500).json({ status: true, error: 'Internal server error' });
    }
}


export const uploadFiles = async (req, res) => {
    try {
        const filesUrl = [];
        for (let i = 0; i < req.files.length; i++) {
            const { originalname, mimetype, path } = req.files[i];
            const url = await uplaodToS3(path, originalname, mimetype);
            filesUrl.push(url);
        }
        res.send(filesUrl);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const deletFTPfile = async (req, res) => {
    const filename = req.params.fname
    const id = req.query.id
    const field = req.query.field;
    try {
        await deleteFromS3(filename).then((response) => {
            if (id !== 'undefined') {
                db.query(`SELECT ${field} FROM employees WHERE emp_id = ?`, [id], (err, result) => {
                    if (err) {
                        return res.status(500).json({ status: false, error: 'Internal server error' });
                    }
                    else {
                        let files;

                        if (field === 'emp_image') {
                            files = null;
                        }
                        else if (field === 'emp_cv') {
                            files = null
                        }
                        else if (field === 'certificates') {
                            files = JSON.parse(result[0].certificates);
                            const newFiles = files.filter(f => f !== filename);
                            const newFilesString = JSON.stringify(newFiles);
                            files = newFilesString;
                        }
                        console.log(files)
                        db.query(`UPDATE employees SET ${field} = ? WHERE emp_id = ?`, [files, id], (err, result) => {
                            if (err) {
                                return res.status(500).json({ status: false, error: 'Internal server error' });
                            }
                            else{
                                res.status(200).json({ status: true, data: files });
                            }
                        });
                    }

                })
            }
            else {
                res.status(200).json({ status: true, data: response });
            }

        }).catch((err) => {
            return res.status(200).json({ status: false, error: 'Error in deleting file' });
        })

    } catch (err) {
        res.status(500).json({ status: false, error: 'Internal server error' });
    }
}


export const getEmployeeByName = async (req, res) => {
    const name = req.params.value;

    try {
        const query = `SELECT ${fields} WHERE emp_name = ?`;
        db.query(query, [name], (err, result) => {
            if (err){
                return res.status(500).json({ status: false, error: 'Internal server error' });
            }
            else{
                res.status(200).json({ status: true, data: result });
            }
        })

    } catch (err) {
        res.status(500).json({ status:false, error: 'Internal server error' });
    }
}
