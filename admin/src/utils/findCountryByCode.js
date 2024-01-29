import { countriesData } from "@/data";

export function findCountryByCode(countryCode) {
  const country = countriesData.find(
    (country) => country.code === String(countryCode)
  );
  return country || null;
}
