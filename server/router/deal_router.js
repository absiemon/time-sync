import  express   from "express";
import { createDeal, deleteDeal, getAllDeal, getDealStatusMonthWise, getDealsMonthWise, getSingleDeal, getWonLossDealsYearWise, updateDeal, updateDealStage, updateDealStatus} from "../controllers/Deal_controller.js";
import verifyToken from "../middleware/verifyToken.js";


const router = express.Router();


router.post('/create', verifyToken,  createDeal)
router.get('/get', verifyToken, getAllDeal);
router.get('/:id/get', getSingleDeal);

router.put('/:id/update', updateDeal)
router.put('/:id/update_deal_status', updateDealStatus)
router.put('/:id/update_stageid', updateDealStage)

router.delete('/:id/delete', deleteDeal)

router.get('/get_deal', verifyToken, getDealsMonthWise);
router.get('/get_deal_status', verifyToken, getDealStatusMonthWise);

router.get('/get_won-loss_deals', verifyToken, getWonLossDealsYearWise);



export default router