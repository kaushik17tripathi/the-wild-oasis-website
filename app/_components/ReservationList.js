'use client';

import ReservationCard from "@/app/_components/ReservationCard";
import { useOptimistic } from "react";

export default function ReservationList({ bookings }) {

  const [optimisticBookings, optimisticDelete]=useOptimistic(bookings,(curBookings,bookingId)=>{
    //handle function to set next optimistic state. it takes current state and a parameter that is necessary to determine next state, usually this parameter is similar to parameter passed to the actual asynchronous operation
    return curBookings.filter(booking=>booking.id!==bookingId)
  })

  async function handleDelete(bookingId) {
    optimisticDelete(bookingId) 
    await deleteReservationAction(bookingId)
  }

  return (
    <ul className="space-y-6">
      {optimisticBookings.map((booking) => (
        <ReservationCard onDelete={()=>handleDelete(booking.id)} booking={booking} key={booking.id} />
      ))}
    </ul>
  )
}
//here we use optimistic bookings as initially optimistic bookings are same as bookings.