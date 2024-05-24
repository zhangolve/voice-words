// import { authenticate } from "@/services/authService";
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
        return { id: 1, name: "J Smith", email: "jsmith@example.com" };
        // return { name: credentials.username, email: credentials.username };
        // try {
        //   const correctPassword = await hgetKv("users", credentials.username);
        //   // const correctPassword = result.json();
        //   console.log(correctPassword, credentials.password, "correctPassword");
        //   if (correctPassword === credentials.password) {
        //     console.log("00000");
        //     return { name: credentials.username, email: credentials.username };
        //   } else {
        //     return null;
        //   }
        // } catch (error) {
        //   console.log(error, "error");
        //   return null;
        // }
      },
    }),
  ],
  // session: { strategy: "jwt" },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
