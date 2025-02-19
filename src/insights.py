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


import re

def parse_summary_to_json(summary_text):
    summary_dict = {}

    # Split the summary into sections based on headings.
    # This regex splits before lines starting with either markdown headings (e.g., "###") 
    # or bolded headings (e.g., "**Title**:").
    sections = re.split(r'(?=^(?:#{1,6}\s+|\*\*.*?\*\*:))', summary_text.strip(), flags=re.MULTILINE)

    for section in sections:
        section = section.strip()
        if not section:
            continue

        # The first line is the heading; the rest is content.
        lines = section.splitlines()
        heading_line = lines[0].strip()

        # Extract the title.
        # This regex allows for optional markdown markers (like "###" or "1. "),
        # optional bold markers ("**"), and an optional trailing colon.
        title_match = re.match(r'(?:#{1,6}\s+)?(?:\d+\.\s*)?(?:\*\*)?(.+?)(?:\*\*)?(?::)?\s*$', heading_line)
        if title_match:
            title = title_match.group(1).strip()
            content = "\n".join(lines[1:]).strip()

            # Process the content based on the title.
            if title == "Significant Details":
                summary_dict[title] = [" ".join(line.strip().replace('- ', '') for line in content.split('\n') if line.strip())]
            elif title == "Rx Info":
                summary_dict[title] = [" ".join(line.strip().replace('- ', '') for line in content.split('\n') if line.strip())]
            elif title == "Prescription Benefit Verification (BV) Info":
                summary_dict[title] = [" ".join(line.strip().replace('- ', '') for line in content.split('\n') if line.strip())]
            elif title == "Billing/Invoice":
                summary_dict[title] = [" ".join(line.strip().replace('- ', '') for line in content.split('\n') if line.strip())]
            elif title == "General Updates":
                summary_dict[title] = [" ".join(line.strip().replace('- ', '') for line in content.split('\n') if line.strip())]
            elif title == "Communication":
                summary_dict[title] = {
                    key.replace("- **", "").replace("**", "").strip(): [value.strip()]
                    for line in content.split('\n') if ':' in line
                    for key, value in [line.split(':', 1)]
                }
    return summary_dict

# Example usage:
if __name__ == "__main__":
    input_text = """
### Significant Details

- The patient is currently due for a refill of their OFEV prescription.
- Multiple reminders were sent via SMS and email on January 4, 6, 10, 13, and 15, 2025, indicating urgency in refilling.
- A blocker may include potential confusion regarding whether they have already filled the prescription.

### Rx Info

- Prescription: OFEV
- Rx # ending in: 2826

### Prescription Benefit Verification (BV) Info

- No verification outcomes are noted in the provided documentation.

### Billing/Invoice

- Billed: $11.20 on January 1, 2025, with payment processed via credit card.

### General Updates

- An outbound call on January 10, 2025, left a message for the patient concerning refill scheduling.

### Communication

- **Calls**: January 10, 2025: Outbound call left on voicemail regarding refill request.
- **Refill Reminders**: Frequent SMS and emails were sent on January 4, 6, 10, 13, and 15, urging the patient to refill their prescription.
- **System Communications**: Ongoing digital outreach through SMS and emails reminding the patient about the refill. Most recent communication occurred on January 22, 2025.
"""
    result = parse_summary_to_json(input_text)
    print(result)

