import express from 'express';
import { createUser, getSingleUser, login, logout, profile, updateUser, uploadEmpImage } from '../controllers/authCtrl.js';
import verifyToken from '../middleware/verifyToken.js';
import multer  from 'multer';
const router = express.Router();

const upload = multer({ dest: '/tmp' });


router.post("/create", createUser)
router.post("/login", login)
router.get("/:id/get", getSingleUser)
router.put("/:id/update", updateUser)
router.post('/:id/upload-image',  upload.array('files', 100), uploadEmpImage)

router.post("/logout", logout)
router.post("/profile", verifyToken, profile);



export default router;

