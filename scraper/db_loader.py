import requests
from bs4 import BeautifulSoup
import mysql.connector
import os
from dotenv import load_dotenv
from urllib.parse import urlparse

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

def scrape_uf_catalog():
    print("Scraping UF catalog...")
    url = "https://catalog.ufl.edu/UGRD/programs/"
    headers = {'User-Agent': 'RateMyMajor senior project bot'}
    
    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.text, 'html.parser')

    dept_mapping = {}
    filter_links = soup.select('div.filter-group ul li input.filter-cb')
    
    for cb in filter_links:
        filter_id = cb['value'].replace('.', '')
        dept_name = cb.find_next('label').get_text(strip=True)
        dept_mapping[filter_id] = dept_name

    results = []
    programs = soup.select('div.isotope ul li.item')

    for prog in programs:
        title_element = prog.find('span', class_='title')
        type_element = prog.find('span', class_='type')
        
        if not title_element:
            continue

        program_name = title_element.get_text(strip=True)
        program_type = type_element.get_text(strip=True) if type_element else "unknown"
        
        classes = prog.get('class', [])
        tags = [dept_mapping[c] for c in classes if c in dept_mapping]
        
        results.append({
            "name": program_name,
            "type": program_type,
            "tags": tags
        })

    return results

def load_to_db(data):
    print("Connecting to database...")
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        # 1. Ensure UF exists
        cursor.execute("SELECT id FROM university WHERE name = 'University of Florida' LIMIT 1")
        uni_row = cursor.fetchone()
        if uni_row:
            uni_id = uni_row[0]
        else:
            cursor.execute("INSERT INTO university (name, location) VALUES ('University of Florida', 'Gainesville, FL')")
            uni_id = cursor.lastrowid
        
        print(f"University ID: {uni_id}")

        # 2. Process Departments and Majors
        dept_ids = {} # name -> id
        
        for item in data:
            dept_name = item['tags'][-1] if item['tags'] else "General"
            
            # Get or create department
            if dept_name not in dept_ids:
                cursor.execute("SELECT id FROM department WHERE name = %s AND university_id = %s LIMIT 1", (dept_name, uni_id))
                dept_row = cursor.fetchone()
                if dept_row:
                    dept_ids[dept_name] = dept_row[0]
                else:
                    cursor.execute("INSERT INTO department (name, university_id) VALUES (%s, %s)", (dept_name, uni_id))
                    dept_ids[dept_name] = cursor.lastrowid
            
            dept_id = dept_ids[dept_name]
            
            # Insert Major
            major_name = item['name']
            major_type = item['type']
            
            # Check if major exists in this department
            cursor.execute("SELECT id FROM major WHERE name = %s AND department_id = %s LIMIT 1", (major_name, dept_id))
            if not cursor.fetchone():
                cursor.execute("INSERT INTO major (name, type, department_id) VALUES (%s, %s, %s)", (major_name, major_type, dept_id))
        
        conn.commit()
        print("Successfully loaded data to database!")

    except Exception as e:
        conn.rollback()
        print(f"Error loading to database: {e}")
    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    scraped_data = scrape_uf_catalog()
    if scraped_data:
        load_to_db(scraped_data)
