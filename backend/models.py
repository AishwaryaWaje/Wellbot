from db import get_connection

def create_user(username, email, password, language, age, gender):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO users (username, email, password, language, age, gender) VALUES (?, ?, ?, ?, ?, ?)",
        (username, email, password, language, age, gender)
    )
    conn.commit()
    conn.close()

def get_user_by_email(email):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE email=?", (email,))
    user = cursor.fetchone()
    conn.close()
    return user

def update_user(user_id, username, language, age, gender):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "UPDATE users SET username=?, language=?, age=?, gender=? WHERE id=?",
        (username, language, age, gender, user_id)
    )
    conn.commit()
    conn.close()

def add_chat(user_id, message, response):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO chats (user_id, message, response) VALUES (?, ?, ?)",
        (user_id, message, response)
    )
    conn.commit()
    conn.close()

def get_chats(user_id):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT message, response, timestamp FROM chats WHERE user_id=? ORDER BY timestamp ASC",
        (user_id,)
    )
    chats = cursor.fetchall()
    conn.close()
    return chats

def delete_user(user_id):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM chats WHERE user_id=?", (user_id,))
    cursor.execute("DELETE FROM users WHERE id=?", (user_id,))
    conn.commit()
    conn.close()

def clear_chats(user_id):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM chats WHERE user_id=?", (user_id,))
    conn.commit()
    conn.close()

def add_feedback(user_id, rating, review):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO feedbacks (user_id, rating, review) VALUES (?, ?, ?)",
        (user_id, rating, review)
    )
    conn.commit()
    conn.close()

def get_feedbacks(user_id):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT rating, review, timestamp FROM feedbacks WHERE user_id=? ORDER BY timestamp DESC",
        (user_id,)
    )
    data = cursor.fetchall()
    conn.close()
    return data

def get_total_users():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) FROM users")
    total = cursor.fetchone()[0]
    conn.close()
    return total

def get_total_chats():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) FROM chats")
    total = cursor.fetchone()[0]
    conn.close()
    return total

def get_total_feedbacks():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) FROM feedbacks")
    total = cursor.fetchone()[0]
    conn.close()
    return total

def get_all_feedbacks():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT users.username, feedbacks.rating, feedbacks.review, feedbacks.timestamp
        FROM feedbacks
        JOIN users ON feedbacks.user_id = users.id
        ORDER BY feedbacks.timestamp DESC
    """)
    data = cursor.fetchall()
    conn.close()
    return [
        {"username": row[0], "rating": row[1], "review": row[2], "timestamp": row[3]}
        for row in data
    ]
