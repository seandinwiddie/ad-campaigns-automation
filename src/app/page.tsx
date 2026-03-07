'use client';

import dynamic from 'next/dynamic';

const ScreenRouterWithNoSsr = dynamic(
  () => import('@/components/screens/ScreenRouter').then((mod) => mod.ScreenRouter),
  { ssr: false }
);

export default function Page() {
  return <ScreenRouterWithNoSsr />;
}
