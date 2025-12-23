// MongoDB Script to initialize Supplier Types
// Run with: mongosh <database-name> init-supplier-types.js
// Or copy-paste into mongosh console

// Check if collection is empty
const count = db.suppliertypes.countDocuments();
print(`Current supplier types count: ${count}`);

if (count === 0) {
  print('Inserting supplier types...');
  
  // Get current counter or start from 0
  let counter = db.counters.findOne({ _id: 'supplierTypeNumber' });
  let startSeq = counter ? counter.seq : 0;
  
  // Supplier types to insert
  const supplierTypesData = [
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
  
  // Prepare documents with auto-increment numbers
  const supplierTypes = supplierTypesData.map((type, index) => ({
    supplierTypeNumber: startSeq + index + 1,
    name: type.name,
    description: type.description,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }));
  
  // Insert all at once
  const result = db.suppliertypes.insertMany(supplierTypes);
  
  // Update counter
  db.counters.updateOne(
    { _id: 'supplierTypeNumber' },
    { $set: { seq: startSeq + supplierTypes.length } },
    { upsert: true }
  );
  
  print(`✅ Successfully inserted ${result.insertedIds.length} supplier types`);
  supplierTypes.forEach(type => {
    print(`  ✓ ${type.name} (${type.supplierTypeNumber})`);
  });
} else {
  print('⚠️  Supplier types already exist. Skipping initialization.');
  print('Existing types:');
  db.suppliertypes.find({}, { name: 1, supplierTypeNumber: 1 }).sort({ supplierTypeNumber: 1 }).forEach((type) => {
    print(`  - ${type.name} (${type.supplierTypeNumber})`);
  });
}

print('\n📊 Final count: ' + db.suppliertypes.countDocuments());
