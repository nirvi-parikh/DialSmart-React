@st.cache_data(show_spinner=False)

def get_summary(df, prompt="notes_summary"):

    # try:

    load_dotenv()
    azure_key = os.getenv("AZURE_KEY")
    endpoint_url = os.getenv("ENDPOINT_URL")
    deployment_name = os.getenv("DEPLOYMENT_NAME")
    os.environ["AZURE_TENANT_ID"] = AZURE_TENANT_ID # Get From vault
    os.environ["AZURE_CLIENT_ID"] = AZURE_CLIENT_ID # Get From vault
    os.environ["BASE_URL"] = endpoint_url  # Get From vault
    os.environ["DEPLOYMENT_NAME"] = deployment_name
    os.environ["AZURE_CLIENT_SECRET"] = azure_key ## Required with client secret connection instead of certi
    credential = DefaultAzureCredential()
    os.environ["OPENAI_API_TYPE"] = "azure_ad"   # Since AD Group Authentication, keep it azure_ad
    os.environ["API_VERSION"] = "2023-05-15"  # Get From vault
    os.environ["OPENAI_API_KEY"] = credential.get_token(https://cognitiveservices.azure.com/.default).token
    open_api_key = os.environ.get("OPENAI_API_KEY")
    open_api_base=os.environ.get("BASE_URL")
    deployment_name=os.environ.get("DEPLOYMENT_NAME")
    open_api_version=os.environ.get("API_VERSION")
    api_version = "2023-05-15"
    client = az(
        api_version=api_version,
        azure_endpoint=open_api_base,
        api_key = open_api_key
    )

    if prompt == "notes_summary2":

        messages = [

            {"role": "system",
                "content": """You are a helpful medical assistant summarizing patient data and notes for a patient call representative to know before they call the patient.
                Keep your response within 150 words and highlight important text.
                Make response structured and easy top read. Never show patient's name, phone number or email in your responses.""",},
            {
                "role": "user",
                "content": """Create a detailed summary of these patient notes, focusing on the patient's current medications, any changes in their treatment plan, adherence to medications, insurance or finance related information.
                Highlight important pieces that are useful for the call rep to know.
                A patient rep should be able to quickly glance over this and understand the trends rather than reading through lots of text: """
                + data,
            },

        ]

    elif prompt == "data_insights":

        with st.spinner(f"""Generating trends summary..."""):

            json_object = json.loads(df.to_json(orient='records'))

            data = ', '.join(f'{k}: {v}' for d in json_object for k, v in d.items())

            messages = [
                {
                    "role": "user",
                    "content": """Has the patient adherence improved? Are there any refills left? Is the patient digitally registered and filling manually?
                    Keep it less verbose within 100 words and easy to read with bullet points. Highlight each section of answer for above questions.
                    Summarize each answer section in couple of lines.
                    A patient rep should be able to quickly glance over this and understand the trends rather than reading through lots of text: """
                    + data,
                },
            ]

            completion = client.chat.completions.create(
                model=deployment_name,  
                messages=messages,
                temperature=0.2,
            )
            summary=completion.choices[0].message.content
            summary = re.sub(r'^-', '\n* ', summary, flags=re.MULTILINE)
            return summary

    prompt_labels = ["General Summary by Topic",]

    system_messages = [
        "You are a helpful assistant summarizing patient notes to assist call representatives in encouraging non-adherent or predicted non-adherent patients to refill their specialty pharmacy prescriptions. "
        "Organize the summary into the following sections in this specific order:\n\n"
        "1. **Significant Details**: Highlight key facts, blockers preventing the patient from refilling their prescription, or potential future blockers. Also, note if/when these blockers are resolved, using a clear chronology within the relevant section.\n"
        "2. **Rx Info**: Include relevant prescription information.\n"
        "3. **Prescription Benefit Verification (BV) Info**: Clearly specify outcomes like 'Approved,' 'Denied,' etc., and provide reasons for any denial if noted.\n"
        "4. **Billing/Invoice**: Summarize any relevant billing and invoice details.\n"
        "5. **General Updates**: Provide any other notable updates about the patient's case.\n"
        "6. **Communication**: Organize this into sub-sections for:\n"
        "   - **Calls**\n"
        "   - **Refill Reminders**\n"
        "   - **System Communications**\n\n"
        "Within each relevant section, use a chronological format to highlight details about anything blocking or allowing the patient to refill their prescription. "
        "Keep the summary concise, under 150 words, and ensure that no personal health information (PHI) is included."
    ]

    user_prompts = [
        "Summarize the following patient notes, organizing them into the sections **Significant Details**, **Rx Info**, **Prescription Benefit Verification (BV) Info**, **Billing/Invoice**, **General Updates**, "
        "and **Communication** (with sub-sections for calls, refill reminders, and system communications).\n\n"
        "1. In the **Significant Details** section, call out any blockers currently preventing the patient from refilling their prescription or any potential blockers in the future. "
        "Note if/when these blockers are resolved, showing a clear chronology if available.\n"
        "2. In the **Prescription Benefit Verification (BV) Info** section, specify outcomes like 'Approved' or 'Denied.' If denied, share the reason for denial if available.\n"
        "3. Within other sections, use a chronological format to indicate any factors impacting the patient's ability to refill.\n"
        "4. Highlight any issues related to adherence, missed refills, and communication about refills.\n"
        "5. Exclude any personal information like names, phone numbers, and emails. Keep the summary concise and under 150 words: {notes}."
    ]

 

    # Get the unique patient IDs

    patient_ids = df['spclt_ptnt_gid'].unique()

 

    # Create an empty DataFrame to store the results

    df_results = pd.DataFrame(columns=['spclt_ptnt_gid', 'notes', 'summary', 'prompt_type', 'text_reduced', 'cut_text'])

 

    # Loop over the patient IDs

    for patient_id in patient_ids:

        # Filter the DataFrame for the current patient
        df_patient = df[df['spclt_ptnt_gid'] == patient_id]

        # Concatenate the notes into a single string
        notes = df_patient['notes'].str.cat(sep='\n')

        # Loop over the system messages and user prompts
        for system_message, user_prompt, prompt_type in zip(system_messages, user_prompts, prompt_labels):
            with st.spinner(f"""{prompt_type}..."""):
                try:
                    # Make a request to the ChatGPT API
                    response = client.chat.completions.create(
                    model=deployment_name,
                    messages=[
                            {"role": "system", "content": system_message},
                            {"role": "user", "content": user_prompt.format(notes=notes)},
                        ]
                    )

                    text_reduced = False

                    cut_text = ''

                except:

                    # Reduce the length of the notes if the API call fails due to length

                    cut_text = notes[10000:]  # Save the text that was cut out (4096 character limit)

                    notes = notes[:10000]

                    response = client.chat.completions.create(

                    model=deployment_name,

                    messages=[

                            {"role": "system", "content": system_message},

                            {"role": "user", "content": user_prompt.format(notes=notes)},

                        ]

                    )

                    text_reduced = True

 

                # Get the summary

                summary = response.choices[0].message.content

 

                # Create a new DataFrame for the current patient and concatenate it with the results DataFrame

                df_current = pd.DataFrame({'spclt_ptnt_gid': [patient_id], 'notes': [notes], 'summary': [summary], 'prompt_type': [prompt_type], 'text_reduced': [text_reduced], 'cut_text': [cut_text]})

                df_results = pd.concat([df_results, df_current], ignore_index=True)

    return df_results, notes