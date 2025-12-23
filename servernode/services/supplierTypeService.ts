import SupplierType, { SupplierTypeDocument } from '../models/supplier-type.model';
import { SupplierTypeDTO } from '../dtos/supplier-type.dto';

class SupplierTypeService {
  // Convert SupplierTypeDocument to SupplierTypeDTO
  private toDTO(doc: SupplierTypeDocument): SupplierTypeDTO {
    return {
      id: doc._id.toString(),
      supplierTypeNumber: doc.supplierTypeNumber,
      name: doc.name,
      description: doc.description,
      isActive: doc.isActive,
      createdAt: doc.createdAt!,
      updatedAt: doc.updatedAt!
    };
  }

  // Get all supplier types
  async getAll(): Promise<SupplierTypeDTO[]> {
    const supplierTypes = await SupplierType.find().sort({ name: 1 });
    return supplierTypes.map(st => this.toDTO(st));
  }

  // Get active supplier types only
  async getActive(): Promise<SupplierTypeDTO[]> {
    const supplierTypes = await SupplierType.find({ isActive: true }).sort({ name: 1 });
    return supplierTypes.map(st => this.toDTO(st));
  }

  // Get supplier type by ID
  async getById(id: string): Promise<SupplierTypeDTO | null> {
    const supplierType = await SupplierType.findById(id);
    return supplierType ? this.toDTO(supplierType) : null;
  }

  // Create a new supplier type
  async create(data: { name: string; description?: string; isActive?: boolean }): Promise<SupplierTypeDTO> {
    const supplierType = new SupplierType(data);
    await supplierType.save();
    return this.toDTO(supplierType);
  }

  // Update supplier type
  async update(id: string, data: { name?: string; description?: string; isActive?: boolean }): Promise<SupplierTypeDTO | null> {
    const supplierType = await SupplierType.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    );
    return supplierType ? this.toDTO(supplierType) : null;
  }

  // Delete supplier type
  async delete(id: string): Promise<boolean> {
    const result = await SupplierType.findByIdAndDelete(id);
    return !!result;
  }

  // Initialize default supplier types
  async initializeDefaults(): Promise<void> {
    const count = await SupplierType.countDocuments();
    if (count === 0) {
      const defaultTypes = [
        { name: 'צילום', description: 'צלמי וידאו ותמונה' },
        { name: 'תאורה', description: 'אנשי תאורה וציוד תאורה' },
        { name: 'קרינות', description: 'מפעילי מנוף ומערכות קרינות' },
        { name: 'ארט', description: 'עיצוב אמנותי וסט' },
        { name: 'איפור', description: 'מאפרים וסטייליסטים' },
        { name: 'תסריט', description: 'כותבי תסריטים' },
        { name: 'בימוי', description: 'במאים ועוזרי במאי' },
        { name: 'אפטר', description: 'אפקטים ויזואליים ואפטר' },
        { name: 'עריכה', description: 'עורכי וידאו' },
        { name: 'תלבושות', description: 'מעצבי תלבושות' },
        { name: 'מוזיקה', description: 'מלחינים והנדסת סאונד' }
      ];

      for (const type of defaultTypes) {
        const supplierType = new SupplierType(type);
        await supplierType.save();
      }
      console.log('Default supplier types initialized successfully');
    }
  }
}

export default new SupplierTypeService();
