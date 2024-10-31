import Link from 'next/link';

export default async function Page() {
  return (
    <div className="text-white">
      <Link href="/explore/sfo">
        View flights near San Francisco International Airport (SFO)
      </Link>
    </div>
  );
}
