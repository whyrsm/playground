# Gmail Summarizer

A NestJS application that integrates with Gmail and OpenAI to provide email summaries.

## Features

- Gmail Integration using Google OAuth2
- Email fetching and parsing
- Email summarization using OpenAI's GPT-3.5
- Date-based email filtering

## Prerequisites

- Node.js and npm installed
- Google Cloud Platform account with Gmail API enabled
- OpenAI API key
- Environment variables set up (see below)

## Environment Variables

Create a `.env` file in the root directory with the following variables:
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=your_google_redirect_uri
OPENAI_API_KEY=your_openai_api_key
