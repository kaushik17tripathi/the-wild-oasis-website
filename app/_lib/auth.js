import NextAuth from 'next-auth'
import Google from "next-auth/providers/google";
import { createGuest, getGuest } from './data-service';

const authConfig = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET
    })
  ],
  callbacks: {//next auth is going to call this function when the user goes to /account page
    authorized({ auth, request }) {//auth is current session
      return !!auth?.user //if auth.user exist return true else false
    },
    async signIn({ user, account, profile }) {//when user sign in
      try {
        const existingGuest = await getGuest(user.email)

        if (!existingGuest) await createGuest({ email: user.email, fullName: user.name })
        return true
      } catch {
        return false  //it is necessary to return true or false in these callbacks
      }
    },
    async session({ session, user }) {
      const guest =await getGuest(session.user.email) //NEVER FORGET AWAIT
      session.user.guestId=guest.id
      return session  //here we are adding the id from the database to our session for the guest so that we can use it to get reservation related to that user and other configurations in the future
    }
  },
  pages: {
    signIn: '/login' //incase user is not authorised redirect to login page
  }
}

export const { auth, signIn, signOut, handlers: { GET, POST } } = NextAuth(authConfig)