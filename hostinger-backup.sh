#!/bin/bash
# Automated Backup Script for AGB Planner Database
# Save this on your Hostinger server

# Configuration
BACKUP_DIR="/home/your_username/backups/agb_planner"
DB_PATH="/home/your_username/public_html/admin.agbitsolutions.com/database.sqlite"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=14

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Perform backup
echo "🔄 Starting backup at $(date)"

if [ -f "$DB_PATH" ]; then
    # Create backup
    cp "$DB_PATH" "$BACKUP_DIR/database_$DATE.sqlite"
    
    # Compress backup
    gzip "$BACKUP_DIR/database_$DATE.sqlite"
    
    echo "✅ Backup created: database_$DATE.sqlite.gz"
    
    # Optimize database
    sqlite3 "$DB_PATH" "VACUUM;"
    echo "✅ Database optimized"
    
    # Remove old backups (keep last N days)
    find "$BACKUP_DIR" -name "database_*.sqlite.gz" -mtime +$RETENTION_DAYS -delete
    echo "✅ Old backups cleaned up (keeping last $RETENTION_DAYS days)"
    
    # Show backup size and count
    BACKUP_SIZE=$(du -sh "$BACKUP_DIR" | cut -f1)
    BACKUP_COUNT=$(ls -1 "$BACKUP_DIR" | wc -l)
    echo "📊 Total backups: $BACKUP_COUNT (using $BACKUP_SIZE)"
    
    # Log success
    echo "$(date): Backup successful" >> "$BACKUP_DIR/backup.log"
else
    echo "❌ Database file not found: $DB_PATH"
    echo "$(date): Backup failed - DB not found" >> "$BACKUP_DIR/backup.log"
    exit 1
fi

echo "✅ Backup complete at $(date)"
