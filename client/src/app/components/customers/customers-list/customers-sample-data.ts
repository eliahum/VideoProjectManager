// Sample data for customers with projects
export const SAMPLE_CUSTOMERS_WITH_PROJECTS = [
  {
    id: '1',
    customerId: 1001,
    name: 'אולפני שחר בע"מ',
    email: 'office@shachar-studios.co.il',
    phone: '054-1234567',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-12-20'),
    projects: [
      {
        projectNumber: 5001,
        projectName: 'סרטון תדמית חברה',
        statusNumber: 2,
        statusName: 'בעבודה',
        currentStage: 'עריכה',
        createdAt: new Date('2024-11-01')
      },
      {
        projectNumber: 5002,
        projectName: 'קליפ לרשתות חברתיות',
        statusNumber: 3,
        statusName: 'הושלם',
        currentStage: 'הושלם',
        createdAt: new Date('2024-10-15')
      },
      {
        projectNumber: 5003,
        projectName: 'כתבה תדמית',
        statusNumber: 1,
        statusName: 'תכנון',
        currentStage: 'פגישה ראשונית',
        createdAt: new Date('2024-12-10')
      }
    ]
  },
  {
    id: '2',
    customerId: 1002,
    name: 'חברת הייטק אלפא',
    email: 'marketing@alpha-tech.com',
    phone: '052-9876543',
    createdAt: new Date('2024-03-20'),
    updatedAt: new Date('2024-12-18'),
    projects: [
      {
        projectNumber: 5004,
        projectName: 'סרטון השקת מוצר חדש',
        statusNumber: 2,
        statusName: 'בעבודה',
        currentStage: 'צילומים',
        createdAt: new Date('2024-11-20')
      },
      {
        projectNumber: 5005,
        projectName: 'ראיונות עם לקוחות',
        statusNumber: 1,
        statusName: 'תכנון',
        currentStage: 'כתיבת תסריט',
        createdAt: new Date('2024-12-01')
      }
    ]
  },
  {
    id: '3',
    customerId: 1003,
    name: 'מלון ים המלח ריזורט',
    email: 'info@deadsea-resort.co.il',
    phone: '050-5555555',
    createdAt: new Date('2024-05-10'),
    updatedAt: new Date('2024-12-25'),
    projects: [
      {
        projectNumber: 5006,
        projectName: 'סרטון פרסומי למלון',
        statusNumber: 3,
        statusName: 'הושלם',
        currentStage: 'הושלם',
        createdAt: new Date('2024-09-01')
      }
    ]
  },
  {
    id: '4',
    customerId: 1004,
    name: 'רשת בתי ספר קשת',
    email: 'media@keshet-schools.org.il',
    phone: '054-7777777',
    createdAt: new Date('2024-06-15'),
    updatedAt: new Date('2024-12-22'),
    projects: [
      {
        projectNumber: 5007,
        projectName: 'סרטון גיוס תלמידים',
        statusNumber: 2,
        statusName: 'בעבודה',
        currentStage: 'פוסט-פרודקשן',
        createdAt: new Date('2024-11-10')
      },
      {
        projectNumber: 5008,
        projectName: 'כתבה על טקס סיום',
        statusNumber: 3,
        statusName: 'הושלם',
        currentStage: 'הושלם',
        createdAt: new Date('2024-07-01')
      },
      {
        projectNumber: 5009,
        projectName: 'סדרת סרטונים לערוצים דיגיטליים',
        statusNumber: 1,
        statusName: 'תכנון',
        currentStage: 'מחקר ופיתוח',
        createdAt: new Date('2024-12-15')
      }
    ]
  },
  {
    id: '5',
    customerId: 1005,
    name: 'עיריית תל אביב',
    email: 'video@tel-aviv.gov.il',
    phone: '03-1234567',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-12-24'),
    projects: [
      {
        projectNumber: 5010,
        projectName: 'תיעוד פעילות עירונית',
        statusNumber: 2,
        statusName: 'בעבודה',
        currentStage: 'עריכה',
        createdAt: new Date('2024-10-20')
      }
    ]
  }
];
