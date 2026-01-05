import express from 'express';
import { 
    getAllCustomers, 
    getCustomerById, 
    createCustomer, 
    updateCustomer, 
    deleteCustomer,
    getCustomerContacts,
    addCustomerContact,
    updateCustomerContact,
    deleteCustomerContact
} from '../services/customersService';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();


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

// Contact Management Routes
router.get('/:id/contacts', async (req, res) => {
    const response = await getCustomerContacts(req.params.id);
    if (response.isSuccess) {
        res.json(response);
    } else {
        res.status(response.errorText === 'Customer not found' ? 404 : 500).json(response);
    }
});

router.post('/:id/contacts', async (req, res) => {
    const response = await addCustomerContact(req.params.id, req.body);
    if (response.isSuccess) {
        res.status(201).json(response);
    } else {
        res.status(response.errorText === 'Customer not found' ? 404 : 500).json(response);
    }
});

router.put('/:id/contacts/:contactIndex', async (req, res) => {
    const contactIndex = parseInt(req.params.contactIndex);
    const response = await updateCustomerContact(req.params.id, contactIndex, req.body);
    if (response.isSuccess) {
        res.json(response);
    } else {
        res.status(response.errorText === 'Customer not found' || response.errorText === 'Contact not found' ? 404 : 500).json(response);
    }
});

router.delete('/:id/contacts/:contactIndex', async (req, res) => {
    const contactIndex = parseInt(req.params.contactIndex);
    const response = await deleteCustomerContact(req.params.id, contactIndex);
    if (response.isSuccess) {
        res.json(response);
    } else {
        res.status(response.errorText === 'Customer not found' || response.errorText === 'Contact not found' ? 404 : 500).json(response);
    }
});

export default router;