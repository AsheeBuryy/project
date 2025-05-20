from db_connect import get_connection

def test_db():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT DATABASE();")
    db = cursor.fetchone()
    print(f"Connected to database: {db[0]}")
    cursor.close()
    conn.close()

if __name__ == "__main__":
    test_db()
