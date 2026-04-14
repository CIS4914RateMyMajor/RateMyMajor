import mysql.connector
import os
import random
from dotenv import load_dotenv
from urllib.parse import urlparse
import uuid

# Load environment variables
load_dotenv()

def get_db_connection():
    db_url = os.getenv("DATABASE_URL")
    if not db_url:
        raise ValueError("DATABASE_URL not found in environment variables")
    
    # Parse mysql://user:pass@host:port/db
    url = urlparse(db_url)
    
    return mysql.connector.connect(
        host=url.hostname,
        user=url.username,
        password=url.password,
        port=url.port or 3306,
        database=url.path[1:] # remove leading slash
    )

def add_fake_reviews():
    print("Connecting to database...")
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        # 1. Ensure a fake user exists
        fake_user_id = str(uuid.uuid4())
        fake_email = "test.student@ufl.edu"
        
        cursor.execute("SELECT id FROM user WHERE email = %s LIMIT 1", (fake_email,))
        user_row = cursor.fetchone()
        
        if user_row:
            user_id = user_row['id']
            print(f"Using existing user: {user_id}")
        else:
            print("Creating fake user...")
            cursor.execute(
                "INSERT INTO user (id, name, email, email_verified, role) VALUES (%s, %s, %s, %s, %s)",
                (fake_user_id, "Test Gator", fake_email, True, "student")
            )
            user_id = fake_user_id
            print(f"Created fake user: {user_id}")

        # 2. Get some majors to review
        cursor.execute("SELECT id, name FROM major LIMIT 20")
        majors = cursor.fetchall()

        if not majors:
            print("No majors found in database. Run db_loader.py first.")
            return

        comments = [
            "This major is incredibly rewarding but definitely requires a lot of time management.",
            "The professors are hit or miss, but the curriculum is very solid.",
            "Great career prospects. I already have an internship lined up!",
            "Honestly much harder than I expected. Be prepared for late nights in the library.",
            "I love the community here. Everyone is so helpful and collaborative.",
            "The intro classes are large, but once you get into upper division it gets much better.",
            "Wish there were more elective options, but the core classes are interesting.",
            "Very math-heavy, make sure your foundations are strong.",
            "The projects are very hands-on and practical. Great for a portfolio.",
            "A bit disorganized at times, but the content is top-notch."
        ]

        major_statuses = ["Current Student", "Graduated", "Switched Out"]

        print(f"Adding reviews for {len(majors)} majors...")

        for major in majors:
            # Add 1-3 reviews per major
            num_reviews = random.randint(1, 3)
            for _ in range(num_reviews):
                rating = random.randint(3, 5) # Usually people who review are positive or very negative, let's stick to mostly positive
                difficulty = random.randint(2, 5)
                comment = random.choice(comments)
                status = random.choice(major_statuses)

                # Insert into reviews table
                cursor.execute(
                    "INSERT INTO reviews (user_id, rating, difficulty, comment, major_status, review_status) VALUES (%s, %s, %s, %s, %s, %s)",
                    (user_id, rating, difficulty, comment, status, "approved")
                )
                review_id = cursor.lastrowid

                # Link to major in review_majors table
                cursor.execute(
                    "INSERT INTO review_majors (major_id, review_id) VALUES (%s, %s)",
                    (major['id'], review_id)
                )

        conn.commit()
        print("Successfully added fake reviews!")

    except Exception as e:
        conn.rollback()
        print(f"Error adding fake reviews: {e}")
    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    add_fake_reviews()
