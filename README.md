# Conversational CV Builder 🚀

A modern, AI-powered conversational interface designed to extract your best career achievements and automatically generate an ATS-friendly, multi-version Executive CV in PDF format.

## ✨ Features

- **🧠 Conversational AI Architecture**: Chat naturally to build your CV. The AI acts as your Career Architect, using the STAR method (Situation, Task, Action, Result) to extract and polish your technical achievements.
- **📄 Instant ATS-Friendly PDF Generation**: Converts your chat directly into a clean, single-column, ATS-optimized Executive PDF layout using `@react-pdf/renderer`.
- **💾 Multi-Version CV History**: Experiment with different target roles! Save and load multiple iterations of your CV seamlessly with local state management (Redux).
- **🔒 Privacy First**: All chat history and CV data are processed locally via browser APIs.
- **🎨 Extreme Premium UI**: Built with Tailwind CSS, featuring stunning dynamic glassmorphism backgrounds, slick message transitions, and bouncy AI typing indicators.

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **AI Integration**: [Vercel AI SDK](https://sdk.vercel.ai/docs)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
- **PDF Engine**: [@react-pdf/renderer](https://react-pdf.org/)
- **LLM Provider**: [OpenRouter](https://openrouter.ai/) (Powered by `google/gemma-4-26b-a4b-it:free`)

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/lmnzxx/hire-me.git
cd hire-me
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env.local` file in the root directory and add your OpenRouter API Key:
```env
OPENROUTER_API_KEY=your_openrouter_api_key_here
```
*(Don't worry, `.env.local` is included in `.gitignore` so your key won't be pushed to GitHub!)*

### 4. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 💡 How it works

1. Open the app and start chatting with the AI.
2. The AI will ask you targeted questions about your technical experience, achievements, and goals.
3. Once the AI gathers enough information, it automatically generates a structured JSON payload behind the scenes.
4. The frontend intercepts this payload, updates the Redux store, and renders a stunning PDF preview.
5. Click **"Save Version"** to keep this CV variant, or **"Download CV"** to get your PDF immediately.
