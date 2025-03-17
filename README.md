# Gemini Media Playground

A powerful and intuitive web application that leverages Google's Gemini 2.0 Flash Experimental API to generate, edit, and enhance images through AI. With a modern, chat-like interface, this playground makes it easy to explore Gemini's creative capabilities.

![Screenshot 2025-03-17 at 18 44 37](https://github.com/user-attachments/assets/93bcd047-3196-4d9f-a266-fb819c15f4fd)


## Key Features

### 🖼️ Image Generation

- Generate high-quality images from detailed text prompts
- Real-time visualization of generation progress
- Flexible customization options for aspect ratio and image quality
- Support for various artistic styles and visual concepts

### 🎬 Video Generation

- Create stunning videos from text prompts using fal.ai
- Transform still images into dynamic video sequences
- Control video duration and stylistic elements
- Seamless integration with the chat interface

### 🔄 Native Image Editing

- Edit generated images directly within the application using natural language prompts
- Transform existing images by uploading and describing desired changes
- Apply complex visual modifications without technical expertise
- Chain multiple edits to refine images progressively

### 💬 Conversational Interface

- Chat-like experience with message history
- Interactive prompt suggestions to help you get started
- Support for both text and image-based conversations
- Clean UI with Google Sans font for enhanced readability

### 📱 Responsive Design

- Optimized layout for both desktop and mobile devices
- Consistent user experience across different screen sizes
- Compact and intuitive controls

## Setup Instructions

### Prerequisites

- Node.js version ^18.18.0 or ^19.8.0 or >= 20.0.0
- npm or yarn package manager
- Gemini API key from Google AI Studio
- fal.ai API key for video generation

### Installation

1. Clone the repository

   ```bash
   git clone https://github.com/ammaarreshi/gemini-media-playground.git
   cd gemini-media-playground
   ```

2. Install dependencies

   ```bash
   npm install
   # or
   yarn install
   ```

3. **API Key Configuration**
   Create a `.env.local` file in the root directory with your API keys:

   ```
   NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
   NEXT_PUBLIC_FAL_KEY=your_fal_ai_key_here
   ```

   > **Note:** To obtain a Gemini API key:
   >
   > 1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   > 2. Create or sign in to your account
   > 3. Navigate to the API Keys section
   > 4. Generate a new API key
   > 5. Copy the key and paste it into your `.env.local` file
   >
   > **To obtain a fal.ai API key:**
   >
   > 1. Visit [fal.ai](https://www.fal.ai/)
   > 2. Create an account or sign in
   > 3. Navigate to the API Keys section in your dashboard
   > 4. Generate a new API key
   > 5. Copy the key and add it to your `.env.local` file

4. Start the development server

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## How to Use

### Generating Images

1. Type a detailed prompt describing the image you want to create
   - Example: "A serene mountain landscape with a crystal clear lake at sunset, with reflections in the water"
2. Click the send button or press Enter
3. Wait for Gemini to process and generate your image
4. The generated image will appear in the chat thread

### Generating Videos

1. Type a prompt that includes video generation intent
   - Example: "Generate a video of a spaceship flying through an asteroid field"
   - Or: "Turn this image into a video of waves crashing" (when an image is attached)
2. Click the send button or press Enter
3. Wait for fal.ai to process your request and generate the video
4. The generated video will appear in the chat thread and can be played directly

### Editing Images

1. **From scratch:**

   - Upload an image using the attachment button
   - Enter a prompt describing the changes you want
   - Example: "Make the sky more dramatic with storm clouds"

2. **Edit generated images:**
   - After generating an image, click on it
   - Enter your editing prompt
   - Gemini will modify the image while preserving key elements

### Tips for Best Results

- Be specific in your prompts
- Include details about style, mood, lighting, and composition
- For edits, clearly state what should change and what should stay the same
- For videos, specify movement, timing, and transitions
- Try different phrasings if you don't get the result you want

## Technical Details

### Technology Stack

- **Frontend:** Next.js, React, TypeScript
- **Styling:** Tailwind CSS, shadcn/ui components, Google Sans font
- **AI Integration:**
  - Google Generative AI SDK for image generation and editing
  - fal.ai API for video generation
- **Build Tools:** Turbopack for faster development

### Architecture

The application follows a modern React architecture with:

- Server components for improved performance
- Client components for interactive elements
- Stateful chat management
- Optimized media handling

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
