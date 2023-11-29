import  express   from "express";
import { createPersons, deletePersons, getAllPersons, getSinglePersons, updatePersons} from "../controllers/Persons_controller.js";
import verifyToken from '../middleware/verifyToken.js';


const router = express.Router();


router.post('/create', createPersons)
router.get('/get', verifyToken , getAllPersons);
router.get('/:id/get', getSinglePersons);
router.put('/:id/update', updatePersons)
router.delete('/:id/delete', deletePersons)


export default router