import type { Place } from './types';

// "exact" = address or coordinates published by the place; anything else is the town centre
export const isApprox = (p: Place) => (p.precision ? p.precision !== 'exact' : p.approx);
