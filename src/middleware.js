export { default } from "next-auth/middleware";
// import { getSession } from "next-auth/react";
// import { withAuth } from "next-auth/middleware";
// export default withAuth({
//   callbacks: {
//     authorized: async ({ token, req }) => {
//       const requestForNextAuth = {
//         headers: {
//           cookie: req.headers.get("cookie"),
//         },
//       };
//       console.log(token, "token");
//       return !!token;
//     },
//   },
// });
