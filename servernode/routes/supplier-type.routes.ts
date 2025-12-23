import { Router, Request, Response } from 'express';
import supplierTypeService from '../services/supplierTypeService';

const router = Router();

// GET /api/supplier-types - Get all supplier types
router.get('/', async (req: Request, res: Response) => {
  try {
    const activeOnly = req.query.activeOnly === 'true';
    const supplierTypes = activeOnly 
      ? await supplierTypeService.getActive()
      : await supplierTypeService.getAll();
    
    res.json({
      isSuccess: true,
      data: supplierTypes,
      errorText: null
    });
  } catch (error: any) {
    res.status(500).json({
      isSuccess: false,
      data: null,
      errorText: error.message || 'Error fetching supplier types'
    });
  }
});

// GET /api/supplier-types/:id - Get supplier type by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const supplierType = await supplierTypeService.getById(req.params.id);
    
    if (!supplierType) {
      return res.status(404).json({
        isSuccess: false,
        data: null,
        errorText: 'Supplier type not found'
      });
    }

    res.json({
      isSuccess: true,
      data: supplierType,
      errorText: null
    });
  } catch (error: any) {
    res.status(500).json({
      isSuccess: false,
      data: null,
      errorText: error.message || 'Error fetching supplier type'
    });
  }
});

// POST /api/supplier-types - Create new supplier type
router.post('/', async (req: Request, res: Response) => {
  try {
    const supplierType = await supplierTypeService.create(req.body);
    
    res.status(201).json({
      isSuccess: true,
      data: supplierType,
      errorText: null
    });
  } catch (error: any) {
    res.status(500).json({
      isSuccess: false,
      data: null,
      errorText: error.message || 'Error creating supplier type'
    });
  }
});

// PUT /api/supplier-types/:id - Update supplier type
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const supplierType = await supplierTypeService.update(req.params.id, req.body);
    
    if (!supplierType) {
      return res.status(404).json({
        isSuccess: false,
        data: null,
        errorText: 'Supplier type not found'
      });
    }

    res.json({
      isSuccess: true,
      data: supplierType,
      errorText: null
    });
  } catch (error: any) {
    res.status(500).json({
      isSuccess: false,
      data: null,
      errorText: error.message || 'Error updating supplier type'
    });
  }
});

// DELETE /api/supplier-types/:id - Delete supplier type
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const success = await supplierTypeService.delete(req.params.id);
    
    if (!success) {
      return res.status(404).json({
        isSuccess: false,
        data: null,
        errorText: 'Supplier type not found'
      });
    }

    res.json({
      isSuccess: true,
      data: { message: 'Supplier type deleted successfully' },
      errorText: null
    });
  } catch (error: any) {
    res.status(500).json({
      isSuccess: false,
      data: null,
      errorText: error.message || 'Error deleting supplier type'
    });
  }
});

export default router;
