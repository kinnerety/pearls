import places from '@/data/places.json';
import type { Place } from './types';

export const PLACES = places as Place[];
export const placeById = (id: number) => PLACES.find(p => p.id === id);
