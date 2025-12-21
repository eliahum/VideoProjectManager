import express from 'express';
import { getAllLeads, getLeadById, createLead, updateLead, deleteLead } from '../services/leadsService';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const leads = await getAllLeads();
        res.json(leads);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch leads' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const lead = await getLeadById(req.params.id);
        if (lead) {
            res.json(lead);
        } else {
            res.status(404).json({ error: 'Lead not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch lead' });
    }
});

router.post('/', async (req, res) => {
    try {
        const newLead = await createLead(req.body);
        res.status(201).json(newLead);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create lead' });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const updatedLead = await updateLead(req.params.id, req.body);
        if (updatedLead) {
            res.json(updatedLead);
        } else {
            res.status(404).json({ error: 'Lead not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to update lead' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const deletedLead = await deleteLead(req.params.id);
        if (deletedLead) {
            res.json(deletedLead);
        } else {
            res.status(404).json({ error: 'Lead not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete lead' });
    }
});

export default router;