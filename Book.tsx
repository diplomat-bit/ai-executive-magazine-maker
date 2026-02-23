/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { LookPage, TOTAL_PAGES } from './types';
import { Panel } from './Panel';

interface BookProps {
    pages: LookPage[];
    currentSheetIndex: number;
    onSheetClick: (index: number) => void;
    onOpenBook: () => void;
    onGenerateVideo: (faceId: string) => void;
}

export const Book: React.FC<BookProps> = (props) => {
    const sheetsToRender = [];
    if (props.pages.length > 0) {
        // Sheet 0: Cover (Front) and Page 1 (Back)
        sheetsToRender.push({ front: props.pages[0], back: props.pages.find(f => f.pageIndex === 1) });
        // Subsequent sheets
        for (let i = 2; i <= TOTAL_PAGES; i += 2) {
            sheetsToRender.push({ 
                front: props.pages.find(f => f.pageIndex === i), 
                back: props.pages.find(f => f.pageIndex === i + 1) || { id: 'back_cover', type: 'back_cover', isLoading: false } as LookPage 
            });
        }
    } else {
        // Placeholder
        sheetsToRender.push({ front: undefined, back: undefined });
    }

    return (
        <div className={`book ${props.currentSheetIndex > 0 ? 'opened' : ''}`}>
          {sheetsToRender.map((sheet, i) => (
              <div key={i} className={`paper ${i < props.currentSheetIndex ? 'flipped' : ''}`} style={{ zIndex: i < props.currentSheetIndex ? i : sheetsToRender.length - i }}
                   onClick={() => props.onSheetClick(i)}>
                  <div className="front">
                      <Panel page={sheet.front} onOpenBook={props.onOpenBook} onGenerateVideo={props.onGenerateVideo} />
                      <div className="gloss" />
                  </div>
                  <div className="back">
                      <Panel page={sheet.back} onOpenBook={props.onOpenBook} onGenerateVideo={props.onGenerateVideo} />
                      <div className="gloss" />
                  </div>
              </div>
          ))}
      </div>
    );
}