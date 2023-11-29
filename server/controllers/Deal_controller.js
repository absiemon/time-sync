import db from '../config/mySQL_DB.js'
import { generateId } from '../services/generateIds.js';

export const createDeal = async (req, res) => {
    const fields = req.body;

    try {
        const emp_id = req.user.emp_id;
        const deal_id = generateId("DEAL");
        const newFields = { ...fields, deal_id, emp_id }

        let insertedFileds = [];
        let query = 'INSERT INTO deals (';

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

        db.query(query, insertedFileds, (err, result) => {
            if (err) {
                res.status(500).json({ status: false, error: `Internal server error ${err}` });
            }
            const updateQuery = 'UPDATE pipelines SET total_deal_value = COALESCE(total_deal_value, 0) + ?, no_of_deals = COALESCE(no_of_deals, 0) + 1 WHERE pip_id = ?';
            db.query(updateQuery, [fields.deal_value, fields.pip_id], (err, result) => {
                if (err) {
                    res.status(500).json({ status: false, error: `Internal server error ${err}` });
                }
                else {
                    res.status(200).json({ status: true, data: `Inserted ${result.affectedRows} row(s)` });
                }
            });
        })

    } catch (err) {
        res.status(500).json({ status: false, error: `Internal server error ${err}` });
    }
};

export const getAllDeal = async (req, res) => {
    const date = req.query.date;
    try {
        if (date) {
            const query = `SELECT * FROM deals WHERE atten_date LIKE '${date}%'`;
            db.query(query, (err, result) => {
                if (err) {
                    res.status(500).json({ status: false, error: `Internal server error ${err}` });
                }
                else {
                    res.status(200).json({ status: true, data: result });
                }
            })
        }
        else {
            const query = 'SELECT * FROM deals';
            db.query(query, (err, result) => {
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

export const getSingleDeal = async (req, res) => {
    const id = req.params.id;
    try {
        const query = 'SELECT * FROM deals WHERE deal_id = ?';
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

export const updateDeal = async (req, res) => {
    const id = req.params.id;
    const fieldsToUpdate = req.body.values;

    try {
        let query = "UPDATE deals SET ";

        let updateValues = [];
        for (const [key, value] of Object.entries(fieldsToUpdate)) {
            query += `${key}=?,`;
            updateValues.push(value);
        }
        query = query.slice(0, -1); // Removing last comma

        query += " WHERE deal_id=?"
        updateValues.push(id);

        db.query(query, updateValues, (err, result) => {
            if (err) throw err;

            const updateQuery = 'UPDATE pipelines SET total_deal_value = COALESCE(total_deal_value, 0) + ? WHERE pip_id = ?';
            db.query(updateQuery, [req.body.deal_value_diff, fieldsToUpdate.pipeline_id], (err, result) => {
                if (err) {
                    res.status(500).json({ status: false, error: `Internal server error ${err}` });
                }
                else {
                    res.status(200).json({ status: true, data: result });
                }
            });
        })

    }
    catch (err) {
        res.status(500).json({ status: false, error: `Internal server error ${err}` });
    }
}

export const updateDealStatus = async (req, res) => {
    const id = req.params.id;
    const fieldsToUpdate = req.body;

    try {
        let query = "UPDATE deals SET ";

        let updateValues = [];
        for (const [key, value] of Object.entries(fieldsToUpdate)) {
            query += `${key}=?,`;
            updateValues.push(value);
        }
        query = query.slice(0, -1); // Removing last comma

        query += " WHERE deal_id=?"
        updateValues.push(id);

        db.query(query, updateValues, (err, result) => {
            if (err) {
                res.status(500).json({ status: false, error: `Internal server error ${err}` });
            }
            else {
                res.status(200).json({ status: true, data: result });
            }
        })

    }
    catch (err) {
        res.status(500).json({ status: false, error: `Internal server error ${err}` });
    }
}


export const updateDealStage = async (req, res) => {
    const id = req.params.id;
    const fieldsToUpdate = req.body;

    try {
        let query = "UPDATE deals SET ";

        let updateValues = [];
        for (const [key, value] of Object.entries(fieldsToUpdate)) {
            query += `${key}=?,`;
            updateValues.push(value);

        }
        query = query.slice(0, -1); // Removing last comma

        query += " WHERE deal_id=?"
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

export const deleteDeal = async (req, res) => {
    const deal_id = req.params.id;
    const { pip_id, deal_value } = req.query;

    try {
        const query = 'DELETE FROM deals WHERE deal_id = ?';
        db.query(query, [deal_id], (err, result) => {
            if (err) {
                res.status(500).json({ status: false, error: `Internal server error ${err}` });
            }
            else {
                const updateQuery = 'UPDATE pipelines SET total_deal_value = COALESCE(total_deal_value, 0) - ?, no_of_deals = COALESCE(no_of_deals, 0) - 1 WHERE pip_id = ?';
                db.query(updateQuery, [deal_value, pip_id], (err, result) => {
                    if (err) {
                        res.status(500).json({ status: false, error: `Internal server error ${err}` });
                    }
                    else {
                        res.status(200).json({ status: true, data: `Inserted ${result.affectedRows} row(s)` });
                    }
                });
            }
        })

    } catch (err) {
        res.status(500).json({ status: false, error: `Internal server error ${err}` });
    }
}


export const getDealsMonthWise = async (req, res) => {
    const year = parseInt(req.query.year, 10);
    const emp_id = req.user.emp_id;
    try {
        if (isNaN(year)) {
            return res.status(400).json({ error: 'Invalid year format' });
        }

        const query = 'SELECT MONTH(time_stamp) as month, COUNT(*) as deals FROM deals WHERE YEAR(time_stamp) = ? AND emp_id = ? GROUP BY month';
        db.query(query, [year, emp_id], (err, result) => {
            if (err) {
                res.status(500).json({ status: false, error: `Internal server error ${err}` });
            }
            else {
                const months = [
                    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
                ];

                const monthMap = {};
                result.forEach(row => {
                    monthMap[row.month] = row.deals;
                });
                const transformedData = Array.from({ length: 12 }, (_, index) => ({
                    month: months[index],
                    deals: monthMap[index + 1] || 0
                }));

                // const transformedData = result.map(row => ({ month: months[row.month-1], deals: row.deals }));
                console.log(transformedData)
                res.status(200).json({ status: true, data: transformedData });
            }
        })

    } catch (err) {
        res.status(500).json({ status: false, error: `Internal server error ${err}` });
    }
}

export const getDealStatusMonthWise = async (req, res) => {
    const year = parseInt(req.query.year, 10);
    const emp_id = req.user.emp_id;
    try {
        if (isNaN(year)) {
            return res.status(400).json({ error: 'Invalid year format' });
        }

        const query = `SELECT
        SUM(CASE WHEN deal_status = 'won' THEN 1 ELSE 0 END) AS wonCount,
        SUM(CASE WHEN deal_status = 'loss' THEN 1 ELSE 0 END) AS lostCount
        FROM deals WHERE YEAR(time_stamp) = ? AND emp_id = ?;`

        db.query(query, [year, emp_id], (err, result) => {
            if (err) {
                res.status(500).json({ status: false, error: `Internal server error ${err}` });
            }
            else {
                const wonCount = result[0].wonCount;
                const lostCount = result[0].lostCount;

                const resultArray = [lostCount, wonCount];
                console.log(resultArray);
                res.status(200).json({ status: true, data: resultArray });
            }
        })

    } catch (err) {
        res.status(500).json({ status: false, error: `Internal server error ${err}` });
    }
}

export const getWonLossDealsYearWise = async (req, res) => {
    const year = parseInt(req.query.year, 10);
    const emp_id = req.user.emp_id;
    try {
        if (isNaN(year)) {
            return res.status(400).json({ error: 'Invalid year format' });
        }

        const query = `SELECT * FROM deals 
        WHERE (deal_status = 'won' OR deal_status = 'loss') AND 
        emp_id = ? AND YEAR(time_stamp) = ? ORDER BY time_stamp DESC`;

        db.query(query, [emp_id, year], (err, result) => {
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