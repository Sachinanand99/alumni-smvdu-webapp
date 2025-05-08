import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import connectMongo from "@/lib/db";
import UserModel from "@/models/User";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.AUTH_GOOGLE_SECRET,
  callbacks: {
    async signIn({ user, account }) {
      await connectMongo();

      const isBCSEmail = /\d{2}bcs\d{3}@smvdu\.ac\.in$/i.test(user.email);
      if (!isBCSEmail) {
        throw new Error("Only BCS students are allowed.");
      }

      const existingUser = await UserModel.findOne({ personalEmail: user.email });

      if (!existingUser) {
        await UserModel.create({
          universityEmail: user.email,
          personalEmail: user.email,
          name: user.name,
          profilePicture: user.image,
          provider: account.provider,
        });
      }

      return true;
    },

    async session({ session, token }) {
      session.user.id = token.sub;
      return session;
    },

    async redirect({ url, baseUrl }) {
      return `${baseUrl}/profile-setup`;
    },
  },
  pages: {
    signOut: "/",
    error: "/auth/login",
    newUser: "/profile/profile-setup",
    signIn: "/auth/login",
  },
});
