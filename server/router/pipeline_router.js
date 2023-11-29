import  express   from "express";
import { createPipeline, deletePipeline, getAllPipeline, getSinglePipeline, getStagesByPipelineId, getPipelineView, createStage, updateStage, getStage} from "../controllers/Pipeline_controller.js";
import verifyToken from '../middleware/verifyToken.js';



const router = express.Router();


router.post('/create', createPipeline)
router.get('/get', verifyToken, getAllPipeline);
router.get('/:id/get', getSinglePipeline);
// router.put('/update/:id', updatePipeline)
router.delete('/:id/delete', deletePipeline)
router.get('/:pipeline_id/get-stages', getStagesByPipelineId);
router.get('/:pipeline_id/get-pipeline-view', getPipelineView);

router.post('/:pipeline_id/create-stage', createStage);
router.put('/:stage_id/update-stage', updateStage);
router.get('/:stage_id/get-stage', getStage);
// router.delete('/:stage_id/delete-stage', deleteStage)



export default router