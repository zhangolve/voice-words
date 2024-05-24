import { Inter } from "next/font/google";
import Provider from "@/app/context/client-provider";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import "./globals.css";
import Menu from "./menu";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "voice words",
  description: "learn english by audio sentence",
};

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider session={session}>
          <Menu />
          {children}
        </Provider>
      </body>
    </html>
  );
}
