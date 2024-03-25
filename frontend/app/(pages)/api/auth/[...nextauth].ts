import NextAuth from "next-auth"
import EmailProvider from "next-auth/providers/email"

export default NextAuth({
    secret: process.env.SECRET,
    providers: [
        EmailProvider({
            server: process.env.MAIL_SERVER,
            from: "<no-reply@example.com>",
        }),
    ],
})