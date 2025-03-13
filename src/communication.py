import re
from collections import defaultdict

def parse_communication(text):
    communication = defaultdict(list)
    current_category = None
    
    for line in text.split('\n'):
        line = line.strip()
        if not line:
            continue
        
        category_match = re.match(r'\*\*(.*?)\*\*:\s*(.*)', line)
        if category_match:
            current_category = category_match.group(1)
            content = category_match.group(2).strip()
            if content:
                communication[current_category].append(content)
            continue
        
        if current_category:
            cleaned_line = line.lstrip('-').strip()
            if cleaned_line:
                communication[current_category].append(cleaned_line)
    
    return {'Communication': dict(communication)}

input_text = """**Calls**: Automated call resulted in an answering machine response (03-04-2025).
**Refill Reminders**: SMS reminders sent on 02-27-2025, 03-02-2025, and 03-06-2025. Emails indicating prescription readiness were sent on 02-27-2025, 03-02-2025, and 03-06-2025.
**System Communications**: Successful prescriber contact made on 02-13-2025 via ERX. Follow-up message sent to prescriber on 02-15-2025.
"""

output = parse_communication(input_text)
print(output)
