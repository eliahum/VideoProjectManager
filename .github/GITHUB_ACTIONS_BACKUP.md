# GitHub Actions - MongoDB Backup

## מה זה עושה?

GitHub Action אוטומטי שמבצע גיבוי של MongoDB כל יום ב-2:00 בלילה (UTC).

## הגדרה ראשונית

### 1. הוסף את ה-MongoDB URL ל-GitHub Secrets

1. לך ל: `https://github.com/eliahum/VideoProjectManager/settings/secrets/actions`
2. לחץ על **"New repository secret"**
3. הוסף:
   - **Name:** `MONGODB_URL`
   - **Value:** המחרוזת חיבור שלך (לדוגמה: `mongodb+srv://user:password@cluster.mongodb.net/videoprojectmanager`)
4. לחץ **"Add secret"**

### 2. Commit & Push

```bash
git add .github/workflows/backup.yml
git commit -m "Add automated MongoDB backup workflow"
git push
```

---

## איך להשתמש

### הרצה אוטומטית
- רץ אוטומטית כל יום ב-**2:00 AM UTC** (4:00 בבוקר שעון ישראל)

### הרצה ידנית
1. לך ל: `https://github.com/eliahum/VideoProjectManager/actions`
2. בחר **"MongoDB Backup"** מהרשימה
3. לחץ **"Run workflow"** > **"Run workflow"**

---

## היכן הגיבויים?

הגיבויים נשמרים ב-**GitHub Artifacts**:

1. לך ל: `https://github.com/eliahum/VideoProjectManager/actions`
2. לחץ על run של **"MongoDB Backup"**
3. למטה תראה **"Artifacts"**
4. הורד את הקובץ: `mongodb-backup-[run-number]`

**שימו לב:** GitHub שומר artifacts ל-**90 יום** בלבד.

---

## לוגים ומעקב

### ראה סטטוס הרצה אחרונה:
```
https://github.com/eliahum/VideoProjectManager/actions/workflows/backup.yml
```

### בדוק אם הרצה נכשלה:
תקבל email אם יש כשל (אפשר להגדיר ב-GitHub notifications).

---

## איך לשחזר מגיבוי שב-GitHub?

1. הורד את הגיבוי מ-GitHub Artifacts
2. העתק לתיקיית `servernode/backups/`
3. הרץ:
```bash
cd servernode
npx ts-node scripts/restore-db.ts backup-2025-12-29T18-15-23.json
```

---

## התאמה אישית

### שינוי זמן הגיבוי
ערוך את `.github/workflows/backup.yml`:

```yaml
schedule:
  - cron: '0 2 * * *'  # 2:00 AM UTC כל יום
  # דוגמאות:
  # - cron: '0 */6 * * *'  # כל 6 שעות
  # - cron: '0 0 * * 0'    # כל יום ראשון בחצות
  # - cron: '0 3 * * 1-5'  # ימי חול ב-3 בבוקר
```

[כלי ליצירת cron expressions](https://crontab.guru/)

### שינוי תקופת שמירה
ערוך את `retention-days`:

```yaml
- name: Upload backup as artifact
  uses: actions/upload-artifact@v4
  with:
    retention-days: 90  # שנה ל-30, 60, 90 וכו'
```

---

## העלאה אוטומטית לענן (מתקדם)

### Google Drive
הוסף צעד נוסף:

```yaml
- name: Upload to Google Drive
  uses: adityak74/google-drive-upload-git-action@main
  with:
    credentials: ${{ secrets.DRIVE_CREDENTIALS }}
    filename: servernode/backups/${{ steps.backup-file.outputs.filename }}
    folderId: ${{ secrets.DRIVE_FOLDER_ID }}
```

### AWS S3
```yaml
- name: Upload to S3
  uses: aws-actions/configure-aws-credentials@v4
  with:
    aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
    aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
    aws-region: us-east-1
    
- name: Copy to S3
  run: |
    aws s3 cp servernode/backups/${{ steps.backup-file.outputs.filename }} \
      s3://my-backup-bucket/mongodb-backups/
```

---

## בעיות נפוצות

### "Resource not accessible by integration"
- ודא ש-Actions מופעל בהגדרות הרפוזיטורי
- Settings > Actions > General > "Allow all actions"

### "Secret MONGODB_URL not found"
- ודא שהוספת את ה-secret בהגדרות
- שם ה-secret חייב להיות בדיוק `MONGODB_URL`

### הגיבוי נכשל
- בדוק את הלוגים ב-Actions tab
- ודא שה-MongoDB URL תקין
- ודא שיש גישה מ-GitHub (IP whitelist ב-MongoDB Atlas)

---

## עלויות

✅ **חינם לחלוטין!**

GitHub Actions נותן:
- 2,000 דקות/חודש (free tier)
- גיבוי לוקח ~1-2 דקות
- = ~1,000-2,000 גיבויים בחודש

זה יותר מספיק לגיבוי יומי.
