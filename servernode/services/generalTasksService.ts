import GeneralTask from '../models/general-task.model';
import { GeneralTaskDto } from '../dtos/general-task.dto';
import { BaseDataResponseDTO } from '../dtos/base-response.dto';

export const getAllGeneralTasks = async (): Promise<BaseDataResponseDTO<GeneralTaskDto[]>> => {
    try {
        const tasks = await GeneralTask.find().sort({ taskNumber: -1 });
        const data = tasks.map((task) => ({
            _id: task._id.toString(),
            taskNumber: task.taskNumber,
            name: task.name,
            statusNumber: task.statusNumber,
            date: task.date,
            notes: task.notes,
            createdAt: task.createdAt,
            updatedAt: task.updatedAt
        }));
        return { isSuccess: true, data };
    } catch (error) {
        console.error('[getAllGeneralTasks] Error fetching tasks:', error);
        return { isSuccess: false, errorText: 'Failed to fetch general tasks' };
    }
};

export const getGeneralTaskById = async (id: string): Promise<BaseDataResponseDTO<GeneralTaskDto>> => {
    try {
        const task = await GeneralTask.findById(id);
        if (!task) return { isSuccess: false, errorText: 'General task not found' };
        
        const data: GeneralTaskDto = {
            _id: task._id.toString(),
            taskNumber: task.taskNumber,
            name: task.name,
            statusNumber: task.statusNumber,
            date: task.date,
            notes: task.notes,
            createdAt: task.createdAt,
            updatedAt: task.updatedAt
        };
        return { isSuccess: true, data };
    } catch (error) {
        console.error('[getGeneralTaskById] Error fetching task:', error);
        return { isSuccess: false, errorText: 'Failed to fetch general task' };
    }
};

export const createGeneralTask = async (taskData: Partial<GeneralTaskDto>): Promise<BaseDataResponseDTO<GeneralTaskDto>> => {
    try {
        const task = new GeneralTask(taskData);
        const savedTask = await task.save();
        
        const data: GeneralTaskDto = {
            _id: savedTask._id.toString(),
            taskNumber: savedTask.taskNumber,
            name: savedTask.name,
            statusNumber: savedTask.statusNumber,
            date: savedTask.date,
            notes: savedTask.notes,
            createdAt: savedTask.createdAt,
            updatedAt: savedTask.updatedAt
        };
        return { isSuccess: true, data };
    } catch (error) {
        console.error('[createGeneralTask] Error creating task:', error);
        return { isSuccess: false, errorText: 'Failed to create general task' };
    }
};

export const updateGeneralTask = async (id: string, updateData: Partial<GeneralTaskDto>): Promise<BaseDataResponseDTO<GeneralTaskDto>> => {
    try {
        const updatedTask = await GeneralTask.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedTask) return { isSuccess: false, errorText: 'General task not found' };
        
        const data: GeneralTaskDto = {
            _id: updatedTask._id.toString(),
            taskNumber: updatedTask.taskNumber,
            name: updatedTask.name,
            statusNumber: updatedTask.statusNumber,
            date: updatedTask.date,
            notes: updatedTask.notes,
            createdAt: updatedTask.createdAt,
            updatedAt: updatedTask.updatedAt
        };
        return { isSuccess: true, data };
    } catch (error) {
        console.error('[updateGeneralTask] Error updating task:', error);
        return { isSuccess: false, errorText: 'Failed to update general task' };
    }
};

export const deleteGeneralTask = async (id: string): Promise<BaseDataResponseDTO<GeneralTaskDto>> => {
    try {
        const deletedTask = await GeneralTask.findByIdAndDelete(id);
        if (!deletedTask) return { isSuccess: false, errorText: 'General task not found' };
        
        const data: GeneralTaskDto = {
            _id: deletedTask._id.toString(),
            taskNumber: deletedTask.taskNumber,
            name: deletedTask.name,
            statusNumber: deletedTask.statusNumber,
            date: deletedTask.date,
            notes: deletedTask.notes,
            createdAt: deletedTask.createdAt,
            updatedAt: deletedTask.updatedAt
        };
        return { isSuccess: true, data };
    } catch (error) {
        console.error('[deleteGeneralTask] Error deleting task:', error);
        return { isSuccess: false, errorText: 'Failed to delete general task' };
    }
};

export default {
    getAllGeneralTasks,
    getGeneralTaskById,
    createGeneralTask,
    updateGeneralTask,
    deleteGeneralTask
};
