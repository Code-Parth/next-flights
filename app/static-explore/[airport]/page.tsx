import { getFlights } from '@/app/ui/get-flights';
import { StaticMap } from '@/app/ui/static-map';
import { StaticPlanes } from '@/app/ui/static-planes';

export default async function Page({ params }: { params: Params }) {
  const flights = await getFlights(params);

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <StaticMap params={params}>
        <StaticPlanes flights={flights} />
      </StaticMap>
    </div>
  );
}

type Params = Promise<{
  airport: string; // e.g. SFO
}>;
