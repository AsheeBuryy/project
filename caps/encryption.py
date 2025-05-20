import hashlib
import logging
from db_connect import get_connection  # Import from db_connect.py

# Setup logging to file
logging.basicConfig(
    filename='user_actions.log',
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

def hash_string(input_string):
    return hashlib.sha256(input_string.encode()).hexdigest()

def insert_user(username, password):
    password_hash = hash_string(password)
    conn = None  # define conn early
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO users (username, password_hash) VALUES (%s, %s)",
            (username, password_hash)
        )
        conn.commit()
        logging.info(f"User '{username}' added to database.")
        print("User successfully added!")
    except Exception as e:
        logging.error(f"Error inserting user '{username}': {e}")
        print(f"Error: {e}")
    finally:
        if conn is not None and conn.is_connected():
            cursor.close()
            conn.close()

if __name__ == "__main__":
    username = input("Enter username: ")
    password = input("Enter password: ")
    insert_user(username, password)