import express from 'express';
import { getAllProjectStatuses, getAllProjectStatusesWithCounts, getProjectStatusById, createProjectStatus, updateProjectStatus, deleteProjectStatus } from '../services/projectStatusService';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = express.Router();

// Apply authentication to all routes
router.use(authenticate);

router.get('/', async (req, res) => {
    const response = await getAllProjectStatuses();
    if (response.isSuccess) {
        res.json(response);
    } else {
        res.status(500).json(response);
    }
});

router.get('/with-counts', async (req, res) => {
    const response = await getAllProjectStatusesWithCounts();
    if (response.isSuccess) {
        res.json(response);
    } else {
        res.status(500).json(response);
    }
});

router.get('/:id', async (req, res) => {
    const response = await getProjectStatusById(req.params.id);
    if (response.isSuccess) {
        res.json(response);
    } else {
        res.status(response.errorText === 'Project status not found' ? 404 : 500).json(response);
    }
});

// Admin only routes - create, update, delete
router.post('/', authorize('admin'), async (req, res) => {
    const response = await createProjectStatus(req.body);
    if (response.isSuccess) {
        res.status(201).json(response);
    } else {
        res.status(500).json(response);
    }
});

router.put('/:id', authorize('admin'), async (req, res) => {
    const response = await updateProjectStatus(req.params.id, req.body);
    if (response.isSuccess) {
        res.json(response);
    } else {
        res.status(response.errorText === 'Project status not found' ? 404 : 500).json(response);
    }
});

router.delete('/:id', authorize('admin'), async (req, res) => {
    const response = await deleteProjectStatus(req.params.id);
    if (response.isSuccess) {
        res.json(response);
    } else {
        res.status(response.errorText === 'Project status not found' ? 404 : 500).json(response);
    }
});

export default router;
