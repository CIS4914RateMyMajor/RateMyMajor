import requests
from bs4 import BeautifulSoup

def scrape_uf_catalog():
    url = "https://catalog.ufl.edu/UGRD/programs/"
    # Professional practice: identifies the script to the university IT
    headers = {'User-Agent': 'RateMyMajor senior project bot'}
    
    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.text, 'html.parser')

    # 1. Build a mapping of Filter IDs -> Department Names
    # These are found in the sidebar under the "Department" heading
    dept_mapping = {}
    # Target links that have a data-filter attribute like ".filter_42"
    filter_links = soup.select('div.filter-group ul li input.filter-cb')
    
    for cb in filter_links:
        filter_id = cb['value'].replace('.', '')  # e.g., "filter_42"
        # The label immediately following the input contains the name
        dept_name = cb.find_next('label').get_text(strip=True)
        dept_mapping[filter_id] = dept_name

    # 2. Extract every Major/Minor and map its classes to the departments
    results = []
    # Every program is a list item with the class "item"
    programs = soup.select('div.isotope ul li.item')

    for prog in programs:
        # Extract name and type (major/minor/certificate)
        title_element = prog.find('span', class_='title')
        type_element = prog.find('span', class_='type')
        
        if not title_element:
            continue

        program_name = title_element.get_text(strip=True)
        program_type = type_element.get_text(strip=True) if type_element else "unknown"
        
        # Get all CSS classes (e.g. ['item', 'filter_22', 'filter_42'])
        classes = prog.get('class', [])
        
        # Map the 'filter_X' classes back to the Department names
        tags = [dept_mapping[c] for c in classes if c in dept_mapping]
        
        results.append({
            "name": program_name,
            "type": program_type,
            "tags": tags
        })

    return results

all_data = scrape_uf_catalog()
for item in all_data:
    # last tag is the department, if it exists
    dept_str = item['tags'][-1] if item['tags'] else "No Department listed"
    print(f"{item['name']} ({item['type']}) in the department of {dept_str}")


# References:
# AI prompt: "im scraping this website: https://catalog.ufl.edu/UGRD/programs/ 
#             it has a list of majors and minors at uf. i want to get them and 
#             the info about which department they are in. the departments
#             function as filters on this page 
#             (ie. https://catalog.ufl.edu/UGRD/programs/#filter=.filter_42) is
#             there anyway for me to get this info without making a million
#             http requests?"