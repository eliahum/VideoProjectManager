# MongoDB Backup & Restore Guide

## גיבוי המסד נתונים

### גיבוי ידני
```bash
cd servernode
npx ts-node scripts/backup-db.ts
```

הגיבוי יישמר כ: `servernode/backups/backup-[timestamp].json`

### מה הסקריפט עושה:
- ✅ יוצר תיקיית backups אם לא קיימת
- ✅ מבצע גיבוי מלא של כל ה-collections ב-MongoDB
- ✅ שומר כקובץ JSON עם חותמת זמן
- ✅ מציג רשימת גיבויים קיימים עם גודל
- ✅ מוחק אוטומטית גיבויים ישנים (שומר רק 10 אחרונים)
- ✅ לא דורש התקנת כלים חיצוניים (mongodump)

---

## שחזור מגיבוי

### 1. ראה רשימת גיבויים זמינים:
```bash
npx ts-node scripts/restore-db.ts
```

פלט לדוגמה:
```
Available backups:
  1. backup-2025-12-29T18-15-23.json (245.67 KB)
  2. backup-2025-12-29T14-30-00.json (243.12 KB)
  3. backup-2025-12-28T10-00-00.json (240.89 KB)
```

### 2. שחזר גיבוי ספציפי:
```bash
npx ts-node scripts/restore-db.ts backup-2025-12-29T18-15-23.json
```

⚠️ **אזהרה:** שחזור ידרוס את כל הנתונים הנוכחיים!

---

## גיבוי אוטומטי (אופציונלי)

### Windows - Task Scheduler
1. פתח Task Scheduler
2. Create Basic Task
3. Trigger: Daily at 2:00 AM
4. Action: Start a program
   - Program: `powershell`
   - Arguments: `-Command "cd C:\projects\VideoProjectManager\servernode; npx ts-node scripts/backup-db.ts"`

### Linux/Mac - Cron Job
```bash
# Edit crontab
crontab -e

# Add this line (backup every day at 2 AM)
0 2 * * * cd /path/to/VideoProjectManager/servernode && npx ts-node scripts/backup-db.ts
```

---

## פורמט הגיבוי

הגיבוי נשמר כקובץ JSON עם המבנה הבא:

```json
{
  "timestamp": "2025-12-29T18:15:23.456Z",
  "database": "videoprojectmanager",
  "collections": {
    "users": [ /* array of user documents */ ],
    "projects": [ /* array of project documents */ ],
    "customers": [ /* array of customer documents */ ],
    "leads": [ /* array of lead documents */ ],
    "suppliers": [ /* array of supplier documents */ ]
  }
}
```

**יתרונות פורמט JSON:**
- ✅ קריא לאדם - אפשר לפתוח ולעיין
- ✅ ניתן לעריכה ידנית במקרה הצורך
- ✅ קל לגרסה ושליחה (Git, Email, Cloud)
- ✅ עובד על כל פלטפורמה ללא התקנות נוספות

---

## מיקום הגיבויים

```
servernode/
├── backups/
│   ├── backup-2025-12-29T18-15-23.json
│   ├── backup-2025-12-29T14-30-00.json
│   └── backup-2025-12-28T10-00-00.json
└── scripts/
    ├── backup-db.ts
    └── restore-db.ts
```

---

## טיפים

### 1. גיבוי לפני עדכונים חשובים
```bash
cd servernode
npx ts-node scripts/backup-db.ts
```

### 2. גיבוי ידני מהיר
הוסף לפרופיל PowerShell (או .bashrc):
```bash
# Windows PowerShell
function Backup-MongoDB {
    cd C:\projects\VideoProjectManager\servernode
    npx ts-node scripts\backup-db.ts
}

# Linux/Mac Bash
alias backup-db="cd /path/to/servernode && npx ts-node scripts/backup-db.ts"
```

### 3. העתקת גיבויים לענן
```bash
# העתק ידנית ל-Google Drive, OneDrive, Dropbox
cp backups/*.json ~/GoogleDrive/VideoProjectManager-Backups/

# או השתמש ב-rclone לסנכרון אוטומטי
rclone sync backups/ gdrive:VideoProjectManager-Backups/
```

### 4. בדיקת גיבוי (Test Restore)
מומלץ לבדוק מעת לעת שהגיבוי תקין:
```bash
# 1. גיבוי ה-DB הנוכחי
npx ts-node scripts/backup-db.ts

# 2. שחזר גיבוי ישן (לבדיקה)
npx ts-node scripts/restore-db.ts backup-2025-12-28T10-00-00.json

# 3. אם הכל עובד, שחזר את הגיבוי האחרון
npx ts-node scripts/restore-db.ts backup-2025-12-29T18-15-23.json
```

### 5. גיבוי לפני deployment
הוסף ל-CI/CD pipeline:
```yaml
# GitHub Actions example
- name: Backup Database
  run: |
    cd servernode
    npx ts-node scripts/backup-db.ts
```

---

## שאלות נפוצות

**ש: כמה מקום תופס גיבוי?**  
ת: בדרך כלל 200-500 KB לפרויקט קטן-בינוני. תלוי בכמות הנתונים.

**ש: האם הגיבוי כולל סיסמאות מוצפנות?**  
ת: כן, הגיבוי מכיל את כל הנתונים כולל סיסמאות מוצפנות. שמור את קבצי הגיבוי במקום מאובטח!

**ש: האם אפשר לשחזר רק collection אחד?**  
ת: ניתן לערוך את קובץ ה-JSON ידנית ולמחוק collections שלא צריך לשחזר.

**ש: מה קורה אם הסקריפט נכשל באמצע?**  
ת: הסקריפט יציג שגיאה. הנתונים בDB לא ישתנו עד להשלמה מוצלחת.

---

## Troubleshooting

### שגיאה: "Cannot connect to MongoDB"
```bash
# בדוק ש-MongoDB רץ
# Windows:
services.msc  # חפש MongoDB

# Linux/Mac:
sudo systemctl status mongod
```

### שגיאה: "Permission denied" בתיקיית backups
```bash
# תן הרשאות לתיקייה
chmod -R 755 backups/
```

### הגיבוי לא נוצר
```bash
# בדוק שיש מספיק מקום בדיסק
df -h  # Linux/Mac
Get-PSDrive  # Windows PowerShell
```
