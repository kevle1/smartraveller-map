interface SmartravellerCountry {
  name: string;
  alpha_2: string;
}

interface SmartravellerAdvisory {
  country: SmartravellerCountry;
  advisory: string;
  level: number;
  page_url: string;
}

interface SmartravellerAdvisoryResponse {
  last_updated: string;
  advisories: SmartravellerAdvisory[];
}

export default SmartravellerAdvisoryResponse;
