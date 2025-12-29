import express from 'express';
import { getAllLeads, getLeadById, createLead, updateLead, deleteLead } from '../services/leadsService';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();

// Apply authentication to all routes
router.use(authenticate);

router.get('/', async (req, res) => {
    const response = await getAllLeads();
    if (response.isSuccess) {
        res.json(response);
    } else {
        res.status(500).json(response);
    }
});

router.get('/:id', async (req, res) => {
    const response = await getLeadById(req.params.id);
    if (response.isSuccess) {
        res.json(response);
    } else {
        res.status(response.errorText === 'Lead not found' ? 404 : 500).json(response);
    }
});

router.post('/', async (req, res) => {
    const response = await createLead(req.body);
    if (response.isSuccess) {
        res.status(201).json(response);
    } else {
        res.status(500).json(response);
    }
});

router.put('/:id', async (req, res) => {
    const response = await updateLead(req.params.id, req.body);
    if (response.isSuccess) {
        res.json(response);
    } else {
        res.status(response.errorText === 'Lead not found' ? 404 : 500).json(response);
    }
});

router.delete('/:id', async (req, res) => {
    const response = await deleteLead(req.params.id);
    if (response.isSuccess) {
        res.json(response);
    } else {
        res.status(response.errorText === 'Lead not found' ? 404 : 500).json(response);
    }
});

export default router;