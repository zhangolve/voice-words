import { Inter } from "next/font/google";
import "./globals.css";
import Menu from "./menu";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "voice words",
  description: "learn english by audio sentence",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Menu />
        {children}
      </body>
    </html>
  );
}
