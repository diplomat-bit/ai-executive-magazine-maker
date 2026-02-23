/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { LOCATIONS, STYLES, Asset } from './types';

interface SetupProps {
    show: boolean;
    isTransitioning: boolean;
    person: Asset | null;
    brand: Asset | null;
    selectedLocation: string;
    selectedStyle: string;
    onPersonUpload: (file: File) => void;
    onBrandUpload: (file: File) => void;
    onLocationChange: (val: string) => void;
    onStyleChange: (val: string) => void;
    onLaunch: () => void;
}

export const Setup: React.FC<SetupProps> = (props) => {
    if (!props.show && !props.isTransitioning) return null;

    return (
        <div className={`fixed inset-0 z-[200] overflow-y-auto bg-black/90 backdrop-blur-md transition-opacity duration-1000 ${props.isTransitioning ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <div className="min-h-full flex items-center justify-center p-4">
            <div className="max-w-4xl w-full bg-[#111] border border-gray-800 shadow-[0_0_50px_rgba(0,0,0,1)] relative overflow-hidden">
                
                {/* Gold Accent Line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-700 via-yellow-400 to-yellow-700"></div>

                <div className="p-8 md:p-12 text-center">
                    <h1 className="font-luxury text-4xl md:text-6xl text-white mb-2 tracking-widest uppercase">
                        Executive <span className="text-yellow-500">Lookbook</span>
                    </h1>
                    <p className="font-body text-gray-400 text-sm tracking-[0.2em] mb-12 uppercase">
                        AI-Generated Corporate Luxury Catalogue
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 text-left">
                        
                        {/* LEFT: ASSETS */}
                        <div className="space-y-6">
                            <div className="border-b border-gray-800 pb-2 mb-4">
                                <span className="font-luxury text-xl text-white">1. The Assets</span>
                            </div>
                            
                            {/* PERSON UPLOAD */}
                            <div className={`p-6 border border-dashed transition-all duration-300 group hover:border-white/40 ${props.person ? 'border-yellow-500/50 bg-yellow-900/10' : 'border-gray-700 bg-gray-900/30'}`}>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-body text-xs font-bold text-gray-300 uppercase tracking-wider">The Executive (Face)</span>
                                    {props.person && <span className="text-yellow-500 text-xs">● UPLOADED</span>}
                                </div>
                                
                                {props.person ? (
                                    <div className="flex gap-4 items-center">
                                         <img src={`data:image/jpeg;base64,${props.person.base64}`} alt="Person" className="w-16 h-16 object-cover border border-gray-600 rounded-sm grayscale hover:grayscale-0 transition-all" />
                                         <label className="cursor-pointer text-xs text-white underline hover:text-yellow-400">
                                             Change Photo
                                             <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && props.onPersonUpload(e.target.files[0])} />
                                         </label>
                                    </div>
                                ) : (
                                    <label className="block w-full text-center py-4 cursor-pointer">
                                        <span className="text-2xl block mb-2 text-gray-500 group-hover:text-white transition-colors">+</span>
                                        <span className="text-xs text-gray-500 uppercase tracking-widest group-hover:text-white transition-colors">Upload Portrait</span>
                                        <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && props.onPersonUpload(e.target.files[0])} />
                                    </label>
                                )}
                            </div>

                            {/* BRAND UPLOAD */}
                            <div className={`p-6 border border-dashed transition-all duration-300 group hover:border-white/40 ${props.brand ? 'border-yellow-500/50 bg-yellow-900/10' : 'border-gray-700 bg-gray-900/30'}`}>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-body text-xs font-bold text-gray-300 uppercase tracking-wider">The Design / Logo</span>
                                    {props.brand && <span className="text-yellow-500 text-xs">● UPLOADED</span>}
                                </div>

                                {props.brand ? (
                                    <div className="flex gap-4 items-center">
                                        <img src={`data:image/jpeg;base64,${props.brand.base64}`} alt="Brand" className="w-16 h-16 object-contain border border-gray-600 rounded-sm bg-black/50" />
                                        <label className="cursor-pointer text-xs text-white underline hover:text-yellow-400">
                                            Change Design
                                            <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && props.onBrandUpload(e.target.files[0])} />
                                        </label>
                                    </div>
                                ) : (
                                    <label className="block w-full text-center py-4 cursor-pointer">
                                        <span className="text-2xl block mb-2 text-gray-500 group-hover:text-white transition-colors">+</span>
                                        <span className="text-xs text-gray-500 uppercase tracking-widest group-hover:text-white transition-colors">Upload Design</span>
                                        <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && props.onBrandUpload(e.target.files[0])} />
                                    </label>
                                )}
                            </div>
                        </div>

                        {/* RIGHT: SETTINGS */}
                        <div className="space-y-6">
                             <div className="border-b border-gray-800 pb-2 mb-4">
                                <span className="font-luxury text-xl text-white">2. The Setting</span>
                            </div>
                            
                            <div>
                                <label className="block font-body text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Location Theme</label>
                                <div className="grid grid-cols-1 gap-2">
                                    {LOCATIONS.slice(0, 4).map(loc => (
                                        <button 
                                            key={loc}
                                            onClick={() => props.onLocationChange(loc)}
                                            className={`text-left px-4 py-3 text-sm border transition-all ${props.selectedLocation === loc ? 'border-yellow-500 text-white bg-yellow-900/20' : 'border-gray-800 text-gray-400 hover:border-gray-600'}`}
                                        >
                                            {loc}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block font-body text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Fashion Style</label>
                                <select 
                                    value={props.selectedStyle}
                                    onChange={(e) => props.onStyleChange(e.target.value)}
                                    className="w-full bg-[#0a0a0a] text-white border border-gray-800 p-3 text-sm focus:border-yellow-500 focus:outline-none appearance-none"
                                >
                                    {STYLES.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={props.onLaunch} 
                        disabled={!props.person || props.isTransitioning} 
                        className="w-full py-4 bg-white text-black font-luxury text-xl uppercase tracking-[0.2em] hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {props.isTransitioning ? 'Curating Collection...' : 'Generate Catalogue'}
                    </button>
                </div>
            </div>
          </div>
        </div>
    );
}