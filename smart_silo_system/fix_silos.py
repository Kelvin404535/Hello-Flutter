import sqlite3

conn = sqlite3.connect('instance/silo_management.db')
cursor = conn.cursor()

# 1. Show current silos
print("=== Current Silos ===")
cursor.execute("SELECT id, silo_number, status FROM silos")
rows = cursor.fetchall()
for row in rows:
    print(row)

# 2. Set all silos to active
cursor.execute("UPDATE silos SET status = 'active', deleted_at = NULL, deleted_by = NULL")
conn.commit()
print("\n✅ All silos set to 'active'")

# 3. Show updated silos
print("\n=== Updated Silos ===")
cursor.execute("SELECT id, silo_number, status FROM silos")
rows = cursor.fetchall()
for row in rows:
    print(row)

conn.close()
print("\n✅ Done! Refresh your dashboard.")