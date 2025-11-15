import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Admin Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Verify username and password against your env values
        if (
          credentials.username === process.env.ADMIN_USERNAME &&
          credentials.password === process.env.ADMIN_PASSWORD
        ) {
          return {
            id: 1,
            name: "Admin User",
            email: "admin@example.com",
            isAdmin: true,
          };
        }
        return null;
      },
    }),
  ],
  session: { strategy: "jwt" },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.isAdmin = user.isAdmin;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id,
        name: token.name,
        email: token.email,
        isAdmin: token.isAdmin,
      };
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Always redirect to admin dashboard after successful login if no specific callbackUrl
      if (url === baseUrl) {
        return `${baseUrl}/admin`;
      }
      // Allows redirecting to a specific callbackUrl if it's within the base URL
      if (url.startsWith(baseUrl)) {
        return url;
      }
      // Fallback to admin if the URL is external or unexpected
      return `${baseUrl}/admin`;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/signin", // points to our custom sign-in page
    error: "/?error=Authentication%20failed",
  },
  url: process.env.NEXTAUTH_URL, // Explicitly set NEXTAUTH_URL
};

export default NextAuth(authOptions);
