# Eventify: The Student-Focused Event Management Platform

🎓 **Project Overview**

Eventify is a modern, full-stack event management and ticketing platform designed to connect university students and event organizers. It simplifies the process of creating, discovering, and attending campus events. This project serves as a comprehensive example of a production-ready application, incorporating robust authentication, secure payment processing, and a scalable data architecture.

## 🤔 The Problem & Our Solution

### Problem for Students
Campus event information is often scattered across different social media groups, email lists, and bulletin boards, making it difficult to find relevant activities. The process of buying tickets can be clunky, insecure, or rely on cash-only payments.

### Problem for Organizers
Creating, promoting, and managing tickets for an event can be a manual and time-consuming process. Tracking attendees, handling payments, and communicating with participants lacks a centralized tool.

### Eventify's Solution
We provide a single, unified platform where event organizers can effortlessly create and promote events, handle secure online payments via Stripe, and manage their attendee list. For students, Eventify offers a centralized, searchable hub to discover events, pay for tickets securely, and even get instant information through an AI-powered chatbot. This creates a more efficient, engaging, and secure ecosystem for the entire campus community.

## 🚀 Key Features

### For Students
- **Centralized Event Discovery**: A dynamic and filterable feed to browse all upcoming campus events.
- **Secure Authentication**: Seamless and fast sign-up/login using Clerk and Google OAuth.
- **Integrated Payments**: Secure, reliable, and instant ticket purchases powered by Stripe.
- **AI-Powered Chatbot**: An intelligent assistant, powered by Google's Gemini AI, that can answer event-related questions, provide event summaries, and help with discovery.
- **Personalized Profile**: A dedicated dashboard to view all past and upcoming ticket purchases and organized events.
- **Responsive & Accessible Design**: A mobile-first UI built with Tailwind CSS that ensures a smooth experience on any device.

### For Organizers & Admins
- **Event Creation Form**: A user-friendly, validated form to create and publish new events with all necessary details.
- **Media Management**: Effortless image uploads for event posters using UploadThing.
- **Real-Time Data Sync**: Webhooks integration with Clerk and Stripe to ensure user and order data is always up-to-date.
- **Event Management Tools**: The ability to edit or delete events, with a simple view to see all orders for a specific event.

## 💻 Technology Stack & Architecture

Eventify is built as a monolithic application using the Next.js App Router. This provides a full-stack, server-side-rendered experience that is fast and SEO-friendly.

### Tech Stack
- **Frontend**: Next.js, React, Shadcn UI, Tailwind CSS
- **Authentication**: Clerk
- **Backend**: Next.js Server Actions, MongoDB (via Mongoose), Node.js
- **Payment Gateway**: Stripe
- **AI**: Google Gemini AI
- **File Uploads**: UploadThing
- **Validation**: Zod with React Hook Form
- **State Management**: React's built-in state management and URL query parameters for server-side state


### High-Level Architecture

```
+----------------+
|  User (Client) |
+----------------+
      |
      |   Request (e.g., /events, /profile)
      V
+-----------------------------------+
| Next.js App Router (Server)       |
|                                   |
| - Pages: / , /events/[id], /profile|
| - Server Actions: createEvent()   |
| - API Routes: /api/...            |
+-----------------------------------+
      |
      |   (API Calls, Database Queries)
      V
+----------------+  +----------------+  +----------------+  +-----------------+
|   MongoDB      |  |     Clerk      |  |     Stripe     |  |   Gemini AI     |
| (via Mongoose) |  | (Auth/Webhooks)|  | (Payments)     |  | (Chatbot)       |
+----------------+  +----------------+  +----------------+  +-----------------+
```

The architecture is designed to be clear and modular, with dedicated folders for components, server actions, database models, and API routes. This separation of concerns makes the codebase easy to navigate and understand for new contributors.

## 📦 Codebase Structure

The project follows a standard Next.js directory structure, with a clear separation of concerns.

```
├── app/
│   ├── (auth)/             # Authentication pages (sign-in, sign-up)
│   ├── (root)/             # Main application pages (home, events, profile)
│   ├── api/                # API routes for webhooks, chatbot, and file uploads
│   ├── globals.css         # Global CSS styles
│   └── layout.tsx          # Root layout for the application
├── components/
│   ├── shared/             # Reusable, custom components (Header, Footer, EventForm, etc.)
│   └── ui/                 # Shadcn UI components
├── constants/
│   └── index.ts            # Global constants and default values
├── lib/
│   ├── actions/            # Server actions for database operations
│   ├── database/           # MongoDB connection and Mongoose models
│   ├── uploadthing.ts      # UploadThing utilities
│   ├── utils.ts            # General utility functions
│   └── validator.ts        # Zod schemas for validation
├── public/                 # Static assets (images, icons)
├── types/
│   └── index.ts            # TypeScript type definitions
├── middleware.ts           # Clerk authentication middleware
├── next.config.js          # Next.js configuration
├── postcss.config.js       # PostCSS configuration
├── tailwind.config.ts      # Tailwind CSS configuration
├── package.json            # Project dependencies and scripts
└── tsconfig.json           # TypeScript configuration
```


## 🤝 How to Contribute

We are a community that values intellectual honesty and rigorous problem-solving. We expect contributors to not just write code, but to understand the "why" behind their solutions. If you find a flaw in our logic or a better approach, we want to hear about it and will prioritize truth over agreement.

### Getting Started

#### 1. Fork and Clone
Fork the repository on GitHub and then clone your fork locally.

```bash
git clone https://github.com/your-username/eventify.git
cd eventify
```

#### 2. Install Dependencies
Install the required packages.

```bash
npm install
```

#### 3. Configure Environment
Set up the necessary environment variables in a `.env.local` file.

Follow the example below to populate your `.env.local`.

> **Note**: For webhooks, you will need to use a tool like ngrok to expose your local server to receive webhook payloads from Clerk and Stripe.

```env
MONGODB_URI=

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
WEBHOOK_SECRET=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

UPLOADTHING_SECRET=
UPLOADTHING_APP_ID=

STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

NEXT_PUBLIC_SERVER_URL="http://localhost:3000"

GEMINI_API_KEY=

# Email (for future features like order confirmation)
EMAIL_USER=
EMAIL_PASS=
```

#### 4. Run the App
Start the development server.

```bash
npm run dev
```

Your application will be running at `http://localhost:3000`.

#### 5. Find an Issue
Look for an open issue that interests you on our GitHub Issues page. Feel free to ask questions and discuss solutions before you start coding.

#### 6. Create a Pull Request
Submit your changes via a pull request to our main branch. Ensure your code is well-commented and your PR description clearly explains what you've done and why.