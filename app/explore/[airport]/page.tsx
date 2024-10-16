import { getFlights } from "@/app/ui/get-flights"
import { Map } from "@/app/ui/map"

type Params = Promise<{
  airport: string // e.g. SFO
}>
export default async function Page({ params }: { params: Params }) {
  const flights = await getFlights(params)

  return (
    <div>
      <Map flights={flights} params={params} />
    </div>
  )
}
