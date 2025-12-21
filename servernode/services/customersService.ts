import Customer from '../models/customer.model';
import { CustomerDTO } from '../dtos/customer.dto';

export const getAllCustomers = async (): Promise<CustomerDTO[]> => {
    const customers = await Customer.find();
    return customers.map((customer) => {
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
};

export const getCustomerById = async (id: string): Promise<CustomerDTO | null> => {
    const customer = await Customer.findById(id);
    if (!customer) return null;
    const { _id, name, email, phone, address, leadId } = customer;
    return {
        id: _id.toString(),
        name,
        email,
        phone,
        address,
        leadId: leadId ? leadId.toString() : undefined
    };
};

export const createCustomer = async (data: CustomerDTO): Promise<CustomerDTO> => {
    try {
        const customer = new Customer(data);
        const savedCustomer = await customer.save();
        const { _id, name, email, phone, address, leadId } = savedCustomer;
        return {
            id: _id.toString(),
            name,
            email,
            phone,
            address,
            leadId: leadId ? leadId.toString() : undefined
        };
    } catch (error) {
        // You can customize the error handling as needed
        throw new Error('Failed to create customer: ' + error.message + (error instanceof Error ? error.message : String(error)));
    }
};

export const updateCustomer = async (id: string, data: Partial<CustomerDTO>): Promise<CustomerDTO | null> => {
    const updatedCustomer = await Customer.findByIdAndUpdate(id, data, { new: true });
    if (!updatedCustomer) return null;
    const { _id, name, email, phone, address, leadId } = updatedCustomer;
    return {
        id: _id.toString(),
        name,
        email,
        phone,
        address,
        leadId: leadId ? leadId.toString() : undefined
    };
};

export const deleteCustomer = async (id: string): Promise<CustomerDTO | null> => {
    const deletedCustomer = await Customer.findByIdAndDelete(id);
    if (!deletedCustomer) return null;
    const { _id, name, email, phone, address, leadId } = deletedCustomer;
    return {
        id: _id.toString(),
        name,
        email,
        phone,
        address,
        leadId: leadId ? leadId.toString() : undefined
    };
};