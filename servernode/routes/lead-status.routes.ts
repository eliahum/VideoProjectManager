import express from 'express';
import { getAllLeadStatuses, getAllLeadStatusesWithCounts, getLeadStatusById, createLeadStatus, updateLeadStatus, deleteLeadStatus } from '../services/leadStatusService';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();

// Apply authentication to all routes
router.use(authenticate);

router.get('/', async (req, res) => {
    const response = await getAllLeadStatuses();
    if (response.isSuccess) {
        res.json(response);
    } else {
        res.status(500).json(response);
    }
});

router.get('/with-counts', async (req, res) => {
    const response = await getAllLeadStatusesWithCounts();
    if (response.isSuccess) {
        res.json(response);
    } else {
        res.status(500).json(response);
    }
});

router.get('/:id', async (req, res) => {
    const response = await getLeadStatusById(req.params.id);
    if (response.isSuccess) {
        res.json(response);
    } else {
        res.status(response.errorText === 'Lead status not found' ? 404 : 500).json(response);
    }
});

router.post('/', async (req, res) => {
    const response = await createLeadStatus(req.body);
    if (response.isSuccess) {
        res.status(201).json(response);
    } else {
        res.status(500).json(response);
    }
});

router.put('/:id', async (req, res) => {
    const response = await updateLeadStatus(req.params.id, req.body);
    if (response.isSuccess) {
        res.json(response);
    } else {
        res.status(response.errorText === 'Lead status not found' ? 404 : 500).json(response);
    }
});

router.delete('/:id', async (req, res) => {
    const response = await deleteLeadStatus(req.params.id);
    if (response.isSuccess) {
        res.json(response);
    } else {
        res.status(response.errorText === 'Lead status not found' ? 404 : 500).json(response);
    }
});

export default router;
