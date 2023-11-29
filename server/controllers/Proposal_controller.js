import db from '../config/mySQL_DB.js'
import {uplaodToS3, deleteFromS3} from '../services/FilesOperation.js'

import sendEmail from '../services/Send_mail.js'
import fs from 'fs'
import cheerio from 'cheerio';

const uploadFiles = (files)=>{
    return new Promise( async(resolve, rejects)=>{
        const filesUrl = [];
        for (let i = 0; i < files.length; i++) {
            const imageData = files[i].src.replace(/^data:image\/\w+;base64,/, '');
            const filename = `image_${Date.now()}.png`;
            fs.writeFileSync(filename, imageData, 'base64');

            await uplaodToS3(filename, '/'+ filename).then((res)=>{
                filesUrl.push(`https://superdolphins.com/superdolphins.com/superdolphinsltd/${filename}`);
                fs.unlinkSync(filename);
            }).catch((err)=>{
                rejects(err);
            })
        }
        resolve(filesUrl)
    })
}

export const createProposal = async (req, res) => {
    const {fields, imagesInfo} = req.body;

    try {
        let insertedFileds = [];
        let query = 'INSERT INTO proposals (';

        let email;
        let title;
        let template;
        for (const [key, value] of Object.entries(fields)) {
            if (key === 'template') template = value;
        }

        await uploadFiles(imagesInfo).then((urls)=>{
            console.log(urls)
            // replacing template image src attribute with the uplaoded url.
            const $ = cheerio.load(template);
            $('img').each((index, element) => {
                const img = $(element);
                img.attr('src', urls[index]);
            });

            const updatedTemplate = $.html();
            for (const [key, value] of Object.entries(fields)) {
                query += `${key}, `
                
                if (key === 'email') {
                    insertedFileds.push(value);
                    email = value;
                }
                else if (key === 'title') {
                    title = value;
                    insertedFileds.push(value);
                }
                else if (key === 'template') {
                    insertedFileds.push(updatedTemplate);
                }
                else{
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
            console.log(insertedFileds)
            console.log(query)

            sendEmail('siemonab@gmail.com', title, updatedTemplate);

            db.query(query, insertedFileds, (err, result) => {
                if (err) throw err;
                res.send(`Inserted ${result.affectedRows} row(s)`);
            })

        }).catch((err)=>{
            console.log(err)
        })

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getAllProposal = async (req, res) => {
    const { name } = req.query
    try {
        const query = 'SELECT * FROM proposals';
        if (name && name !== 'undefined') {
            db.query(query, (err, result) => {
                if (err) throw err;
                const ans = result.filter((element) => {
                    return element.owner.toLowerCase().includes(name.toLowerCase())
                })
                res.send(ans);
            })
        }
        else {
            db.query(query, (err, result) => {
                if (err) throw err;
                res.send(result);
            })
        }

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const getSingleProposal = async (req, res) => {
    const id = req.params.id;
    try {
        const query = 'SELECT * FROM proposals WHERE id = ?';
        db.query(query, [id], (err, result) => {
            if (err) throw err;
            res.send(result);
        })

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const getEmployeeProposal = async (req, res) => {
    const id = req.params.id;
    try {
        const query = 'SELECT * FROM employees WHERE id = ?';
        db.query(query, [id], (err, result) => {
            if (err) throw err;
            const dep_name = result[0].department;

            const query2 = 'SELECT * FROM proposals';
            db.query(query2, [id], (err, result2) => {
                if (err) throw err;
                const response = [];
                result2.map((elem) => {
                    if (JSON.parse(elem.departments).includes(dep_name)) {
                        response.push(elem)
                    }
                })
                res.send(response);
            })
        })


    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const updateProposal = async (req, res) => {
    const id = req.params.id;
    const fieldsToUpdate = req.body;
    try {
        let query = "UPDATE proposals SET ";
        let updateValues = [];

        let email;
        let status;
        let template;
        for (const [key, value] of Object.entries(fieldsToUpdate)) {
            query += `${key} = ?, `;
            // if(key === 'template'){
            //     updateValues.push(value.replace(/^\uFEFF/, ''));
            // }
            // else{
                updateValues.push(value);
            // }


            if (key === 'email') {
                email = value;
            }
            else if(key === 'status') {
                status = value;
            }
            else if(key === 'template'){
                template = value;
            }
        }
        query = query.slice(0, -2); // Removing last comma

        query += " WHERE id=?"
        updateValues.push(id);

        sendEmail('siemonab@gmail.com', status, template);

        db.query(query, updateValues, (err, result) => {
            if (err) throw err;
            res.send(result);
        })

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const deleteProposal = async (req, res) => {
    const id = req.params.id;

    try {
        const query = 'DELETE FROM proposals WHERE id = ?';
        db.query(query, [id], (err, result) => {
            if (err) throw err;
            res.send(result);
        })

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const getEmails = async (req, res) => {
    const id = req.params.deal_id;

    try {
        const query = 'SELECT * FROM deals WHERE id = ?';
        db.query(query, [id], (err, result) => {
            if (err) throw err;
            const db_name = result[0].lead_type;
            const name = result[0]?.lead_type_value;

            const query2 = `SELECT * FROM ${db_name} WHERE name = ?`;
            db.query(query2, [name], (err, result) => {
                if (err) throw err;
                const data = result[0]
                res.send(data);
            })
        })

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}
