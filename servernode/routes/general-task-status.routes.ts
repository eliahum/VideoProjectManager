import express from 'express';
import generalTaskStatusService from '../services/generalTaskStatusService';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = express.Router();

// Apply authentication to all routes
router.use(authenticate);

router.get('/', async (req, res) => {
    const response = await generalTaskStatusService.getAllGeneralTaskStatuses();
    if (response.isSuccess) {
        res.json(response);
    } else {
        res.status(500).json(response);
    }
});

router.get('/with-counts', async (req, res) => {
    const response = await generalTaskStatusService.getAllGeneralTaskStatusesWithCounts();
    if (response.isSuccess) {
        res.json(response);
    } else {
        res.status(500).json(response);
    }
});

router.get('/:id', async (req, res) => {
    const response = await generalTaskStatusService.getGeneralTaskStatusById(req.params.id);
    if (response.isSuccess) {
        res.json(response);
    } else {
        res.status(response.errorText?.includes('not found') ? 404 : 500).json(response);
    }
});

// Admin only routes
router.post('/', authorize('admin'), async (req, res) => {
    const response = await generalTaskStatusService.createGeneralTaskStatus(req.body);
    if (response.isSuccess) {
        res.status(201).json(response);
    } else {
        res.status(500).json(response);
    }
});

router.put('/:id', authorize('admin'), async (req, res) => {
    const response = await generalTaskStatusService.updateGeneralTaskStatus(req.params.id, req.body);
    if (response.isSuccess) {
        res.json(response);
    } else {
        res.status(response.errorText?.includes('not found') ? 404 : 500).json(response);
    }
});

router.delete('/:id', authorize('admin'), async (req, res) => {
    const response = await generalTaskStatusService.deleteGeneralTaskStatus(req.params.id);
    if (response.isSuccess) {
        res.json(response);
    } else {
        res.status(response.errorText?.includes('not found') ? 404 : 500).json(response);
    }
});

export default router;
