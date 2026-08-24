import sqlite3
import os

from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token


BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATABASE_PATH = os.path.join(BASE_DIR, "users.db")


def get_db():
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db()

    conn.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL
        )
    """)

    conn.commit()
    conn.close()


def signup_user(name, email, password):

    password_hash = generate_password_hash(password)

    conn = get_db()

    try:
        cursor = conn.execute(
            """
            INSERT INTO users (name, email, password_hash)
            VALUES (?, ?, ?)
            """,
            (name, email.lower().strip(), password_hash)
        )

        conn.commit()

        user_id = cursor.lastrowid

        token = create_access_token(
            identity=str(user_id)
        )

        return {
            "id": user_id,
            "name": name,
            "email": email.lower().strip(),
            "token": token
        }

    except sqlite3.IntegrityError:
        raise ValueError("An account with this email already exists.")

    finally:
        conn.close()


def login_user(email, password):

    conn = get_db()

    user = conn.execute(
        """
        SELECT id, name, email, password_hash
        FROM users
        WHERE email = ?
        """,
        (email.lower().strip(),)
    ).fetchone()

    conn.close()

    if user is None:
        raise ValueError("Invalid email or password.")

    if not check_password_hash(user["password_hash"], password):
        raise ValueError("Invalid email or password.")

    token = create_access_token(
        identity=str(user["id"])
    )

    return {
        "id": user["id"],
        "name": user["name"],
        "email": user["email"],
        "token": token
    }


def get_user_by_id(user_id):

    conn = get_db()

    user = conn.execute(
        """
        SELECT id, name, email
        FROM users
        WHERE id = ?
        """,
        (user_id,)
    ).fetchone()

    conn.close()

    if user is None:
        return None

    return {
        "id": user["id"],
        "name": user["name"],
        "email": user["email"]
    }