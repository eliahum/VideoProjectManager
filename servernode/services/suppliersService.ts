import Supplier from '../models/supplier.model';
import { SupplierDTO, SupplierResponseDTO, SupplierListResponseDTO } from '../dtos/supplier.dto';
import { SupplierTypeDocument } from '../models/supplier-type.model';
import { connectToDatabase } from '../utils/db';

export const getAllSuppliers = async (): Promise<SupplierListResponseDTO> => {
    try {
        await connectToDatabase();
        
        const suppliers = await Supplier.find().populate('supplierType').sort({ supplierNumber: 1 });
        const data = suppliers.map((supplier) => {
            const { _id, supplierNumber, name, phone, email, accountDetails, isPaid, notes, createdAt, updatedAt } = supplier;
            const supplierType = supplier.supplierType as unknown as SupplierTypeDocument | undefined;
            return { 
                id: _id.toString(), 
                supplierNumber,
                name,
                phone,
                email,
                supplierType: supplierType ? {
                    id: supplierType._id.toString(),
                    supplierTypeNumber: supplierType.supplierTypeNumber,
                    name: supplierType.name,
                    description: supplierType.description,
                    isActive: supplierType.isActive,
                    createdAt: supplierType.createdAt!,
                    updatedAt: supplierType.updatedAt!
                } : undefined,
                accountDetails,
                isPaid,
                notes,
                createdAt,
                updatedAt
            };
        });
        return { isSuccess: true, data };
    } catch (error) {
        console.error('[getAllSuppliers] Error fetching suppliers:', error);
        return { isSuccess: false, errorText: 'Failed to fetch suppliers' };
    }
};

export const getSupplierById = async (id: string): Promise<SupplierResponseDTO> => {
    try {
        await connectToDatabase();
        
        const supplier = await Supplier.findById(id).populate('supplierType');
        if (!supplier) return { isSuccess: false, errorText: 'Supplier not found' };
        
        const { _id, supplierNumber, name, phone, email, accountDetails, isPaid, notes, createdAt, updatedAt } = supplier;
        const supplierType = supplier.supplierType as unknown as SupplierTypeDocument | undefined;
        const data = { 
            id: _id.toString(), 
            supplierNumber,
            name,
            phone,
            email,
            supplierType: supplierType ? {
                id: supplierType._id.toString(),
                supplierTypeNumber: supplierType.supplierTypeNumber,
                name: supplierType.name,
                description: supplierType.description,
                isActive: supplierType.isActive,
                createdAt: supplierType.createdAt!,
                updatedAt: supplierType.updatedAt!
            } : undefined,
            accountDetails,
            isPaid,
            notes,
            createdAt,
            updatedAt
        };
        return { isSuccess: true, data };
    } catch (error) {
        console.error('[getSupplierById] Error fetching supplier:', error);
        return { isSuccess: false, errorText: 'Failed to fetch supplier' };
    }
};

export const createSupplier = async (supplierData: Partial<SupplierDTO>): Promise<SupplierResponseDTO> => {
    try {
        await connectToDatabase();
        
        const supplier = new Supplier(supplierData);
        const savedSupplier = await supplier.save();
        await savedSupplier.populate('supplierType');
        
        const { _id, supplierNumber, name, phone, email, accountDetails, isPaid, notes, createdAt, updatedAt } = savedSupplier;
        const supplierType = savedSupplier.supplierType as unknown as SupplierTypeDocument | undefined;
        const data = { 
            id: _id.toString(), 
            supplierNumber,
            name,
            phone,
            email,
            supplierType: supplierType ? {
                id: supplierType._id.toString(),
                supplierTypeNumber: supplierType.supplierTypeNumber,
                name: supplierType.name,
                description: supplierType.description,
                isActive: supplierType.isActive,
                createdAt: supplierType.createdAt!,
                updatedAt: supplierType.updatedAt!
            } : undefined,
            accountDetails,
            isPaid,
            notes,
            createdAt,
            updatedAt
        };
        return { isSuccess: true, data };
    } catch (error) {
        console.error('[createSupplier] Error creating supplier:', error);
        return { isSuccess: false, errorText: 'Failed to create supplier' };
    }
};

export const updateSupplier = async (id: string, updateData: Partial<SupplierDTO>): Promise<SupplierResponseDTO> => {
    try {
        await connectToDatabase();
        
        const updatedSupplier = await Supplier.findByIdAndUpdate(id, updateData, { new: true }).populate('supplierType');
        if (!updatedSupplier) return { isSuccess: false, errorText: 'Supplier not found' };
        
        const { _id, supplierNumber, name, phone, email, accountDetails, isPaid, notes, createdAt, updatedAt } = updatedSupplier;
        const supplierType = updatedSupplier.supplierType as unknown as SupplierTypeDocument | undefined;
        const data = { 
            id: _id.toString(), 
            supplierNumber,
            name,
            phone,
            email,
            supplierType: supplierType ? {
                id: supplierType._id.toString(),
                supplierTypeNumber: supplierType.supplierTypeNumber,
                name: supplierType.name,
                description: supplierType.description,
                isActive: supplierType.isActive,
                createdAt: supplierType.createdAt!,
                updatedAt: supplierType.updatedAt!
            } : undefined,
            accountDetails,
            isPaid,
            notes,
            createdAt,
            updatedAt
        };
        return { isSuccess: true, data };
    } catch (error) {
        console.error('[updateSupplier] Error updating supplier:', error);
        return { isSuccess: false, errorText: 'Failed to update supplier' };
    }
};

export const deleteSupplier = async (id: string): Promise<SupplierResponseDTO> => {
    try {
        await connectToDatabase();
        
        const deletedSupplier = await Supplier.findByIdAndDelete(id).populate('supplierType');
        if (!deletedSupplier) return { isSuccess: false, errorText: 'Supplier not found' };
        
        const { _id, supplierNumber, name, phone, email, accountDetails, isPaid, notes, createdAt, updatedAt } = deletedSupplier;
        const supplierType = deletedSupplier.supplierType as unknown as SupplierTypeDocument | undefined;
        const data = { 
            id: _id.toString(), 
            supplierNumber,
            name,
            phone,
            email,
            supplierType: supplierType ? {
                id: supplierType._id.toString(),
                supplierTypeNumber: supplierType.supplierTypeNumber,
                name: supplierType.name,
                description: supplierType.description,
                isActive: supplierType.isActive,
                createdAt: supplierType.createdAt!,
                updatedAt: supplierType.updatedAt!
            } : undefined,
            accountDetails,
            isPaid,
            notes,
            createdAt,
            updatedAt
        };
        return { isSuccess: true, data };
    } catch (error) {
        console.error('[deleteSupplier] Error deleting supplier:', error);
        return { isSuccess: false, errorText: 'Failed to delete supplier' };
    }
};
