import  express   from "express";
import { createOrganization, deleteOrganization, getAllOrganization, getSingleOrganization, updateOrganization} from "../controllers/Organization_controller.js";
import verifyToken from '../middleware/verifyToken.js';


const router = express.Router();


router.post('/create', createOrganization)
router.get('/get',verifyToken, getAllOrganization);
router.get('/:id/get', getSingleOrganization);
router.put('/:id/update', updateOrganization)
router.delete('/:id/delete', deleteOrganization)


export default router