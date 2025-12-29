import express from 'express';
import { milestoneStatusService } from '../services/milestoneStatusService';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();

// Apply authentication to all routes
router.use(authenticate);

router.get('/', async (req, res) => {
  const result = await milestoneStatusService.getAllMilestoneStatuses();
  res.json(result);
});

router.get('/with-counts', async (req, res) => {
  const result = await milestoneStatusService.getAllMilestoneStatusesWithCounts();
  res.json(result);
});

router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const result = await milestoneStatusService.getMilestoneStatusById(id);
  res.json(result);
});

router.post('/', async (req, res) => {
  const result = await milestoneStatusService.createMilestoneStatus(req.body);
  res.json(result);
});

router.put('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const result = await milestoneStatusService.updateMilestoneStatus(id, req.body);
  res.json(result);
});

router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const result = await milestoneStatusService.deleteMilestoneStatus(id);
  res.json(result);
});

export default router;
