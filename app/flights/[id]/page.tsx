import { FlightActivity } from '@/app/ui/flight-activity';
import { PlaneDetails } from '@/app/ui/plane-details';

export default function Page({ params }: { params: Params }) {
  return (
    <>
      <PlaneDetails params={params} />
      <FlightActivity params={params} />
    </>
  );
}

type Params = Promise<{ id: string }>;
