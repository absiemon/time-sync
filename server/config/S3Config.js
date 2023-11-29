import { S3Client } from '@aws-sdk/client-s3';

const connectToS3 = async ()=> {
    try {
        const client = new S3Client({
            credentials: {
                accessKeyId: process.env.ACCESS_KEY,
                secretAccessKey: process.env.SECRET_ACCESS_KEY
            },
            region: process.env.BUCKET_REGION ,
        })
        return client
    } catch (error) {
        throw new Error(error)
    }   
}

export default connectToS3;