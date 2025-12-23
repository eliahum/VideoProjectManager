// MongoDB Shell Script to reset stage templates with new milestone structure
// Run this with: mongosh videoprojectmanager reset-stage-templates.js

db.stagetemplates.deleteMany({});
console.log('Deleted all stage templates');

db.stagetemplates.insertMany([
  {
    id: 1,
    name: 'פרה',
    engName: 'PRE',
    hebName: 'פרה',
    stageNumber: 1,
    milestones: [
      { id: 1, name: 'הצעת מחיר' },
      { id: 2, name: 'תשלום מקדמה' },
      { id: 3, name: 'חשבונית מקדמה' },
      { id: 4, name: 'פגישת אסטרטגיה' },
      { id: 5, name: 'פיצוח קונספטים' },
      { id: 6, name: 'משוב קונספטים' },
      { id: 7, name: 'תסריט' },
      { id: 8, name: 'משוב תסריט' }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 2,
    name: 'פרודקשן',
    engName: 'PRODUCTION',
    hebName: 'פרודקשן',
    stageNumber: 2,
    milestones: [
      { id: 1, name: 'תאום תאריך הפקה' },
      { id: 2, name: 'תאום צילום' },
      { id: 3, name: 'תאום תאורה' },
      { id: 4, name: 'תאום עוזר הפקה' },
      { id: 5, name: 'תאום בימוי' },
      { id: 6, name: 'תאום שחקנים' },
      { id: 7, name: 'תאום לוקיישן' },
      { id: 8, name: 'תאום איפור' },
      { id: 9, name: 'תאום תלבושות' },
      { id: 10, name: 'תאום ארט' },
      { id: 11, name: 'הפקה בפועל' }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 3,
    name: 'פוסט',
    engName: 'POST',
    hebName: 'פוסט',
    stageNumber: 3,
    milestones: [
      { id: 1, name: 'מיון חומר גלם' },
      { id: 2, name: 'עריכה' }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

console.log('Inserted 3 stage templates with new milestone structure');
console.log('Migration completed successfully');
