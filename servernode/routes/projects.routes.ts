import express from 'express';
import { projectsService } from '../services/projectsService';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();

// Apply authentication to all routes
router.use(authenticate);

router.get('/', async (req, res) => {
  const result = await projectsService.getAllProjects();
  res.json(result);
});

router.get('/:id', async (req, res) => {
  const id = req.params.id;
  const result = await projectsService.getProjectById(id);
  res.json(result);
});

router.post('/', async (req, res) => {
  const result = await projectsService.createProject(req.body);
  res.json(result);
});

router.put('/:id', async (req, res) => {
  const id = req.params.id;
  const result = await projectsService.updateProject(id, req.body);
  res.json(result);
});

router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  const result = await projectsService.deleteProject(id);
  res.json(result);
});

router.post('/:projectId/stages/:stageNumber/milestones', async (req, res) => {
  const { projectId, stageNumber } = req.params;
  const result = await projectsService.createMilestone(
    projectId, 
    parseInt(stageNumber), 
    req.body
  );
  res.json(result);
});

router.patch('/:projectId/stages/:stageNumber/milestones/:milestoneId', async (req, res) => {
  const { projectId, stageNumber, milestoneId } = req.params;
  const result = await projectsService.updateMilestone(
    projectId, 
    parseInt(stageNumber), 
    parseInt(milestoneId), 
    req.body
  );
  res.json(result);
});

router.delete('/:projectId/stages/:stageNumber/milestones/:milestoneId', async (req, res) => {
  const { projectId, stageNumber, milestoneId } = req.params;
  const result = await projectsService.deleteMilestone(
    projectId, 
    parseInt(stageNumber), 
    parseInt(milestoneId)
  );
  res.json(result);
});

export default router;
