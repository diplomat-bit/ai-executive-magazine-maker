/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';

const LOADING_FX = ["VOGUE", "LUXURY", "POWER", "STATUS", "FLASH", "SNAP", "POSING", "ELEGANCE", "ICON", "WEALTH"];

export const LoadingFX: React.FC = () => {
    const [word, setWord] = useState(LOADING_FX[0]);
    
    useEffect(() => {
        const interval = setInterval(() => {
            setWord(LOADING_FX[Math.floor(Math.random() * LOADING_FX.length)]);
        }, 800);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full h-full bg-[#0a0a0a] overflow-hidden relative flex flex-col items-center justify-center">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#222] to-black opacity-80" />
            
            <div className="z-10 text-center animate-pulse">
                <h2 className="font-luxury text-4xl md:text-5xl text-white tracking-[0.3em] mb-4 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                    {word}
                </h2>
                <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-yellow-500 to-transparent mx-auto"></div>
                <p className="font-body text-xs text-gray-500 mt-4 tracking-widest uppercase">Curating Scene...</p>
            </div>
        </div>
    );
};