import re

def parse_drug_data(text):
    drug_data = {}
    
    # Hardcoded section headings
    sections = ["Drug Eligibility", "Digital Fill History"]
    
    # Splitting input text into sections
    pattern = rf"\*\*(.*?)\*\*"  # Matches headings enclosed in '**'
    matches = re.split(pattern, text)
    
    current_section = None
    for section in matches:
        section = section.strip()
        if section in sections:
            current_section = section
            drug_data[current_section] = []
        elif current_section:
            lines = [re.sub(r'^[*\-]\s*', '', line.strip()) for line in section.split("\n") if line.strip()]
            
            sub_section = None
            sub_section_data = []
            for line in lines:
                if line.endswith(":"):
                    if sub_section:
                        drug_data[current_section].append({sub_section: sub_section_data})
                    sub_section = line[:-1].strip()
                    sub_section_data = []
                elif sub_section:
                    sub_section_data.append(line)
                else:
                    drug_data[current_section].append(line)
            
            if sub_section:
                drug_data[current_section].append({sub_section: sub_section_data})
    
    return drug_data

# Example input text
input_text = """**Drug Eligibility**

* The drug is eligible for digital filling: Yes (Y)

* Consistent eligibility across all instances.

* Filling Method:
- Past 6 fills: 100% digital
- Past 12 fills: 91.67% digital
- Past 6 fills: 83.33% digital
- Past 12 fills: 91.67% digital

**Digital Fill History**

* Filling Method:
- Past 6 fills: 100% digital
- Past 12 fills: 91.67% digital
- Past 6 fills: 83.33% digital
- Past 12 fills: 91.67% digital

* Overall trend indicates a strong preference for digital filling.
"""

# Parsing the input text
drug_data = parse_drug_data(input_text)

# Output the structured data
print(drug_data)
