# hire-me 🚀

A fast, conversational AI tool that helps you build an ATS-friendly Executive CV just by chatting. No forms, no hassle.

**Live Demo:** [https://hire-me-eosin.vercel.app/](https://hire-me-eosin.vercel.app/)

## Features
- **AI Chatbot**: Talk to the AI casually. It uses the STAR method to extract and polish your professional achievements.
- **ATS-Friendly PDF**: Automatically generates a clean, single-column CV ready for download.
- **Multi-Version Save**: Save and switch between multiple CV versions directly in your browser.
- **Secure**: All data is processed locally. Built-in origin and payload protections prevent API abuse.

## Tech Stack
Next.js 14, Tailwind CSS, Vercel AI SDK, Redux Toolkit, React-PDF, OpenRouter (Gemma-4-26b).

## Run Locally
1. Clone the repo and run `npm install`.
2. Add your OpenRouter API key in `.env.local`: `OPENROUTER_API_KEY=your_key_here`
3. Run `npm run dev`.
