import mongoose from 'mongoose';
import { Project } from '../models/project.model';
import Customer from '../models/customer.model';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function migrateProjects() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/videoManager';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Get all projects
    const projects = await Project.find();
    console.log(`Found ${projects.length} projects to migrate`);

    // Get all customers
    const customers = await Customer.find();
    console.log(`Found ${customers.length} customers`);

    let updated = 0;
    let skipped = 0;

    for (const project of projects) {
      // Skip if already has customerId
      if (project.customerId !== undefined && project.customerId !== null) {
        console.log(`Project ${project.projectNumber} already has customerId: ${project.customerId}`);
        skipped++;
        continue;
      }

      // For now, assign the first customer's ID as default
      // In production, you might want to handle this differently
      if (customers.length > 0) {
        project.customerId = customers[0].customerId;
        await project.save();
        console.log(`Updated project ${project.projectNumber} with customerId: ${customers[0].customerId} (${customers[0].name})`);
        updated++;
      } else {
        console.log(`No customers found - cannot update project ${project.projectNumber}`);
      }
    }

    console.log(`\nMigration complete:`);
    console.log(`- Updated: ${updated} projects`);
    console.log(`- Skipped: ${skipped} projects (already had customerId)`);
    console.log(`- Total: ${projects.length} projects`);

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrateProjects();
