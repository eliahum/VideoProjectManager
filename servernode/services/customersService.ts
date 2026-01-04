import Customer from '../models/customer.model';
import { Project, IProject, IStage } from '../models/project.model';
import ProjectStatus from '../models/project-status.model';
import { CustomerDTO, CustomerResponseDTO, CustomersListResponseDTO, ProjectSummaryDTO } from '../dtos/customer.dto';

export const getAllCustomers = async (): Promise<CustomersListResponseDTO> => {
    try {
        const customers = await Customer.find();
        const allProjects = await Project.find();
        const allStatuses = await ProjectStatus.find();
        
        const data = customers.map((customer) => {
            const { _id, customerId, name, companyName, email, phone, address, leadId, howFoundUs, notes } = customer;
            
            // Find all projects for this customer
            const customerProjects = allProjects.filter((project: IProject) => 
                project.customerId.toString() === customer._id.toString()
            );
            
            // Map projects to summary format
            const projectsSummary: ProjectSummaryDTO[] = customerProjects.map((project: IProject) => {
                const currentStage = project.stages?.find((s: IStage) => s.stageNumber === project.currentStageNumber);
                const projectStatus = allStatuses.find(status => status.statusNumber === project.statusNumber);
                return {
                    id: project._id.toString(),
                    projectNumber: project.projectNumber,
                    projectName: project.projectName,
                    statusNumber: project.statusNumber,
                    projectId: project.id,
                    statusName: projectStatus?.name || 'לא ידוע',
                    currentStage: currentStage?.stageName || 'לא מוגדר',
                    createdAt: project.createdAt,
                    paidAmount: project.paidAmount,
                    paymentDate: project.paymentDate,
                    paymentNote: project.paymentNote
                };
            });

            return {
                id: _id.toString(),
                customerId,
                name,
                companyName,
                email,
                phone,
                address,
                leadId,
                howFoundUs,
                notes,
                projects: projectsSummary
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
        
        const { _id, customerId, name, companyName, email, phone, address, leadId, howFoundUs, notes } = customer;
        
        // Find all projects for this customer
        const customerProjects = await Project.find({ customerId: customer._id });
        const allStatuses = await ProjectStatus.find();
        
        // Map projects to summary format
        const projectsSummary: ProjectSummaryDTO[] = customerProjects.map((project: IProject) => {
            const currentStage = project.stages?.find((s: IStage) => s.stageNumber === project.currentStageNumber);
            const projectStatus = allStatuses.find(status => status.statusNumber === project.statusNumber);
            return {
                id: project._id.toString(),
                projectNumber: project.projectNumber,
                projectName: project.projectName,
                statusNumber: project.statusNumber,
                statusName: projectStatus?.name || 'לא ידוע',
                currentStage: currentStage?.stageName || 'לא מוגדר',
                createdAt: project.createdAt,
                paidAmount: project.paidAmount,
                paymentDate: project.paymentDate,
                paymentNote: project.paymentNote
            };
        });
        
        const data = {
            id: _id.toString(),
            customerId,
            name,
            companyName,
            email,
            phone,
            address,
            leadId,
            howFoundUs,
            notes,
            projects: projectsSummary
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
        const { _id, customerId, name, companyName, email, phone, address, leadId, howFoundUs, notes } = savedCustomer;
        const data = {
            id: _id.toString(),
            customerId,
            name,
            companyName,
            email,
            phone,
            address,
            leadId,
            howFoundUs,
            notes
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
        const { _id, customerId, name, companyName, email, phone, address, leadId, howFoundUs, notes } = updatedCustomer;
        const data = {
            id: _id.toString(),
            customerId,
            name,
            companyName,
            email,
            phone,
            address,
            leadId,
            howFoundUs,
            notes
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
        const { _id, customerId, name, companyName, email, phone, address, leadId, howFoundUs, notes } = deletedCustomer;
        const data = {
            id: _id.toString(),
            customerId,
            name,
            companyName,
            email,
            phone,
            address,
            leadId,
            howFoundUs,
            notes
        };
        return { isSuccess: true, data };
    } catch (error) {
        console.error('[deleteCustomer] Error deleting customer:', error);
        return { isSuccess: false, errorText: 'Failed to delete customer' };
    }
};