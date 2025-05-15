import re
import json

def parse_markdown_table(table_lines):
    """Parses a single markdown table into a list of dictionaries."""
    if not table_lines:
        return []

    header_line = table_lines[0]
    header = [h.strip() for h in header_line.strip('|').split('|')]
    
    # Check for separator line
    if len(table_lines) < 2 or not re.match(r"^[|\s*:-]+$", table_lines[1]):
        # This might not be a valid table or a table with no data rows
        return []

    data_rows = table_lines[2:]
    parsed_rows = []

    for row_line in data_rows:
        if not row_line.strip() or row_line.startswith('#') or not '|' in row_line: # Skip empty lines or lines that are not part of the table
            continue
        
        values = [v.strip() for v in row_line.strip('|').split('|')]
        if len(values) == len(header):
            row_dict = dict(zip(header, values))
            # Clean up problematic keys
            row_dict = {k.replace('\\n', '').replace('<br>', ' ').strip(): v for k, v in row_dict.items()}
            parsed_rows.append(row_dict)
    return parsed_rows

def extract_tables_from_markdown(markdown_content):
    """Extracts all tables from markdown content."""
    lines = markdown_content.split('\\n')
    all_services = []
    current_table_lines = []
    in_table = False
    current_service_category = "Unknown"

    for i, line in enumerate(lines):
        if line.startswith("## "):
            current_service_category = line.strip("# ").strip()
        elif line.startswith("### "):
            # Sub-category, can be appended to main category or handled as needed
            current_service_category = f"{current_service_category} - {line.strip('# ').strip()}"


        if re.match(r"^[|\s*Service ID\s*|]", line, re.IGNORECASE): # A common start for our tables
            in_table = True
            current_table_lines = [line]
        elif in_table:
            if line.strip() == "" or line.startswith("#") or not line.startswith("|"): # End of table or a line that breaks the table
                if current_table_lines:
                    parsed_table = parse_markdown_table(current_table_lines)
                    for service in parsed_table:
                        service['Category'] = current_service_category # Add category to each service
                    all_services.extend(parsed_table)
                    current_table_lines = []
                in_table = False
            else:
                current_table_lines.append(line)

    if in_table and current_table_lines: # Process the last table if file ends mid-table
        parsed_table = parse_markdown_table(current_table_lines)
        for service in parsed_table:
            service['Category'] = current_service_category
        all_services.extend(parsed_table)
        
    return all_services

def main():
    try:
        with open("services.md", "r", encoding="utf-8") as f:
            markdown_content = f.read()
    except FileNotFoundError:
        print("Error: services.md not found.")
        return
    except Exception as e:
        print(f"Error reading services.md: {e}")
        return

    services_data = extract_tables_from_markdown(markdown_content)

    # Filter out any empty dictionaries that might have been added
    services_data = [service for service in services_data if service]

    # Standardize keys and clean data
    standardized_services = []
    for service in services_data:
        standardized_service = {}
        for key, value in service.items():
            # Sanitize key: remove extra spaces, convert to a more standard form
            new_key = key.replace(' ', '_').replace('(', '').replace(')', '').replace('₹', 'INR').lower()
            if new_key == "price_per_1000": # Specific rename for clarity
                new_key = "price_per_1000_inr"
            
            # Clean value: remove markdown, extra spaces
            cleaned_value = re.sub(r'<br\s*/?>', ' ', value).strip() # Replace <br> with space
            cleaned_value = re.sub(r'\s{2,}', ' ', cleaned_value) # Replace multiple spaces with one
            standardized_service[new_key] = cleaned_value
        
        # Ensure essential keys exist, even if empty, for consistency
        essential_keys = ['service_id', 'service_name', 'price_per_1000_inr', 'min_order', 'max_order', 'avg._delivery_time', 'description', 'category']
        for ek in essential_keys:
            if ek not in standardized_service:
                standardized_service[ek] = None # or some default like "N/A"
        
        if standardized_service.get('service_id'): # Only add if service_id is present
             standardized_services.append(standardized_service)


    try:
        with open("services.json", "w", encoding="utf-8") as f:
            json.dump(standardized_services, f, indent=4, ensure_ascii=False)
        print("Successfully parsed services.md and created services.json")
    except Exception as e:
        print(f"Error writing services.json: {e}")

if __name__ == "__main__":
    main() 