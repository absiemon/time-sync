import db from '../config/mySQL_DB.js'
import fs from 'fs'
import { generateId } from '../services/generateIds.js';

export const createPipeline = async (req, res) => {
    const { pipelineData, stages } = req.body;

    try {
        // const userId = req.user.emp_id
        const pip_id = generateId("PIP");
        const newPipelineData = { ...pipelineData, pip_id }
        let insertedFileds = [];
        let query = 'INSERT INTO pipelines (';

        for (const [key, value] of Object.entries(newPipelineData)) {
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
        console.log(insertedFileds)

        db.query(query, insertedFileds, (err, result) => {
            if (err) {
                return res.status(500).json({ status: false, error: `Internal server error ${err}` });
            }
            else {
                console.log(result);
                const newStages = stages.map((obj) => {
                    const newObj = { ...obj, stage_id: generateId("STAGE"), pip_id };
                    return newObj;
                })
                const values = newStages.map(({ stage_name, probability, stage_id, pip_id }) =>
                    `('${stage_id}', '${pip_id}', '${stage_name}', '${probability}')`
                ).join(', ');
                const query = `INSERT INTO stages (stage_id, pip_id, stage_name, probability) VALUES ${values}`;

                db.query(query, (err, result) => {
                    if (err) {
                        return res.status(500).json({ status: false, error: `Internal server error ${err}` });
                    }
                    else {
                        res.status(201).json({ status: true, data: `Inserted ${result.affectedRows} row(s)` });
                    }
                })
            }

        })

    } catch (err) {
        res.status(500).json({ status: false, error: `Internal server error ${err}` });
    }
};

export const getAllPipeline = async (req, res) => {
    const { name, page, pageSize } = req.query;
    const emp_id = req.user.emp_id;
    try {
        let query = `SELECT * FROM pipelines WHERE emp_id=?`;
        let countQuery = 'SELECT COUNT(*) AS totalRows FROM pipelines WHERE emp_id=?';

        if (name && name !== 'undefined') {
            query += ` AND name LIKE ?`;
            const searchTerm = `%${name}%`;

            db.query(query, [emp_id, searchTerm], (err, result) => {
                if (err) {
                    res.status(500).json({ status: false, error: `Internal server error ${err}` });
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

            db.query(countQuery, [emp_id], (err, countResult) => {
                if (err) {
                    res.status(500).json({ status: false, error: `Internal server error ${err}` });
                }
                const totalRows = countResult[0].totalRows;
                db.query(query, [emp_id, limit, offset], (err, result) => {
                    if (err) {
                        res.status(500).json({ status: false, error: `Internal server error ${err}` });
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
        res.status(500).json({ status: false, error: `Internal server error ${err}` });
    }
}

export const getSinglePipeline = async (req, res) => {
    const id = req.params.id;
    try {
        const query = 'SELECT * FROM pipelines WHERE id = ?';
        db.query(query, [id], (err, result) => {
            if (err) {
                res.status(500).json({ status: false, error: `Internal server error ${err}` });
            }
            res.status(201).json({ status: true, data: result });
        })

    } catch (err) {
        res.status(500).json({ status: false, error: `Internal server error ${err}` });
    }
}


export const deletePipeline = async (req, res) => {
    const id = req.params.id;

    try {
        const deleteStagesQuery = 'DELETE FROM stages WHERE pip_id = ?';
        const deletePipelineQuery = 'DELETE FROM pipelines WHERE pip_id = ?';
        const deleteDealsQuery = 'DELETE FROM deals WHERE pip_id = ?';

        // Delete stages associated with the pipeline
        db.query(deleteStagesQuery, [id], (err, stagesResult) => {
            if (err) {
                res.status(500).json({ status: false, error: `Internal server error ${err}` });
            }

            db.query(deleteDealsQuery, [id], (err, dealsResult) => {
                if (err) {
                    res.status(500).json({ status: false, error: `Internal server error ${err}` });
                }
                // Now, delete the pipeline
                db.query(deletePipelineQuery, [id], (err, pipelineResult) => {
                    if (err) {
                        res.status(500).json({ status: false, error: `Internal server error ${err}` });
                    }

                    res.status(200).json({ status: true, data: 'Pipeline and associated stages deleted successfully' });
                });;
            });

        });
    }
    catch (err) {
        res.status(500).json({ status: false, error: `Internal server error ${err}` });
    }
}


export const getStagesByPipelineId = async (req, res) => {
    const id = req.params.pipeline_id;
    try {
        const query = 'SELECT * FROM stages WHERE pip_id = ?';
        db.query(query, [id], (err, result) => {
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


export const createStage = async (req, res) => {
    const fields = req.body;

    try {
        const newFields = { ...fields, stage_id: generateId("STAGE") }
        let insertedFileds = [];
        let query = 'INSERT INTO stages (';

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
        console.log(newFields)

        db.query(query, insertedFileds, (err, result) => {
            if (err) {
                res.status(500).json({ status: false, error: `Internal server error ${err}` });
            }
            else {
                const updateQuery = 'UPDATE pipelines SET no_of_stages = COALESCE(no_of_stages, 0) + 1 WHERE pip_id = ?';
                db.query(updateQuery, [newFields.pip_id], (err, result) => {
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
};

export const updateStage = async (req, res) => {
    const id = req.params.stage_id;
    const fieldsToUpdate = req.body;

    try {
        let query = "UPDATE stages SET ";

        let updateValues = [];
        for (const [key, value] of Object.entries(fieldsToUpdate)) {
            query += `${key}=?,`;
            updateValues.push(value);

        }
        query = query.slice(0, -1); // Removing last comma

        query += " WHERE stage_id=?"
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

export const getStage = async (req, res) => {
    const id = req.params.stage_id;
    try {
        const query = 'SELECT * FROM stages WHERE stage_id = ?';
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

// export const deleteStage = async (req, res) => {
//     const id = req.params.card_id;

//     try {
//         const query = 'DELETE FROM stages WHERE id = ?';
//         db.query(query, [id], (err, result) => {
//             if (err) {
//                 res.status(500).json({ status: false, error: `Internal server error ${err}` });
//             }
//             else {
//                 res.status(200).json({ status: true, data: result });
//             }
//         })

//     } catch (err) {
//         res.status(500).json({ status: false, error: `Internal server error ${err}` });
//     }
// }

export const getPipelineView = async (req, res) => {
    const id = req.params.pipeline_id;
    try {
        const query = 'SELECT * FROM stages WHERE pip_id = ?';
        const result = await new Promise((resolve, reject) => {
            db.query(query, [id], (err, result) => {
                if (err) {
                    reject(err);
                }
                resolve(result);
            });
        });

        const initialColumns = [];

        for (let i = 0; i < result.length; i++) {
            const stage = result[i];
            const result2 = await new Promise((resolve, reject) => {
                db.query('SELECT * FROM deals WHERE stage_id = ? AND deal_status="active"', [stage.stage_id], (err, result2) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(result2);
                });
            });

            const totalDealVal = result2.reduce((total, deal) => total + parseInt(deal.deal_value), 0);
            const cardIds = result2.map(deal => deal.deal_id);
            const cardDeatils = result2.map(deal => deal);
            // const stageId = stage.id

            const obj = {
                id: stage.stage_id,
                title: {
                    stageName: stage.stage_name,
                    price: totalDealVal
                },
                cardIds: cardIds,
                cardDeatils: cardDeatils
            };

            initialColumns.push(obj);
        }

        res.send(initialColumns);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

