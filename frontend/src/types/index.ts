export interface ListingFeatures {
  latitude: number;
  longitude: number;
  neighbourhood_group: string;
  neighbourhood: string;
  price: number;
  minimum_nights: number;
  number_of_reviews: number;
  reviews_per_month: number;
  calculated_host_listings_count: number;
  availability_365: number;
}

export interface PredictionResponse {
  predicted_room_type: string;
  confidence_probabilities: {
    [key: string]: number;
  };
  status: string;
  source?: "fastapi" | "client_fallback";
  execution_time_ms?: number;
}

export interface NeighbourhoodData {
  name: string;
  lat: number;
  lng: number;
  avgPrice: number;
  count: number;
}

export interface BoroughData {
  center: {
    lat: number;
    lng: number;
  };
  neighbourhoods: NeighbourhoodData[];
}

export interface PresetListing {
  id: string;
  title: string;
  borough: string;
  neighbourhood: string;
  tagline: string;
  expectedType: string;
  image: string;
  features: ListingFeatures;
}

export interface HistoryRecord {
  id: string;
  timestamp: number;
  features: ListingFeatures;
  prediction: PredictionResponse;
}
