import express from 'express';
import { projectsService } from '../services/projectsService';

const router = express.Router();

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

export default router;
