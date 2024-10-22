import { getFlights } from '@/app/utils/get-flights';
import { GlMap } from '@/app/ui/gl-map';
import { GlPlanes } from '@/app/ui/gl-planes';

export default async function Page({ params }: { params: Params }) {
  const flights = await getFlights(params);

  return (
    <div className="w-screen h-screen">
      <GlMap params={params}>
        <GlPlanes planes={flights} />
      </GlMap>
    </div>
  );
}

type Params = Promise<{
  airport: string; // e.g. SFO
}>;
