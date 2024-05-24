import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { hgetKv } from "@/api/kvUtils";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Name", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        console.log(credentials, "credentials");
        try {
          const correctPassword = await hgetKv("users", credentials.username);
          if (correctPassword === credentials.password) {
            return { name: credentials.username, email: credentials.username };
          } else {
            return null;
          }
        } catch (error) {
          console.log(error, "error");
          return null;
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
