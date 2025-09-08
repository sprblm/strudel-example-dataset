import csv
import json
import os

def convert_csv_to_json():
    """Convert the palmerpenguins_extended.csv file to penguins.json"""
    csv_file = 'public/palmerpenguins_extended.csv'
    json_file = 'public/penguins.json'
    
    # Check if CSV file exists
    if not os.path.exists(csv_file):
        print(f"Error: {csv_file} not found")
        return
    
    penguins = []
    
    print("Reading CSV file...")
    with open(csv_file, 'r', encoding='utf-8') as file:
        csv_reader = csv.DictReader(file)
        
        for row_num, row in enumerate(csv_reader, 1):
            penguin = {}
            
            for key, value in row.items():
                # Convert numeric fields to appropriate types
                if key in ['bill_length_mm', 'bill_depth_mm', 'flipper_length_mm', 'body_mass_g']:
                    try:
                        penguin[key] = float(value) if value and value.strip() else None
                    except ValueError:
                        penguin[key] = None
                elif key == 'year':
                    try:
                        penguin[key] = int(value) if value and value.strip() else None
                    except ValueError:
                        penguin[key] = None
                else:
                    # String fields - keep as strings, handle empty values
                    penguin[key] = value.strip() if value and value.strip() else None
            
            penguins.append(penguin)
            
            # Progress indicator
            if row_num % 500 == 0:
                print(f"Processed {row_num} records...")
    
    print(f"Total records processed: {len(penguins)}")
    
    # Write to JSON file
    print("Writing JSON file...")
    with open(json_file, 'w', encoding='utf-8') as file:
        json.dump(penguins, file, indent=2, ensure_ascii=False)
    
    print(f"Successfully created {json_file} with {len(penguins)} penguin records")

if __name__ == "__main__":
    convert_csv_to_json()
