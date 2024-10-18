import { getFlightTracks } from '@/app/ui/get-flight-tracks';
import { getFlights } from '@/app/ui/get-flights';
import { Map } from '@/app/ui/map-2';

export default async function Page({ params }: { params: Params }) {
  const flights = await getFlights(params);

  // show when flight is selected:
  const flightTracks = await getFlightTracks(flights[0].fr24_id);

  return (
    <div className="w-screen h-screen">
      <Map flights={flights} params={params}></Map>
    </div>
  );
}

type Params = Promise<{
  airport: string; // e.g. SFO
}>;
