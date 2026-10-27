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
  geo_source?: string;
  /** "exact": address or coordinates from the place's own source; "town": centre of the town */
  precision?: 'exact' | 'town';
  address?: string;
  shabbat: 'open' | 'closed' | 'unknown';
  family: 'yes' | 'no' | 'unknown';
  pick: boolean;
  /** Kinneret checked the details herself (after an AI gathered them). Admin only, never shown on the site. */
  checked?: boolean;
  /** When Kinneret approved the place (ISO date). Existing places got the launch date. For a future "new pearls" filter. */
  approved_at?: string;
  /** Recommender's name, when the suggester asked to be credited (form). Stored only; not shown yet. */
  credit?: string;
  tags: string[];
  ctags: string[];
  hours?: string;
  note?: string;
};
