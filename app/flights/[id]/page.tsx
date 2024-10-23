import { FlightActivity } from '@/app/ui/flight-activity';
import { PlaneDetails } from '@/app/ui/plane-details';
import { Suspense } from 'react';

export default async function Page({ params }: { params: Params }) {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <PlaneDetails params={params} />
        <FlightActivity params={params} />
      </Suspense>
    </>
  );
}

type Params = Promise<{ id: string }>;
