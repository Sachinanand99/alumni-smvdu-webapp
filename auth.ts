import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import LinkedIn from "next-auth/providers/google"
import Facebook from "next-auth/providers/google"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google, LinkedIn, Facebook],
})