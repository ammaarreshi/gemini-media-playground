# Gemini AI Playground

A beautiful web application that allows you to generate and edit images using Google's Gemini 2.0 Flash Experimental API.

## Features

- Generate images from text prompts using Gemini API
- Upload and edit existing images
- Interactively modify generated images with text prompts
- Download generated images
- Modern and clean UI built with Next.js and shadcn/ui

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file in the root directory with your Gemini API key:
   ```
   NEXT_PUBLIC_GEMINI_API_KEY=your_api_key_here
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## How it Works

The app uses the Gemini 2.0 Flash Experimental API to generate and edit images.

### Generating Images

1. Enter a text prompt in the input field
2. Click "Generate" to create an image based on your prompt

### Editing Images

There are two ways to edit images:

1. Upload an existing image and provide a prompt to modify it
2. Edit a previously generated image by clicking "Edit Image" and providing a new prompt

## Technologies Used

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Google Generative AI SDK

## License

MIT
