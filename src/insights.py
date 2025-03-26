import re

def parse_drug_data(text):
    drug_data = {}
    
    # Hardcoded section headings
    sections = ["Drug Eligibility", "Digital Fill History"]
    
    # Finding section headers while preserving the content integrity
    pattern = r"\*\*(.*?)\*\*"
    matches = list(re.finditer(pattern, text))

    if not matches:
        return {}

    section_data = {}
    last_index = 0

    for match in matches:
        heading = match.group(1).strip()
        if heading in sections:
            if last_index != 0:
                section_data[current_section] = text[last_index:match.start()].strip()
            current_section = heading
            last_index = match.end()

    if current_section:
        section_data[current_section] = text[last_index:].strip()

    # Processing section content while preserving ** inside text
    for section, content in section_data.items():
        lines = [re.sub(r'^[*\-]\s*', '', line.strip()) for line in content.split("\n") if line.strip()]
        
        sub_section = None
        sub_section_data = []
        parsed_data = []

        for line in lines:
            if line.endswith(":"):
                if sub_section:
                    parsed_data.append({sub_section: sub_section_data})
                sub_section = line[:-1].strip()
                sub_section_data = []
            elif sub_section:
                sub_section_data.append(line)
            else:
                parsed_data.append(line)

        if sub_section:
            parsed_data.append({sub_section: sub_section_data})

        drug_data[section] = parsed_data

    return drug_data

# Example input text
input_text = """**Drug Eligibility**

* The drug is **eligible** for digital filling: Yes (Y)

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

* Overall trend indicates a **strong** preference for digital filling.
"""

# Parsing the input text
drug_data = parse_drug_data(input_text)

# Output the structured data
print(drug_data)