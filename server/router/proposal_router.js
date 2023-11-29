import  express   from "express";
import { createProposal, deleteProposal, getAllProposal, getSingleProposal, updateProposal, getEmployeeProposal, getEmails} from "../controllers/Proposal_controller.js";


const router = express.Router();

router.post('/create', createProposal)
router.get('/get', getAllProposal);
router.get('/get/:id', getSingleProposal);
router.get('/get-Proposal/:id', getEmployeeProposal);
router.put('/update/:id', updateProposal)
router.delete('/delete/:id', deleteProposal)
router.get('/get-emails/:deal_id', getEmails);


export default router