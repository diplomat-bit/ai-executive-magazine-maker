/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

export const TOTAL_PAGES = 8;
export const BATCH_SIZE = 4;
export const INITIAL_PAGES = 2;

export const LOCATIONS = [
    "Wall Street Boardroom", 
    "Silicon Valley Tech Campus", 
    "Dubai Skyscraper Penthouse", 
    "Paris Fashion Week Front Row", 
    "Private Island Villa",
    "Luxury Private Jet",
    "Monaco Yacht Deck",
    "Swiss Alps Davos Summit"
];

export const STYLES = [
    "Power Suit (Classic Bespoke)", 
    "Tech Mogul (Minimalist Luxury)", 
    "Black Tie Gala (Formal)", 
    "Avant-Garde Executive (Bold)",
    "Old Money (Quiet Luxury)",
    "Streetwear CEO (High-End Casual)"
];

export interface LookPage {
  id: string;
  type: 'cover' | 'look' | 'back_cover';
  imageUrl?: string;
  sceneDesc?: SceneDesc;
  isLoading: boolean;
  pageIndex?: number;
  // Multimedia updates
  videoUrl?: string;
  isAnimating?: boolean;
}

export interface SceneDesc {
  setting: string;
  outfit: string;
  caption: string;
}

export interface Asset {
  base64: string;
  desc: string;
}