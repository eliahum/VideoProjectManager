import express from 'express';
import { getAllCustomers, getCustomerById, createCustomer, updateCustomer, deleteCustomer } from '../services/customersService';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const customers = await getAllCustomers();
        res.json(customers);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch customers' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const customer = await getCustomerById(req.params.id);
        if (customer) {
            res.json(customer);
        } else {
            res.status(404).json({ error: 'Customer not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch customer' });
    }
});

router.post('/', async (req, res) => {
    try {
        const newCustomer = await createCustomer(req.body);
        res.status(201).json(newCustomer);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create customer' });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const updatedCustomer = await updateCustomer(req.params.id, req.body);
        if (updatedCustomer) {
            res.json(updatedCustomer);
        } else {
            res.status(404).json({ error: 'Customer not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to update customer' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const deletedCustomer = await deleteCustomer(req.params.id);
        if (deletedCustomer) {
            res.json(deletedCustomer);
        } else {
            res.status(404).json({ error: 'Customer not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete customer' });
    }
});

export default router;