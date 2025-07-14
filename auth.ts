import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import connectDB from "@/lib/mongodb";
import UserModel from "@/MongoDb/models/User";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google,
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDB();

        const user = await UserModel.findOne({ personalEmail: credentials.email });

        if (!user || !user.password) {
          // throw new Error("No user found with this email");
          return null;
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordValid) {
          throw new Error("Invalid password");
        }

        return {
          id: user._id,
          name: user.name,
          email: user.personalEmail,
          image: user.profilePicture,
        };
      },
    }),
  ],
  secret: process.env.AUTH_GOOGLE_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24, // 24 hours
  },
  callbacks: {
    async signIn({ user, account }) {
      await connectDB();

      const existingUser = await UserModel.findOne({
        $or: [
          { universityEmail: user.email },
          { personalEmail: user.email },
        ],
      });

      if (existingUser) {
        // Check if they never completed profile setup
        const needsSetup =
            existingUser.personalEmail === existingUser.universityEmail &&
            account.provider === "google";

        if (needsSetup) return true; // allow sign in, force setup via session
        return true;
      }

      // First-time Google login
      if (account.provider === "google") {
        const isBCSEmail = /\d{2}bcs\d{3}@smvdu\.ac\.in$/i.test(user.email);
        if (!isBCSEmail) {
          throw new Error("Only BCS students are allowed.");
        }

        await UserModel.create({
          universityEmail: user.email,
          personalEmail: user.email, // Defaulted to same until updated
          name: user.name,
          profilePicture: user.image,
          provider: account.provider,
        });

        return true;
      }

      return false;
    },

    async jwt({ token, account, profile }) {
      if (account && profile) {
        const user = await UserModel.findOne({
          $or: [
            { universityEmail: profile.email },
            { personalEmail: profile.email },
          ],
        });

        token.id = user?._id;
        token.email = user?.personalEmail;

        // Mark as needing setup if personal email not yet set
        if (user?.universityEmail === user?.personalEmail) {
          token.forceSetup = true;
        }
      }
      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id;
      session.user.forceSetup = token.forceSetup || false;
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
    signOut: "/",
    newUser: "/profile/profile-setup",
    error: "/auth/login",
  },
});
