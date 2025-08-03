// check-env.js
// This script checks if all necessary environment variables are set.

// Load environment variables from .env.local
// Ensure 'dotenv' is installed: npm install dotenv
require('dotenv').config({ path: '.env.local' });

const requiredEnvVars = [
  "MONGODB_URI",
  "NEXT_PUBLIC_CLERK_SIGN_IN_URL",
  "NEXT_PUBLIC_CLERK_SIGN_UP_URL",
  "NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL",
  "NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL",
  "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
  "CLERK_SECRET_KEY",
  "WEBHOOK_SECRET",
  "UPLOADTHING_SECRET",
  "UPLOADTHING_APP_ID",
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
  "NEXT_PUBLIC_SERVER_URL",
  "GEMINI_API_KEY",
  // "EMAIL_USER", // Optional for basic functionality, uncomment if critical
  // "EMAIL_PASS"  // Optional for basic functionality, uncomment if critical
];

const missingVars = [];
const undefinedValues = [];

requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar]) {
    missingVars.push(envVar);
  } else if (process.env[envVar].trim() === '') {
    undefinedValues.push(envVar);
  }
});

if (missingVars.length > 0 || undefinedValues.length > 0) {
  console.error("\n========================================================");
  console.error("  🚨 ENVIRONMENT VARIABLE SETUP WARNING 🚨");
  console.error("========================================================\n");

  if (missingVars.length > 0) {
    console.error("The following REQUIRED environment variables are MISSING from your .env.local file:");
    missingVars.forEach(v => console.error(`- ${v}`));
  }

  if (undefinedValues.length > 0) {
    console.error("\nThe following REQUIRED environment variables are PRESENT but have UNDEFINED/EMPTY values:");
    undefinedValues.forEach(v => console.error(`- ${v}`));
  }

  console.error("\n--------------------------------------------------------");
  console.error("Please refer to the `⚡ Getting Started` section in `README.md`");
  console.error("for detailed instructions on how to obtain and set these values.");
  console.error("Ensure `http://localhost:3000` is set for `NEXT_PUBLIC_SERVER_URL` in development.");
  console.error("--------------------------------------------------------\n");
  process.exit(1); // Exit with an error code
} else {
  console.log("\n✅ All essential environment variables are set! You're ready to `npm run dev`.\n");
}