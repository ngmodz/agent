import re
import json

def parse_markdown_table(table_lines):
    """Parses a single markdown table into a list of dictionaries."""
    if not table_lines:
        return []

    header_line = table_lines[0]
    header = [h.strip() for h in header_line.strip('|').split('|')]
    
    # Skip separator line (line with dashes and pipes)
    if len(table_lines) < 3:  # Need at least header, separator, and one data row
        return []
    
    # Verify the separator line is properly formatted
    separator_line = table_lines[1]
    if not all(col.strip().startswith('-') for col in separator_line.strip('|').split('|')):
        print(f"Warning: Separator line doesn't match expected format: {separator_line}")
        return []

    data_rows = table_lines[2:]  # Skip header and separator
    parsed_rows = []

    for row_line in data_rows:
        if not row_line.strip() or not '|' in row_line:  # Skip empty lines
            continue
        
        values = [v.strip() for v in row_line.strip('|').split('|')]
        
        # Ensure we have the right number of columns
        if len(values) == len(header):
            row_dict = {}
            for i, key in enumerate(header):
                # Clean up the key name
                clean_key = key.strip()
                row_dict[clean_key] = values[i].strip()
            parsed_rows.append(row_dict)
        else:
            print(f"Warning: Row has {len(values)} columns, expected {len(header)}: {row_line}")
    
    return parsed_rows

def extract_tables_from_markdown(markdown_content):
    """Extracts all tables from markdown content."""
    # Split the markdown content into lines
    lines = markdown_content.split('\n')
    
    all_services = []
    current_table_lines = []
    in_table = False
    current_service_category = "Unknown"

    for i, line in enumerate(lines):
        # Track section headers for categorization
        if line.startswith("## "):
            current_service_category = line.strip("#").strip()
            print(f"Found category: {current_service_category}")
        elif line.startswith("### "):
            # Sub-category
            sub_category = line.strip("#").strip()
            current_service_category = f"{current_service_category} - {sub_category}"
            print(f"Found subcategory: {current_service_category}")

        # Detect table start by looking for a line with column headers
        if '| Service ID |' in line or '|Service ID|' in line or re.match(r'^\|\s*Service ID\s*\|', line):
            print(f"Found table start at line {i+1}: {line}")
            in_table = True
            current_table_lines = [line]
        # Continue collecting table lines
        elif in_table:
            if line.strip().startswith('|') and '|' in line:
                current_table_lines.append(line)
            else:
                # Table end detected
                if len(current_table_lines) >= 3:  # Ensure we have at least header, separator, and one data row
                    print(f"Parsing table with {len(current_table_lines)} lines")
                    parsed_table = parse_markdown_table(current_table_lines)
                    if parsed_table:
                        print(f"Extracted {len(parsed_table)} services from table")
                        for service in parsed_table:
                            service['Category'] = current_service_category
                        all_services.extend(parsed_table)
                    else:
                        print("No services extracted from table")
                in_table = False
                current_table_lines = []

    # Process any remaining table at the end of the file
    if in_table and len(current_table_lines) >= 3:
        parsed_table = parse_markdown_table(current_table_lines)
        if parsed_table:
            for service in parsed_table:
                service['Category'] = current_service_category
            all_services.extend(parsed_table)
    
    print(f"Total services extracted: {len(all_services)}")
    return all_services

def standardize_service(service):
    """Standardize a service dictionary for consistent keys and values."""
    standardized = {}
    
    for key, value in service.items():
        # Sanitize key: remove extra spaces, convert to a more standard form
        new_key = key.replace(' ', '_').replace('(', '').replace(')', '').replace('₹', 'INR').lower()
        if new_key == "price_per_1000":
            new_key = "price_per_1000_inr"
        
        # Clean value: remove markdown, extra spaces
        cleaned_value = re.sub(r'<br\s*/?>', ' ', value).strip()
        cleaned_value = re.sub(r'\s{2,}', ' ', cleaned_value)
        standardized[new_key] = cleaned_value
    
    # Ensure essential keys exist
    essential_keys = ['service_id', 'service_name', 'price_per_1000_inr', 'min_order', 'max_order', 'avg._delivery_time', 'description', 'category']
    for key in essential_keys:
        if key not in standardized:
            standardized[key] = "N/A"
    
    return standardized

def main():
    try:
        with open("services.md", "r", encoding="utf-8") as f:
            markdown_content = f.read()
            print(f"Read {len(markdown_content)} characters from services.md")
    except FileNotFoundError:
        print("Error: services.md not found.")
        return
    except Exception as e:
        print(f"Error reading services.md: {e}")
        return

    # Extract raw services from markdown tables
    services_data = extract_tables_from_markdown(markdown_content)
    
    if not services_data:
        print("WARNING: No services were extracted from the markdown file.")
    
    # Standardize each service dictionary
    standardized_services = [standardize_service(service) for service in services_data if service]
    
    # Filter out services without an ID
    valid_services = [service for service in standardized_services if service['service_id'] != "N/A"]
    
    print(f"Final count of valid services: {len(valid_services)}")
    
    # Preview some data
    if valid_services:
        print("\nSample service data:")
        print(json.dumps(valid_services[0], indent=2))

    try:
        with open("services.json", "w", encoding="utf-8") as f:
            json.dump(valid_services, f, indent=4, ensure_ascii=False)
        print(f"Successfully wrote {len(valid_services)} services to services.json")
    except Exception as e:
        print(f"Error writing services.json: {e}")

if __name__ == "__main__":
    main() 