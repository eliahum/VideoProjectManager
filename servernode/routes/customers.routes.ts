import express from 'express';
import { getAllCustomers, getCustomerById, createCustomer, updateCustomer, deleteCustomer } from '../services/customersService';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();

// Apply authentication to all routes
router.use(authenticate);

router.get('/', async (req, res) => {
    const response = await getAllCustomers();
    if (response.isSuccess) {
        res.json(response);
    } else {
        res.status(500).json(response);
    }
});

router.get('/:id', async (req, res) => {
    const response = await getCustomerById(req.params.id);
    if (response.isSuccess) {
        res.json(response);
    } else {
        res.status(response.errorText === 'Customer not found' ? 404 : 500).json(response);
    }
});

router.post('/', async (req, res) => {
    const response = await createCustomer(req.body);
    if (response.isSuccess) {
        res.status(201).json(response);
    } else {
        res.status(500).json(response);
    }
});

router.put('/:id', async (req, res) => {
    const response = await updateCustomer(req.params.id, req.body);
    if (response.isSuccess) {
        res.json(response);
    } else {
        res.status(response.errorText === 'Customer not found' ? 404 : 500).json(response);
    }
});

router.delete('/:id', async (req, res) => {
    const response = await deleteCustomer(req.params.id);
    if (response.isSuccess) {
        res.json(response);
    } else {
        res.status(response.errorText === 'Customer not found' ? 404 : 500).json(response);
    }
});

export default router;