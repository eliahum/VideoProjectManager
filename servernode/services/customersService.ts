import Customer from '../models/customer.model';
import { CustomerDTO, CustomerResponseDTO, CustomersListResponseDTO } from '../dtos/customer.dto';

export const getAllCustomers = async (): Promise<CustomersListResponseDTO> => {
    try {
        const customers = await Customer.find();
        const data = customers.map((customer) => {
            const { _id, name, email, phone, address, leadId } = customer;
            return {
                id: _id.toString(),
                name,
                email,
                phone,
                address,
                leadId: leadId ? leadId.toString() : undefined
            };
        });
        return { isSuccess: true, data };
    } catch (error) {
        console.error('[getAllCustomers] Error fetching customers:', error);
        return { isSuccess: false, errorText: 'Failed to fetch customers' };
    }
};

export const getCustomerById = async (id: string): Promise<CustomerResponseDTO> => {
    try {
        const customer = await Customer.findById(id);
        if (!customer) return { isSuccess: false, errorText: 'Customer not found' };
        const { _id, name, email, phone, address, leadId } = customer;
        const data = {
            id: _id.toString(),
            name,
            email,
            phone,
            address,
            leadId: leadId ? leadId.toString() : undefined
        };
        return { isSuccess: true, data };
    } catch (error) {
        console.error('[getCustomerById] Error fetching customer:', error);
        return { isSuccess: false, errorText: 'Failed to fetch customer' };
    }
};

export const createCustomer = async (customerData: CustomerDTO): Promise<CustomerResponseDTO> => {
    try {
        const customer = new Customer(customerData);
        const savedCustomer = await customer.save();
        const { _id, name, email, phone, address, leadId } = savedCustomer;
        const data = {
            id: _id.toString(),
            name,
            email,
            phone,
            address,
            leadId: leadId ? leadId.toString() : undefined
        };
        return { isSuccess: true, data };
    } catch (error) {
        console.error('[createCustomer] Error creating customer:', error);
        return { isSuccess: false, errorText: 'Failed to create customer: ' + (error instanceof Error ? error.message : String(error)) };
    }
};

export const updateCustomer = async (id: string, updateData: Partial<CustomerDTO>): Promise<CustomerResponseDTO> => {
    try {
        const updatedCustomer = await Customer.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedCustomer) return { isSuccess: false, errorText: 'Customer not found' };
        const { _id, name, email, phone, address, leadId } = updatedCustomer;
        const data = {
            id: _id.toString(),
            name,
            email,
            phone,
            address,
            leadId: leadId ? leadId.toString() : undefined
        };
        return { isSuccess: true, data };
    } catch (error) {
        console.error('[updateCustomer] Error updating customer:', error);
        return { isSuccess: false, errorText: 'Failed to update customer' };
    }
};

export const deleteCustomer = async (id: string): Promise<CustomerResponseDTO> => {
    try {
        const deletedCustomer = await Customer.findByIdAndDelete(id);
        if (!deletedCustomer) return { isSuccess: false, errorText: 'Customer not found' };
        const { _id, name, email, phone, address, leadId } = deletedCustomer;
        const data = {
            id: _id.toString(),
            name,
            email,
            phone,
            address,
            leadId: leadId ? leadId.toString() : undefined
        };
        return { isSuccess: true, data };
    } catch (error) {
        console.error('[deleteCustomer] Error deleting customer:', error);
        return { isSuccess: false, errorText: 'Failed to delete customer' };
    }
};