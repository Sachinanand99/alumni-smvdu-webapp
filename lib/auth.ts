import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectMongo from "@/lib/db";
import UserModel from "@/models/User";

export const hashPassword = async (password: string) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

export const comparePassword = async (password: string, hashedPassword: string) => {
    return await bcrypt.compare(password, hashedPassword);
};

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                await connectMongo();
                const user = await UserModel.findOne({ personalEmail: credentials.email });

                if (!user || !(await bcrypt.compare(credentials.password, user.password))) {
                    throw new Error("Invalid email or password");
                }

                return {
                    id: user._id,
                    email: user.personalEmail,
                    name: user.name,
                    provider: "local",
                };
            },
        }),
    ],
    secret: process.env.AUTH_SECRET,
    // callbacks: {
    //     async session({ session, token }) {
    //         session.user = {
    //             id: token.id,
    //             email: token.email,
    //             name: token.name,
    //             provider: token.provider,
    //         };
    //         return session;
    //     },
    //     async jwt({ token, user }) {
    //         if (user) {
    //             token.id = user.id;
    //             token.email = user.email;
    //             token.name = user.name;
    //             token.provider = user.provider;
    //         }
    //         return token;
    //     },
    // },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.name = user.name;
                token.provider = "local";
            }
            console.log("JWT Token:", token);
            return token;
        },

        async session({ session, token }) {
            console.log("Session Token:", token);

            session.user = {
                id: token.id,
                email: token.email,
                name: token.name,
                provider: "local",
            };

            return session;
        }
    }

};

export default NextAuth(authOptions);
