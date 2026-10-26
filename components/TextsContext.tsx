'use client';
import { createContext, useContext, type ReactNode } from 'react';
import { DEFAULT_TEXTS, type Texts } from '@/lib/texts';

// The site texts for components deep inside cards (the share button), also inside the map popup.
const Ctx = createContext<Texts>(DEFAULT_TEXTS);
export const useTexts = () => useContext(Ctx);
export function TextsProvider({ texts, children }: { texts: Texts; children: ReactNode }) {
  return <Ctx.Provider value={texts}>{children}</Ctx.Provider>;
}
