# Social Media Service Agent

A web-based AI agent that allows users to search for social media services using natural language queries.

## Features

- Search for services across multiple social media platforms
- Filter by criteria like "cheapest" or "fastest"
- Get detailed information about each service
- Responsive design that works on mobile and desktop

## How to Use

1. Enter a query in the search box (e.g., "cheapest Instagram likes", "YouTube subscribers")
2. Click Search or press Enter
3. View the matching services with their complete details

## Examples of Searches

- "Cheapest Instagram views"
- "Fastest YouTube subscribers"
- "TikTok followers"
- "Instagram likes with best quality"
- "Facebook page likes"

## Local Development

To run this application locally:

```bash
git clone https://github.com/ngmodz/agent.git
cd agent
python -m http.server
```

Then open http://localhost:8000 in your browser.

## Data

The service data is parsed from `services.md` using the included `parser.py` script, which generates `services.json`. 