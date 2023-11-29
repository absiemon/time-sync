import {PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import connectToS3 from '../config/S3Config.js'
import { S3Client } from '@aws-sdk/client-s3';
import fs from 'fs'

export const uplaodToS3 = async (path, originalname, mimetype)=> {
    const client = new S3Client({
        credentials: {
            accessKeyId: process.env.ACCESS_KEY,
            secretAccessKey: process.env.SECRET_ACCESS_KEY
        },
        region: process.env.BUCKET_REGION ,
    })

    const newFilename = originalname + "-" + Date.now();
    await client.send(new PutObjectCommand({
        Bucket: process.env.BUCKET_NAME,
        Body: fs.readFileSync(path),
        Key: newFilename,
        ContentType: mimetype,
    }))
    return newFilename;
}

export const deleteFromS3 = async (filename)=> {
    try {
        const client = new S3Client({
            credentials: {
                accessKeyId: process.env.ACCESS_KEY,
                secretAccessKey: process.env.SECRET_ACCESS_KEY
            },
            region: process.env.BUCKET_REGION ,
        })

        await client.send(new DeleteObjectCommand({
            Bucket: process.env.BUCKET_NAME,
            Key: filename,
        }));

        return `File ${filename} deleted successfully from S3`;
    } catch (error) {
        console.error('Error deleting file from S3:', error);
        throw error;
    }
}