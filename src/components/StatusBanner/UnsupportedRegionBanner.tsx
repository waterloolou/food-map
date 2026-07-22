import type { Country } from '../../types';

interface UnsupportedRegionBannerProps {
  countries: Country[];
}

export function UnsupportedRegionBanner({ countries }: UnsupportedRegionBannerProps) {
  return (
    <div className="unsupported-region-banner">
      <h2>We don't have data for your current location yet</h2>
      <p>
        This preview only covers {countries.map((c) => `${c.city} (${c.name})`).join(', ')}. Use
        "Simulate location" below to try the app in one of those cities.
      </p>
    </div>
  );
}
