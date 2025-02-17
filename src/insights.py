import re

def parse_text(data_layer_insights):
    result = {}

    # Ensure the text starts with a newline for reliable splitting.
    if not data_layer_insights.startswith("\n"):
        data_layer_insights = "\n" + data_layer_insights

    # Split the text into sections when a newline is followed by "###" and some whitespace.
    sections = re.split(r'\n###\s+', data_layer_insights)
    
    for section in sections:
        section = section.strip()
        if not section:
            continue
        
        # The first line is the section heading.
        lines = section.splitlines()
        heading = lines[0].strip().rstrip(':')
        content = "\n".join(lines[1:]).strip()

        section_dict = {}

        # Pattern for bullet items, matching lines like:
        # *  **Key:** value
        bullet_pattern = r'\*\s+\*\*(.*?)\*\*\s*:?\s*(.*)'
        bullet_matches = re.findall(bullet_pattern, content, re.MULTILINE)
        for key, value in bullet_matches:
            cleaned_key = key.strip().rstrip(':')
            section_dict[cleaned_key] = value.strip()

        # Updated pattern for a summary line that handles both cases:
        # **Summary:** value    and    **Summary**: value
        summary_pattern = r'^\s*\*\*Summary:?\*\*\s*:?\s*(.*)$'
        summary_match = re.search(summary_pattern, content, re.MULTILINE)
        if summary_match:
            section_dict["Summary"] = summary_match.group(1).strip()

        result[heading] = section_dict

    return result

# Example usage:
if __name__ == "__main__":
    sample_text = """### Refills Left

*  **TREMFYA:** 3 refills remaining.
*  **TALTZ:** 1 refill remaining.
**Summary:** Both medications have refills available; TREMFYA has 3 and TALTZ has 1.

### Digital Registration and Filling

*  **Digital Registration:** No (N).
*  **Filling Method:** Manual (drug_digital_fill_flag: Yes, but digital fill percentage is low).
**Summary:** The patient is not digitally registered and is filling prescriptions manually, despite the option for digital fills.
"""
    parsed_result = parse_text(sample_text)
    print(parsed_result)
