/**
 * Backup Routes - API endpoints for backup management
 */

import { Router, Request, Response } from 'express';
import { BackupService } from '../services/backupService';
import { authenticate, authorize } from '../middleware/auth.middleware';
import multer from 'multer';

const router = Router();
const backupService = new BackupService();

// Configure multer for file uploads (in-memory storage)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max file size
  },
  fileFilter: (req, file, cb) => {
    if (file.originalname.endsWith('.json') && file.originalname.startsWith('backup-')) {
      cb(null, true);
    } else {
      cb(new Error('Only backup JSON files are allowed'));
    }
  }
});

// Apply authentication and superadmin authorization to all routes
router.use(authenticate, authorize('superadmin'));

/**
 * POST /api/backups/create
 * Create a new backup
 */
router.post('/create', async (req: Request, res: Response) => {
  try {
    console.log('📥 Received backup creation request');
    
    const backupInfo = await backupService.createBackup();
    
    res.status(200).json({
      success: true,
      message: 'הגיבוי נוצר בהצלחה',
      backup: backupInfo
    });
  } catch (error: any) {
    console.error('Error creating backup:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'שגיאה ביצירת גיבוי',
      error: error.toString()
    });
  }
});

/**
 * GET /api/backups/history
 * Get backup history
 */
router.get('/history', async (req: Request, res: Response) => {
  try {
    const backups = await backupService.getBackupHistory();
    
    res.status(200).json({
      success: true,
      backups
    });
  } catch (error: any) {
    console.error('Error getting backup history:', error);
    res.status(500).json({
      success: false,
      message: 'שגיאה בקבלת היסטוריית גיבויים',
      backups: []
    });
  }
});

/**
 * GET /api/backups/last
 * Get the last backup info
 */
router.get('/last', async (req: Request, res: Response) => {
  try {
    const lastBackup = await backupService.getLastBackup();
    
    res.status(200).json(lastBackup);
  } catch (error: any) {
    console.error('Error getting last backup:', error);
    res.status(500).json(null);
  }
});

/**
 * GET /api/backups/download/:filename
 * Download a specific backup file from Google Drive or local storage
 */
router.get('/download/:filename', async (req: Request, res: Response) => {
  try {
    const { filename } = req.params;
    
    console.log(`📥 Download request for: ${filename}`);
    
    // Download file from cloud or local storage
    const fileBuffer = await backupService.downloadBackupFile(filename);
    
    // Set headers for download
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', fileBuffer.length);
    
    // Send the file
    res.send(fileBuffer);
    console.log(`✅ File sent: ${filename}`);
  } catch (error: any) {
    console.error('Error downloading backup:', error);
    res.status(404).json({
      success: false,
      message: error.message || 'קובץ הגיבוי לא נמצא'
    });
  }
});

/**
 * GET /api/backups/schedule
 * Get backup schedule information
 */
router.get('/schedule', async (req: Request, res: Response) => {
  try {
    const scheduleInfo = backupService.getScheduleInfo();
    res.status(200).json(scheduleInfo);
  } catch (error: any) {
    console.error('Error getting schedule info:', error);
    res.status(500).json({
      enabled: false,
      cronExpression: '',
      timezone: 'UTC',
      description: 'שגיאה בקבלת מידע על לוח הזמנים'
    });
  }
});

/**
 * POST /api/backups/restore
 * Restore database from uploaded backup file
 */
router.post('/restore', upload.single('backupFile'), async (req: Request, res: Response) => {
  try {
    console.log('📥 Received restore request');
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'לא הועלה קובץ גיבוי'
      });
    }

    // Parse JSON from uploaded file
    const backupData = JSON.parse(req.file.buffer.toString('utf-8'));
    
    // Validate backup data structure
    if (!backupData.timestamp || !backupData.collections) {
      return res.status(400).json({
        success: false,
        message: 'מבנה קובץ הגיבוי לא תקין'
      });
    }

    console.log(`📦 Restoring backup from: ${backupData.timestamp}`);
    
    // Restore the backup
    await backupService.restoreBackup(backupData);
    
    res.status(200).json({
      success: true,
      message: 'הגיבוי שוחזר בהצלחה',
      restoredFrom: backupData.timestamp
    });
  } catch (error: any) {
    console.error('Error restoring backup:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'שגיאה בשחזור הגיבוי',
      error: error.toString()
    });
  }
});

export default router;
