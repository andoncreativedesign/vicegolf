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

export const LOCALIZATION_CURRENCIES_QUERY = `#graphql
  query LocalizationCurrencies {
    localization {
      availableCountries {
        isoCode
        name
        currency {
          isoCode
          symbol
        }
      }
    }
  }
` as const;

