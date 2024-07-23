import { auth } from "../_lib/auth";
import { getBookedDatesByCabinId, getSettings } from "../_lib/data-service";
import DateSelector from "./DateSelector";
import ReservationForm from "./ReservationForm";
import LoginMessage from "./LoginMessage";


export default async function Reservation({ cabin }) {
  const { id: cabinId } = cabin;

  const session=await auth();

  // const settings = await getSettings();
  // const bookedDates = await getBookedDatesByCabinId(cabinId);
  const [settings, bookedDates] = await Promise.all([getSettings(), getBookedDatesByCabinId(cabinId)]);
  return (
    <div className="grid grid-cols-2 border border-primary-800 min-h-[400px]">
      <DateSelector settings={settings} cabin={cabin} bookedDates={bookedDates} />
      {session?.user?<ReservationForm cabin={cabin} user={session.user} />:<LoginMessage />}
    </div>
  )
}