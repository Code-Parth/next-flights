import { FlightActivity } from "@/app/ui/flight-activity"
import { PlaneDetails } from "@/app/ui/plane-details"

export default function Page({ params }: { params: Params }) {
  return (
    <div>
      <PlaneDetails params={params} />
      <FlightActivity params={params} />
    </div>
  )
}

type Params = Promise<{ id: string }>
