import { PrismaAdapter } from "@auth/prisma-adapter";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import { type Adapter } from "next-auth/adapters";
import GoogleProvider from "next-auth/providers/google";
import { env } from "@/env";
import { db } from "@/server/db";
import bcrypt from "bcrypt";
import Credentials from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email";
import { Resend } from "resend";
const resend = new Resend(env.RESEND_API_KEY);
import VerifyEmail from "@/lib/emails/verify-email";
/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt: async ({ token, user, trigger, session }) => {
      if (user) {
        token.sub = user.id;
        token.name = user.name;
        token.email = user.email;
      }

      // Handle the update trigger
      if (trigger === "update" && session?.name) {
        token.name = session.name;
      }

      return token;
    },
    session: async ({ session, token }) => {
      if (token) {
        session.user = {
          ...session.user,
          id: token.sub! as string,
          name: token.name! as string,
          email: token.email! as string,
        };
      }
      return session;
    },
    signIn: async ({ user, account }) => {
      if (account?.provider === "google") {
        return true;
      }

      if (account?.provider === "credentials") {
        const dbUser = await db.user.findUnique({
          where: { email: user.email! },
        });

        return dbUser?.emailVerified != null;
      }

      return true;
    },
  },

  adapter: PrismaAdapter(db) as Adapter,
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required.");
        }

        const user = await db.user.findUnique({
          where: { email: credentials.email },
        });
        // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
        if (!user || !user.password)
          throw new Error("Invalid email or password.");

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password,
        );
        if (!isPasswordValid) throw new Error("Invalid email or password.");

        return { id: user.id, email: user.email, name: user.name };
      },
    }),
    EmailProvider({
      server: `smtp.resend.com`,
      from: "nova@novaspaces.io",
      // Replace the default email implementation
      sendVerificationRequest: async ({ identifier, url }) => {
        try {
          await resend.emails.send({
            from: "nova@novaspaces.io",
            to: identifier,
            subject: "Verify your email address",
            react: VerifyEmail({ url }),
          });
        } catch (error) {
          console.error("Error sending verification email", error);
          throw new Error("Failed to send verification email");
        }
      },
    }),
  ],

  pages: {
    signIn: "/sign-in",
    verifyRequest: "/verify-email",
  },
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);
