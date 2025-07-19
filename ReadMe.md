## 📌 Project Overview

The *Event Management - Student Portal* is a modern, user-friendly platform designed to streamline event management for students and organizers alike. Built for a hackathon, this project empowers students to explore events, purchase tickets securely, and interact with an AI-powered chatbot, while providing organizers with robust tools to create and manage events effortlessly.

---

## 🚀 Features

### 🎓 Student Features
- *🔍 Explore Events*: Browse a comprehensive list of upcoming events.
- *✅ Google Login*: Secure and seamless authentication using Google OAuth.
- *💰 Stripe Payment*: Fast, safe, and reliable ticket purchases via Stripe.
- *🤖 Chatbot Support*: Instant answers to event-related queries with an AI-powered chatbot.
- *📜 View Past Events*: Track previous purchases and access ticket details.
- *📏 Pagination*: Smooth, paginated event listings for an enhanced browsing experience.

### 🎟 Organizer/Admin Features
- *📅 Create Events*: Easily add and manage new events.
- *🔗 Webhooks Integration*: Real-time updates for events and payments.
- *📤 UploadThing*: Simplified media uploads for event promotion.

---

## 🛠 Technologies Used

- *⚛ Next.js*: Fast and efficient frontend framework.
- *🔐 Google OAuth*: Secure user authentication.
- *💳 Stripe*: Reliable payment processing.
- *🤖 Gemini AI*: AI-powered chatbot for enhanced interaction.
- *📜 Pagination*: Optimized event listing navigation.
- *📂 UploadThing*: Seamless file upload management.
- *🔄 Webhooks*: Real-time synchronization for events and payments.

---

## ⚡ Getting Started

Follow these steps to set up the project locally:

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/sidsbgithub/eventify.git
cd eventify

2️⃣ Install Dependencies

npm install
3️⃣ Set Up Environment Variables
Create a .env.local file in the root directory and add the following variables:

makefile


MONGODB_URI=

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
WEBHOOK_SECRET=

UPLOADTHING_SECRET=
UPLOADTHING_APP_ID=

STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

NEXT_PUBLIC_SERVER_URL="http://localhost:3000"
GEMINI_API_KEY=
EMAIL_USER=
EMAIL_PASS=
4️⃣ Start the Development Server
npm run dev
The app will be accessible at http://localhost:3000.

📦 Code Structure
📦 event-management-student
├── 📂 components      # Reusable UI components
├── 📂 pages           # Application pages
├── 📂 utils           # Helper functions
├── 📂 hooks           # Custom React hooks
├── 📂 public          # Static assets
├── 📂 styles          # Global styles
├── 📄 .env.local      # Environment variables
├── 📄 package.json    # Dependencies and scripts
└── 📄 README.md       # Project documentation