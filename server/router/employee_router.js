import  express   from "express";
import { createEmployee, deletFTPfile, deleteEmployee, getAllEmployee, getSingleEmployee, updateEmployee, uploadFiles, getEmployeeByName } from "../controllers/Employee_controller.js";
import multer  from 'multer';

const router = express.Router();

const upload = multer({ dest: '/tmp' });

router.post('/create-employee', createEmployee)
router.get('/get-employee', getAllEmployee);
router.get('/get-single-employee/:id', getSingleEmployee);3
router.put('/update-employee/:id', updateEmployee)
router.delete('/delete-employee/:id', deleteEmployee)
router.post('/upload-files',  upload.array('files', 100), uploadFiles)
router.delete('/delete-ftp-file/:fname', deletFTPfile)
router.get('/get-employee-by-name/:value', getEmployeeByName)

export default router