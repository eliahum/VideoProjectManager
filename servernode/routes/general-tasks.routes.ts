import express from 'express';
import generalTasksService from '../services/generalTasksService';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = express.Router();

// Apply authentication to all routes
router.use(authenticate);

router.get('/', async (req, res) => {
    const response = await generalTasksService.getAllGeneralTasks();
    if (response.isSuccess) {
        res.json(response);
    } else {
        res.status(500).json(response);
    }
});

router.get('/:id', async (req, res) => {
    const response = await generalTasksService.getGeneralTaskById(req.params.id);
    if (response.isSuccess) {
        res.json(response);
    } else {
        res.status(response.errorText?.includes('not found') ? 404 : 500).json(response);
    }
});

router.post('/', async (req, res) => {
    const response = await generalTasksService.createGeneralTask(req.body);
    if (response.isSuccess) {
        res.status(201).json(response);
    } else {
        res.status(500).json(response);
    }
});

router.put('/:id', async (req, res) => {
    const response = await generalTasksService.updateGeneralTask(req.params.id, req.body);
    if (response.isSuccess) {
        res.json(response);
    } else {
        res.status(response.errorText?.includes('not found') ? 404 : 500).json(response);
    }
});

router.delete('/:id', async (req, res) => {
    const response = await generalTasksService.deleteGeneralTask(req.params.id);
    if (response.isSuccess) {
        res.json(response);
    } else {
        res.status(response.errorText?.includes('not found') ? 404 : 500).json(response);
    }
});

export default router;
