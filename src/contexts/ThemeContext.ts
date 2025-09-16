import { createContext } from 'react';
import type { ThemeContextType } from './ThemeContextType';

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
