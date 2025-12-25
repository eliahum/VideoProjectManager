import express from 'express';
import { getAllProjectStatuses, getProjectStatusById, createProjectStatus, updateProjectStatus, deleteProjectStatus } from '../services/projectStatusService';

const router = express.Router();

router.get('/', async (req, res) => {
    const response = await getAllProjectStatuses();
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

router.post('/', async (req, res) => {
    const response = await createProjectStatus(req.body);
    if (response.isSuccess) {
        res.status(201).json(response);
    } else {
        res.status(500).json(response);
    }
});

router.put('/:id', async (req, res) => {
    const response = await updateProjectStatus(req.params.id, req.body);
    if (response.isSuccess) {
        res.json(response);
    } else {
        res.status(response.errorText === 'Project status not found' ? 404 : 500).json(response);
    }
});

router.delete('/:id', async (req, res) => {
    const response = await deleteProjectStatus(req.params.id);
    if (response.isSuccess) {
        res.json(response);
    } else {
        res.status(response.errorText === 'Project status not found' ? 404 : 500).json(response);
    }
});

export default router;
