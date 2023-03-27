interface CountryAdvisory {
  advisory: string;
  level: number;
  page_url: string;
  country: string;
  alpha_2: string;
  official_name?: string;
}

interface AdvisoryResponse {
  last_updated: string;
  advisories: {
    [alpha2: string]: CountryAdvisory;
  };
}
export default AdvisoryResponse;  