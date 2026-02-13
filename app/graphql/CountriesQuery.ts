export const COUNTRIES_QUERY = `#graphql
  query Countries {
    localization {
      availableCountries {
        isoCode
        name
        currency {
          isoCode
        }
        availableProvinces {
          code
          name
        }
      }
    }
  }
` as const;
