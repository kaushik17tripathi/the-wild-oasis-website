import Cabin from "@/app/_components/Cabin";
import Reservation from "@/app/_components/Reservation";
import Spinner from "@/app/_components/Spinner";
import { getCabin, getCabins } from "@/app/_lib/data-service";
import { Suspense } from "react";

// export const metadata = {
//   title: "Cabin",
// };

export async function generateMetadata({ params }) {
  const cabinId = params.cabinId;
  const { name } = await getCabin(cabinId);

  return {
    title: `Cabin ${name}`,
  };
}

// export async function getStaticParams() {
//   const cabins = await getCabins();

//   //it will always have to return an array of objects with a params key which will have the name of the dynamic route segment here cabinId
//   return {
//     paths: cabins.map((cabin) => ({
//       params: {
//         cabinId: cabin.id.toString(),
//       },
//     })),
//     fallback: false,
//   };
// }

export async function generateStaticParams() {
  const cabins = await getCabins();

  const ids = cabins.map((cabin) => { cabinId: String(cabin.id) });

  return ids;

}

export default async function Page({ params }) {
  const cabinId = params.cabinId;
  const cabin = await getCabin(cabinId);

  return (
    <div className="max-w-6xl mx-auto mt-8">
      <Cabin cabin={cabin} />
      <div>
        <h2 className="text-5xl font-semibold text-center mb-10 text-accent-400">
          Reserve {cabin.name} today. Pay on arrival.
        </h2>
      </div>
      <Suspense fallback={<Spinner/>}>
        <Reservation cabin={cabin} />
      </Suspense>
    </div>
  );
}
//to remove unused imports shift+alt+o
//   const settings = await getSettings();
//   const bookedDates = await getBookedDatesByCabinId(cabinId);

// const [cabin, settings, bookedDates] = Promise.all([getCabin(cabinId), getSettings(), getBookedDatesByCabinId(cabinId)]); //to avoid multiple blocking code