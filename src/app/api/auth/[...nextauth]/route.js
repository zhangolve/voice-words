import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { hgetKv } from "@/api/kvUtils";
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();


export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Name", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          // const result = await redis.hget("users",credentials.username);
          // console.log(result, "result");
          // const correctPassword = await hgetKv("users", credentials.username);
          
          if (credentials.username == 'zhangolve' && credentials.password === '123456') {
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
