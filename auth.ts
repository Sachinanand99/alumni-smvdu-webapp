import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import connectDB from "@/lib/mongodb";
import UserModel from "@/MongoDb/models/User";
import bcrypt from "bcryptjs";
import Credentials from "next-auth/providers/credentials";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google,
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDB();

        const user = await UserModel.findOne({ personalEmail: credentials.email });
        if (!user) {
          throw new Error("No user found with this email");
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
      callbacks: {
        async signIn({ user: { email, name, image }, account: { provider } }) {
          await connectDB();
          console.log("Email trying to sign in:", email);
          const existingUser = await UserModel.findOne({
            $or: [
              { universityEmail: email },
              { personalEmail: email },
            ]
          });

          if (existingUser) {
            return true;
          }

          // New user signing in via Google? Must be BCS email
          if (provider === "google") {
            const isBCSEmail = /\d{2}bcs\d{3}@smvdu\.ac\.in$/i.test(email);
            if (!isBCSEmail) {
              console.log("Not BCS student")
              throw new Error("Only BCS students are allowed.");
            }

            console.log("creating user.")
            console.log(email ,"\n", name ,"\n", image ,"\n", provider)
            // Create user on first Google login
            await UserModel.create({
              universityEmail: email,
              personalEmail: email, // Default same as university email, can change later
              name: name,
              profilePicture: image,
              provider: provider,
            });

            console.log("new user created")
            return true;
          }

          // For any other provider, deny sign-in (shouldn't reach here)
          return false;
        },

        async jwt({ token, account, profile }) {
          if (account && profile) {
            const user = await UserModel.findOne({ universityEmail: profile?.email });
            token.id = user?._id;
          }
          return token;
        },

        async session({ session, token }) {
          Object.assign(session, { id: token.id });
          return session;
      },
  pages: {
    signOut: "/",
    error: "/auth/login",
    newUser: "/profile/profile-setup",
    signIn: "/auth/login",
  },
  },
});
