import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    // 可以在这里添加额外的逻辑
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  },
);

export const config = {
  matcher: [
    // 排除不需要认证的 API 路由
    "/((?!api/public|api/webhook|api/tts|api/translate|_next/static|_next/image|favicon.ico).*)",
  ],
};
