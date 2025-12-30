import express from 'express';
import { getAllSuppliers, getSupplierById, createSupplier, updateSupplier, deleteSupplier } from '../services/suppliersService';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();

// Apply authentication to all routes
router.use(authenticate);

router.get('/', async (req, res) => {
    const response = await getAllSuppliers();
    if (response.isSuccess) {
        res.json(response);
    } else {
        res.status(500).json(response);
    }
});

router.get('/:id', async (req, res) => {
    const response = await getSupplierById(req.params.id);
    if (response.isSuccess) {
        res.json(response);
    } else {
        res.status(response.errorText === 'Supplier not found' ? 404 : 500).json(response);
    }
});

router.post('/', async (req, res) => {
    const response = await createSupplier(req.body);
    if (response.isSuccess) {
        res.status(201).json(response);
    } else {
        res.status(500).json(response);
    }
});

router.put('/:id', async (req, res) => {
    const response = await updateSupplier(req.params.id, req.body);
    if (response.isSuccess) {
        res.json(response);
    } else {
        res.status(response.errorText === 'Supplier not found' ? 404 : 500).json(response);
    }
});

router.delete('/:id', async (req, res) => {
    const response = await deleteSupplier(req.params.id);
    if (response.isSuccess) {
        res.json(response);
    } else {
        res.status(response.errorText === 'Supplier not found' ? 404 : 500).json(response);
    }
});

export default router;
