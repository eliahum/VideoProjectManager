// Copy and paste this directly into mongosh

// Switch to your database (change name if needed)
use videoprojectmanager

// Check if supplier types already exist
db.suppliertypes.countDocuments()

// If empty, insert the supplier types:
db.suppliertypes.insertMany([
  {
    supplierTypeNumber: 1,
    name: 'צילום',
    description: 'צלמי וידאו ותמונה',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    supplierTypeNumber: 2,
    name: 'תאורה',
    description: 'אנשי תאורה וציוד תאורה',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    supplierTypeNumber: 3,
    name: 'קרינות',
    description: 'מפעילי מנוף ומערכות קרינות',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    supplierTypeNumber: 4,
    name: 'ארט',
    description: 'עיצוב אמנותי וסט',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    supplierTypeNumber: 5,
    name: 'איפור',
    description: 'מאפרים וסטייליסטים',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    supplierTypeNumber: 6,
    name: 'תסריט',
    description: 'כותבי תסריטים',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    supplierTypeNumber: 7,
    name: 'בימוי',
    description: 'במאים ועוזרי במאי',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    supplierTypeNumber: 8,
    name: 'אפטר',
    description: 'אפקטים ויזואליים ואפטר',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    supplierTypeNumber: 9,
    name: 'עריכה',
    description: 'עורכי וידאו',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    supplierTypeNumber: 10,
    name: 'תלבושות',
    description: 'מעצבי תלבושות',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    supplierTypeNumber: 11,
    name: 'מוזיקה',
    description: 'מלחינים והנדסת סאונד',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
])

// Update the counter
db.counters.updateOne(
  { _id: 'supplierTypeNumber' },
  { $set: { seq: 11 } },
  { upsert: true }
)

// Verify insertion
db.suppliertypes.find().sort({ supplierTypeNumber: 1 })
