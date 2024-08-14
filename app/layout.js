import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "PantryPro",
  description: "This AI web application is designed to track and organize your pantry and provide recipes based on what you already have. Built with advanced machine learning techniques, it offers insightful a variety of step-by-step recipes. Whether you’re seeking to track your pantry or need recipe ideas, this AI applcation is here to help!",
  metadataBase: new URL("https://pantrypro.vercel.app/"),
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
