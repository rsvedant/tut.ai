import requests

# Make a request with stream=True parameter
response = requests.post("https://dev.the-untraceable.xyz/api/chats/123", stream=True, json={
    "message": "Explain to me in great detail how to use the requests library in Python.",
})

# Option 1: Process chunk by chunk (good for binary data like files)
for chunk in response.iter_content(chunk_size=1024):
    if chunk:  # filter out keep-alive new chunks
        ...
        # Process each chunk
        # print(f"Received {len(chunk)} bytes")
        # process_data(chunk)
        #  Print the data
        # print(chunk)

# # Option 2: Process line by line (good for newline-delimited data like JSON Lines)
# for line in response.iter_lines(decode_unicode=True):
#     if line:
#         # Process each line
#         print(line)
#         # process_line(line)

# # Option 3: Write directly to a file
# with open("downloaded_file.mp4", "wb") as f:
#     for chunk in response.iter_content(chunk_size=8192):
#         f.write(chunk)

# Don't forget to close the connection when done
response.close()
