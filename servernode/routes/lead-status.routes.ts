import express from 'express';
import { getAllLeadStatuses, getLeadStatusById, createLeadStatus, updateLeadStatus, deleteLeadStatus } from '../services/leadStatusService';

const router = express.Router();

router.get('/', async (req, res) => {
    const response = await getAllLeadStatuses();
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
