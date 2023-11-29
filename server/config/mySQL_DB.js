
import mysql from 'mysql2'
import dotenv from 'dotenv';
dotenv.config();

// ---------- [DATABASE CONNECTION] ------------

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
}); 

db.connect((err)=>{
  if(err){
    console.log(err)
  }
  else{
    console.log("Database Connected")
  }
})

export default db;