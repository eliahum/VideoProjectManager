import express from 'express';
import { stageTemplateService } from '../services/stageTemplateService';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();

// Apply authentication to all routes
router.use(authenticate);

router.get('/', async (req, res) => {
  const result = await stageTemplateService.getAllStageTemplates();
  res.json(result);
});

router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const result = await stageTemplateService.getStageTemplateById(id);
  res.json(result);
});

router.post('/', async (req, res) => {
  const result = await stageTemplateService.createStageTemplate(req.body);
  res.json(result);
});

router.put('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const result = await stageTemplateService.updateStageTemplate(id, req.body);
  res.json(result);
});

router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const result = await stageTemplateService.deleteStageTemplate(id);
  res.json(result);
});

export default router;
