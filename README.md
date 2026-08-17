# Access AI - Accessibility Assistant ♿🤖

Access AI is a highly empathetic, full-stack accessibility assistant designed to help users understand their surroundings, documents, and posters. By leveraging Google Gemini AI, it analyzes images and provides simplified, easy-to-understand descriptions tailored to users of all cognitive levels.

## 🌟 Features

- **Image & Document Analysis:** Upload images of places, posters, or documents, and receive simplified, context-aware descriptions.
- **Personalized Accessibility Profiles:** Users can define their specific accessibility needs and preferred language, ensuring the AI's output is always appropriately formatted.
- **Multilingual Support:** Receive explanations and descriptions in your preferred language.
- **Smart Categorization:** Automatically determines whether an image is a place (providing travel/weather tips), a poster (extracting event info/target audience), or a document (summarizing key points).
- **History Tracking:** Securely saves your past analyses in your dashboard for easy retrieval.
- **Modern UI:** A beautiful, responsive frontend built with React, Tailwind CSS, and Framer Motion, featuring a 3D animated workspace.

## 🛠️ Technology Stack

**Frontend (Client):**
- React 19
- Vite
- Tailwind CSS v4
- Framer Motion (Animations)
- React Three Fiber & Drei (3D Canvas)
- React Router DOM
- Axios

**Backend (Server):**
- Node.js & Express.js
- Google Generative AI (Gemini API)
- SQLite (Database)
- JSON Web Tokens (Authentication)
- Multer (Image uploads)
- bcrypt (Password hashing)

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- A [Google Gemini API Key](https://aistudio.google.com/app/apikey)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/dhruvpranay11/Access_AI.git
   cd Access_AI
   ```

2. **Setup the Backend Server**
   ```bash
   cd server
   npm install
   ```
   Create a `.env` file in the `server` directory and add your environment variables:
   ```env
   PORT=5000
   GEMINI_API_KEY=your_gemini_api_key_here
   JWT_SECRET=your_jwt_secret_here
   ```
   Start the backend development server:
   ```bash
   node index.js
   ```
   *The server will run on http://localhost:5000 and automatically initialize the SQLite database.*

3. **Setup the Frontend Client**
   Open a new terminal window/tab:
   ```bash
   cd client
   npm install
   ```
   Start the frontend development server:
   ```bash
   npm run dev
   ```
   *The client will run on http://localhost:3000.*

## 📁 Project Structure

```text
Access_AI/
├── client/                 # Frontend React Application
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── api/            # Axios API configurations
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # React Context (Auth)
│   │   └── pages/          # Application routes
│   ├── package.json
│   └── vite.config.js
└── server/                 # Backend Node.js Application
    ├── db/                 # SQLite database initialization
    ├── middleware/         # Express middlewares (auth)
    ├── routes/             # API Endpoints (ai, auth, history, users)
    ├── index.js            # Server entry point
    └── package.json
```

## 📝 License

This project is licensed under the ISC License.
