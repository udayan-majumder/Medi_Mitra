import PharmacyStockpage from './PharmacyStockpage';

// Required for static export
export async function generateStaticParams() {
  // Return empty array for dynamic routes in static export
  // The page will be generated at runtime
  return [];
}

export default function Page() {
  return <PharmacyStockpage />;
}
