import { getFlightTracks } from '@/app/ui/get-flight-tracks';
import { getFlights } from '@/app/ui/get-flights';
import { Map } from '@/app/ui/map';
import { Planes } from '@/app/ui/planes';

export default async function Page({ params }: { params: Params }) {
  
  const flights = await getFlights(params);

  // show when flight is selected:
  const flightTracks = await getFlightTracks(flights[0].fr24_id);

  return (
    <div className="w-screen h-screen">
      <Map params={params}>
        <Planes planes={flights} />
      </Map>
    </div>
  );
}

type Params = Promise<{
  airport: string; // e.g. SFO
}>;
