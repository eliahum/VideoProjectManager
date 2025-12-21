import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Lead, LeadStatus } from '../models/lead.model';
import { Customer } from '../models/customer.model';
import { Supplier } from '../models/supplier.model';
import { Project, ProjectStage, PRE_MILESTONES, PRODUCTION_MILESTONES, POST_MILESTONES, MilestoneStatus } from '../models/project.model';

@Injectable({
  providedIn: 'root'
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const leads: Lead[] = [
      {
        id: 1,
        name: 'יוסי כהן',
        phone: '050-1234567',
        email: 'yossi@example.com',
        source: 'פייסבוק',
        freeText: 'לקוח פוטנציאלי',
        companyName: 'חברת כהן בע"מ',
        contactDate: new Date('2024-01-15'),
        status: LeadStatus.NEW,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15')
      },
      {
        id: 2,
        name: 'רחל לוי',
        phone: '052-9876543',
        email: 'rachel@example.com',
        source: 'המלצה',
        freeText: 'סרטון פרסום',
        companyName: 'לוי תקשורת',
        contactDate: new Date('2024-01-20'),
        status: LeadStatus.QUOTE,
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-01-22')
      }
    ];

    const customers: Customer[] = [
      {
        id: 1,
        name: 'דוד ישראלי',
        phone: '053-1112222',
        email: 'david@example.com',
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-10')
      }
    ];

    const suppliers: Supplier[] = [
      {
        id: '1',
        name: 'צלם מקצועי',
        phone: '054-3334444',
        email: 'photographer@example.com',
        accountDetails: 'בנק לאומי 12-345-67890',
        isPaid: false,
        notes: '',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      },
      {
        id: '2',
        name: 'עורך וידאו',
        phone: '055-5556666',
        email: 'editor@example.com',
        accountDetails: 'בנק דיסקונט 11-222-33444',
        isPaid: true,
        notes: '',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-05')
      }
    ];

    const projects: Project[] = [
      {
        id: '1',
        customerId: '1',
        customerName: 'דוד ישראלי',
        projectType: 'וידאו פרסומי',
        currentStage: ProjectStage.PRE,
        stages: [
          {
            name: ProjectStage.PRE,
            milestones: PRE_MILESTONES.map((name, index) => ({
              id: `1-pre-${index}`,
              name,
              documentReference: '',
              status: MilestoneStatus.BEFORE_START,
              suppliers: []
            }))
          },
          {
            name: ProjectStage.PRODUCTION,
            milestones: PRODUCTION_MILESTONES.map((name, index) => ({
              id: `1-prod-${index}`,
              name,
              documentReference: '',
              status: MilestoneStatus.BEFORE_START,
              suppliers: []
            }))
          },
          {
            name: ProjectStage.POST,
            milestones: POST_MILESTONES.map((name, index) => ({
              id: `1-post-${index}`,
              name,
              documentReference: '',
              status: MilestoneStatus.BEFORE_START,
              suppliers: []
            }))
          }
        ],
        createdAt: new Date('2024-01-25'),
        updatedAt: new Date('2024-01-25')
      }
    ];

    return { leads, customers, suppliers, projects };
  }

  // מזהה אוטומטי לרשומות חדשות
  genId<T extends { id: string }>(collection: T[]): string {
    return collection.length > 0 
      ? (Math.max(...collection.map(item => parseInt(item.id) || 0)) + 1).toString()
      : '1';
  }
}
