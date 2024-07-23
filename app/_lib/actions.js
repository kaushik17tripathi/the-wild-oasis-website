'use server'

import { redirect } from "next/navigation"
import { auth, signIn, signOut } from "./auth"
import { createBooking, deleteBooking, getBookings, updateBooking, updateGuest } from "./data-service"
import { revalidatePath } from "next/cache"

export async function signInAction() {
  await signIn('google',
    { redirectTo: '/account' }
  )
}

export async function signOutAction() {
  await signOut('google',
    { redirectTo: '/' }
  )
}

export async function updateGuestAction(formData) {
  const session = await auth()
  if (!session) throw new Error('You must be logged in')
  const id = session.user.guestId
  const nationalID = formData.get('nationalID')
  const [nationality, countryFlag] = formData.get('nationality').split('%')
  if (!/^[a-zA-Z0-9]{6,12}$/.test(nationalID)) throw new Error('Invalid national ID');


  await updateGuest(id, { nationalID, nationality, countryFlag })

  revalidatePath('/account/profile') //manually revalidating the data as dynamic routes store data in cache for 30 sec

}

export async function addReservationAction(bookingData, formData) {
  const session = await auth()
  if (!session) throw new Error('You must be logged in')

  const newBooking = {
    ...bookingData,
    guestId: session.user.guestId,
    numGuests: Number(formData.get('numGuests')),
    observations: formData.get('observations').slice(0, 1000),
    extrasPrice: 0,
    totalPrice: bookingData.cabinPrice,
    status: 'unconfirmed',
    isPaid: false,
    hasBreakfast: false,
  }


  await createBooking(newBooking)
  revalidatePath(`/cabins/${bookingData.cabinId}`)
  redirect('/cabins/thankyou')
}

export async function deleteReservationAction(bookingId) {
  const session = await auth()
  if (!session) throw new Error('You must be logged in')
  const guestBookings = await getBookings(session.user.guestId)
  const guestBookingIds = guestBookings.map(booking => booking.id)

  if (!guestBookingIds.includes(bookingId)) {
    throw new Error('You are not authorized to delete this booking')
  }//to prevent user from deleting other users booking

  await deleteBooking(bookingId)
  revalidatePath('/account/reservations')
}

export async function updateReservationAction(formData) {
  //Authentication
  const session = await auth()
  if (!session) throw new Error('You must be logged in')
  const guestBookings = await getBookings(session.user.guestId)
  const guestBookingIds = guestBookings.map(booking => booking.id)

  //Authorization
  const bookingId = Number(formData.get('bookingId'))
  if (!guestBookingIds.includes(bookingId)) {
    throw new Error('You are not authorized to update this booking')
  }

  //Structuring form data
  const numGuests = Number(formData.get('numGuests'))
  const observations = formData.get('observations').slice(0, 1000)

  //Mutation
  await updateBooking(bookingId, { numGuests, observations })

  //Revalidation
  revalidatePath(`{/account/reservations/edit/${bookingId}`)
  revalidatePath('/account/reservations')

  //Redirecting
  redirect('/account/reservations')

}