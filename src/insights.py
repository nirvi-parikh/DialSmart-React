import re

def parse_data_layer_insights(data_layer_insights):
    """
    Parses a markdown-formatted string into a dictionary.
    
    Each section is expected to start with a heading line beginning with "###".
    Within each section, lines with bullet points (starting with '*') are parsed.
    
    Parameters:
        data_layer_insights (str): The markdown text to parse.
    
    Returns:
        dict: Parsed dictionary with section headings as keys.
    """
    result = {}

    # Split the text into sections by looking for lines starting with "###"
    # The regex splits on a newline followed by "###" and a space.
    sections = re.split(r'\n###\s+', data_layer_insights)
    
    for section in sections:
        section = section.strip()
        if not section:
            continue
        
        # Each section: first line is the heading
        lines = section.splitlines()
        heading = lines[0].strip()
        content = "\n".join(lines[1:]).strip()

        section_dict = {}

        # Pattern for bullet items: *  **Key**: value
        bullet_pattern = r'\*\s+\*\*(.*?)\*\*:\s*(.*)'
        for key, value in re.findall(bullet_pattern, content):
            section_dict[key.strip()] = value.strip()

        # Look for a summary line formatted as: **Summary**: value
        summary_pattern = r'\*\*Summary\*\*:\s*(.*)'
        summary_match = re.search(summary_pattern, content)
        if summary_match:
            section_dict["Summary"] = summary_match.group(1).strip()

        result[heading] = section_dict

    return result


parsed_dict = parse_data_layer_insights(data_layer_insights)
print(parsed_dict)
