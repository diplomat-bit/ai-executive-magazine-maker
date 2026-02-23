/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { LookPage } from './types';
import { LoadingFX } from './LoadingFX';

interface PanelProps {
    page?: LookPage;
    onOpenBook: () => void;
    onGenerateVideo: (id: string) => void;
}

export const Panel: React.FC<PanelProps> = ({ page, onOpenBook, onGenerateVideo }) => {
    if (!page) return <div className="w-full h-full bg-[#111]" />;
    if (page.isLoading && !page.imageUrl) return <LoadingFX />;
    
    // Cover Page
    if (page.type === 'cover') {
        return (
            <div className="w-full h-full relative bg-black group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80 z-10" />
                {page.imageUrl && <img src={page.imageUrl} alt="Cover" className="w-full h-full object-cover opacity-90 transition-transform duration-[10s] ease-in-out transform hover:scale-105" />}
                
                <div className="absolute inset-0 z-20 flex flex-col justify-between p-8 md:p-12">
                    <div className="text-center mt-8">
                        <h1 className="font-luxury text-5xl md:text-7xl text-white tracking-[0.1em] drop-shadow-2xl">
                            EXECUTIVE
                        </h1>
                        <p className="font-body text-white text-sm tracking-[0.4em] mt-2 uppercase">The Leadership Issue</p>
                    </div>

                    <div className="text-center mb-8">
                         <button 
                            onClick={(e) => { e.stopPropagation(); onOpenBook(); }}
                            className="luxury-btn px-10 py-4 text-sm tracking-widest bg-white/10 hover:bg-white hover:text-black border-white/50"
                         >
                            Open Lookbook
                         </button>
                    </div>
                </div>
            </div>
        );
    }

    // Back Cover
    if (page.type === 'back_cover') {
        return (
             <div className="w-full h-full relative bg-black flex flex-col items-center justify-center p-12 text-center border-[12px] border-[#111]">
                 <h2 className="font-luxury text-3xl text-white tracking-widest mb-8">FIN</h2>
                 <p className="font-body text-gray-500 text-xs tracking-[0.2em] mb-12 uppercase">
                     Designed by Executive AI
                 </p>
                 <button 
                    onClick={() => window.location.reload()}
                    className="luxury-btn px-8 py-3 text-xs tracking-widest"
                 >
                    Create New Collection
                 </button>
             </div>
        );
    }

    // Standard Look Page
    return (
        <div className="w-full h-full relative bg-[#050505] overflow-hidden group">
            {/* Media */}
            {page.videoUrl ? (
                <video src={page.videoUrl} autoPlay loop playsInline muted className="w-full h-full object-cover" />
            ) : (
                page.imageUrl && <img src={page.imageUrl} alt="Look" className="w-full h-full object-cover" />
            )}

            {/* Video Toggle */}
            <button 
                onClick={(e) => { e.stopPropagation(); if(page.id) onGenerateVideo(page.id); }}
                className="absolute top-4 right-4 z-30 text-white/50 hover:text-white transition-colors"
                disabled={page.isAnimating || !!page.videoUrl}
            >
                {page.isAnimating ? (
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                    <span className="text-xs uppercase tracking-widest font-body border border-white/20 px-2 py-1 bg-black/20 backdrop-blur-sm">
                        {page.videoUrl ? 'Motion Active' : 'Enable Motion'}
                    </span>
                )}
            </button>

            {/* Caption Overlay */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-6 pb-10 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                <div className="border-l-2 border-yellow-500 pl-4">
                    <p className="font-luxury text-white text-lg tracking-wide uppercase mb-1">
                        {page.sceneDesc?.setting || "Executive Scene"}
                    </p>
                    <p className="font-body text-gray-300 text-xs leading-relaxed max-w-[90%]">
                        {page.sceneDesc?.caption || "Defining the future of business."}
                    </p>
                </div>
            </div>
        </div>
    );
}