export type Place = {
  id: number;
  name: string;
  town: string;
  region: string[];
  types: string[];
  cats: string[];
  link: string;
  descr: string;
  lat: number | null;
  lng: number | null;
  approx: boolean;
  /** "exact": address or coordinates from the place's own source; "town": centre of the town */
  precision?: 'exact' | 'town';
  address?: string;
  shabbat: 'open' | 'closed' | 'unknown';
  family: 'yes' | 'no' | 'unknown';
  pick: boolean;
  tags: string[];
  ctags: string[];
  hours?: string;
  note?: string;
};
