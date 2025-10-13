# Let Me Ask Agents - Server

## Overview

A Node.js API server that enables AI-powered question answering based on audio content. Users can upload audio files to rooms, and the system uses Google's Gemini AI to transcribe the audio and answer questions based on the transcribed content using semantic search and vector embeddings.

## Features

- **Room Management**: Create and manage question rooms
- **Audio Processing**: Upload and transcribe audio files using Gemini AI
- **Semantic Search**: Find relevant audio content using vector embeddings
- **AI-Powered Q&A**: Generate contextual answers based on transcribed audio content
- **RESTful API**: Clean HTTP endpoints with validation and type safety
- **Vector Database**: PostgreSQL with pgvector for similarity search

## Tech Stack

- **Runtime**: Node.js with TypeScript (experimental strip-types)
- **Framework**: Fastify with Zod validation
- **Database**: PostgreSQL with pgvector extension
- **ORM**: Drizzle ORM with migrations
- **AI Services**: Google Gemini AI (transcription, embeddings, text generation)
- **Development**: Biome for linting and formatting

## Setup

### Prerequisites

- Node.js (latest version with experimental TypeScript support)
- Docker and Docker Compose
- Google Gemini API key

### Installation

1. Clone the repository:

```bash
git clone https://github.com/massucattoj/server-qa-agent
cd server-qa-agent
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
PORT=3333
DATABASE_URL=postgresql://docker:docker@localhost:5432/agents
GEMINI_API_KEY=your_gemini_api_key_here
JWT_SECRET=your_super_secret_jwt_key_that_is_at_least_32_characters_long
```

4. Start the database:

```bash
docker-compose up -d
```

5. Run database migrations:

```bash
npm run db:migrate
```

6. (Optional) Seed the database:

```bash
npm run db:seed
```

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm start` - Start production server
- `npm run db:generate` - Generate database migrations
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with sample data

## API Endpoints

### Rooms

- `GET /rooms` - List all rooms
- `POST /rooms` - Create a new room

### Questions

- `GET /rooms/:roomId/questions` - Get questions for a room
- `POST /rooms/:roomId/questions` - Ask a question and get AI-generated answer

### Audio

- `POST /rooms/:roomId/audio` - Upload audio file for transcription

### Health

- `GET /health` - Health check endpoint

## Database Schema

- **rooms**: Store question rooms with name and description
- **questions**: Store user questions and AI-generated answers
- **audio_chunks**: Store transcribed audio with vector embeddings

## Development

The server runs on port 3333 by default and accepts CORS requests from `http://localhost:5173` (frontend development server).

For API testing, see `client.http` for example requests.
