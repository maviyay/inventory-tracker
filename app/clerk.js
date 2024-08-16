// lib/clerk.js
import { ClerkProvider } from '@clerk/nextjs';

const clerkConfig = {
  apiKey: process.env.NEXT_PUBLIC_CLERK_FRONTEND_API,
};

export const ClerkProviderComponent = ({ children }) => (
  <ClerkProvider
    frontendApi={clerkConfig.apiKey}
    navigate={(to) => window.location.assign(to)}
  >
    {children}
  </ClerkProvider>
);
