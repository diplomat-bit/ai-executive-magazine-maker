/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useRef } from 'react';
import { GoogleGenAI } from '@google/genai';
import { TOTAL_PAGES, INITIAL_PAGES, LOCATIONS, STYLES, LookPage, SceneDesc, Asset } from './types';
import { Setup } from './Setup';
import { Book } from './Book';


// --- Constants ---
const MODEL_IMAGE_GEN_NAME = "gemini-2.5-flash-image";
const MODEL_TEXT_NAME = "gemini-2.5-flash";
const MODEL_VEO_NAME = "veo-3.1-fast-generate-preview";

const App: React.FC = () => {
  // --- State ---
  const [person, setPerson] = useState<Asset | null>(null);
  const [brand, setBrand] = useState<Asset | null>(null);
  const [selectedLocation, setSelectedLocation] = useState(LOCATIONS[0]);
  const [selectedStyle, setSelectedStyle] = useState(STYLES[0]);
  
  const [pages, setPages] = useState<LookPage[]>([]);
  const [currentSheetIndex, setCurrentSheetIndex] = useState(0);
  const [showSetup, setShowSetup] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // --- AI Helpers ---
  const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve((reader.result as string).split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handlePersonUpload = async (file: File) => {
       try { const base64 = await fileToBase64(file); setPerson({ base64, desc: "The Executive" }); } catch (e) { alert("Upload failed"); }
  };
  const handleBrandUpload = async (file: File) => {
       try { const base64 = await fileToBase64(file); setBrand({ base64, desc: "Brand Logo" }); } catch (e) { alert("Upload failed"); }
  };

  const updatePageState = (id: string, updates: Partial<LookPage>) => {
      setPages(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const generateSceneList = async (): Promise<SceneDesc[]> => {
      const ai = getAI();
      const prompt = `
      Create a list of ${TOTAL_PAGES} distinct luxury fashion photography scenes for a corporate executive lookbook.
      THEME: ${selectedLocation}.
      STYLE: ${selectedStyle}.
      
      Each scene must be in a different setting within the theme (e.g., if Airport: Check-in, Lounge, Tarmac, In-flight seat, Meeting room).
      The 'outfit' should be high-end corporate wear.
      The 'caption' should be short, punchy marketing copy (max 10 words) describing the lifestyle.

      OUTPUT JSON ARRAY:
      [
        { "setting": "Boardroom Table", "outfit": "Navy pinstripe suit", "caption": "Command the room." },
        ...
      ]
      `;
      
      try {
          const res = await ai.models.generateContent({
              model: MODEL_TEXT_NAME,
              contents: prompt,
              config: { responseMimeType: 'application/json' }
          });
          const text = res.text?.replace(/```json/g, '').replace(/```/g, '').trim() || "[]";
          return JSON.parse(text);
      } catch (e) {
          console.error("Scene Gen Error", e);
          // Fallback scenes
          return Array(TOTAL_PAGES).fill(0).map((_, i) => ({
              setting: `Luxury Scene ${i+1}`,
              outfit: "Corporate Suit",
              caption: "Success is a mindset."
          }));
      }
  };

  const generateImage = async (scene: SceneDesc, isCover: boolean): Promise<string> => {
      if (!person) return "";
      
      const contents: any[] = [];
      
      // Add Person Reference
      contents.push({ text: "REFERENCE 1 (THE MODEL):" });
      contents.push({ inlineData: { mimeType: 'image/jpeg', data: person.base64 } });

      // Add Brand Reference if exists
      if (brand) {
          contents.push({ text: "REFERENCE 2 (THE BRAND/DESIGN):" });
          contents.push({ inlineData: { mimeType: 'image/jpeg', data: brand.base64 } });
      }

      let prompt = `Fashion photography. High-end Magazine Quality. 8k resolution.
      SUBJECT: The person in REFERENCE 1. Maintain facial likeness strictly.
      SETTING: ${scene.setting} in ${selectedLocation}. Expensive, cinematic lighting.
      ATTIRE: ${scene.outfit}. Expensive fabric, perfect fit.
      `;

      if (brand) {
          prompt += `BRANDING: The clothing MUST feature the design from REFERENCE 2. 
          If it's a suit, place it as a lapel pin or subtle pattern. 
          If it's casual/streetwear, place it clearly on the chest. 
          Integrate REFERENCE 2 naturally into the fabric.`;
      }

      if (isCover) {
          prompt += ` COMPOSITION: Magazine Cover shot. Powerful gaze at camera. Bold, confident pose.`;
      } else {
          prompt += ` COMPOSITION: Lifestyle editorial. Candid or posed. Show the environment.`;
      }

      contents.push({ text: prompt });

      try {
          const ai = getAI();
          const res = await ai.models.generateContent({
              model: MODEL_IMAGE_GEN_NAME,
              contents: contents,
              config: { imageConfig: { aspectRatio: '3:4' } }
          });
          const part = res.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
          return part?.inlineData?.data ? `data:${part.inlineData.mimeType};base64,${part.inlineData.data}` : '';
      } catch (e) {
          console.error("Image Gen Error", e);
          return "";
      }
  };

  const generateVideo = async (pageId: string) => {
      const page = pages.find(p => p.id === pageId);
      if (!page || !page.imageUrl) return;

      updatePageState(pageId, { isAnimating: true });

      try {
          const ai = getAI();
          const imageBase64 = page.imageUrl.split(',')[1];
          
          let operation = await ai.models.generateVideos({
              model: MODEL_VEO_NAME,
              image: {
                  imageBytes: imageBase64,
                  mimeType: 'image/jpeg',
              },
              prompt: `Slow motion cinematic fashion shot. ${page.sceneDesc?.setting}. Subtle movement of fabric and hair. Professional lighting.`,
              config: {
                  numberOfVideos: 1,
                  resolution: '720p',
                  aspectRatio: '9:16' 
              }
          });

          // Polling
          while (!operation.done) {
              await new Promise(resolve => setTimeout(resolve, 5000));
              operation = await ai.operations.getVideosOperation({operation: operation});
          }
          
          const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
          if (videoUri) {
              const vidRes = await fetch(`${videoUri}&key=${process.env.API_KEY}`);
              const blob = await vidRes.blob();
              const url = URL.createObjectURL(blob);
              updatePageState(pageId, { videoUrl: url });
          }
      } catch (e) {
          console.error("Video Gen Error", e);
      } finally {
          updatePageState(pageId, { isAnimating: false });
      }
  };

  const launchCatalogue = async () => {
      setIsTransitioning(true);
      
      // Initialize Pages
      const initialPages: LookPage[] = [];
      // Cover
      initialPages.push({ id: 'cover', type: 'cover', isLoading: true, pageIndex: 0 });
      // Story Pages
      for (let i = 1; i <= TOTAL_PAGES; i++) {
          initialPages.push({ id: `page-${i}`, type: 'look', isLoading: true, pageIndex: i });
      }
      setPages(initialPages);

      // 1. Generate Scene List
      const scenes = await generateSceneList();
      
      // 2. Generate Cover Immediately
      const coverScene: SceneDesc = { setting: "Abstract Luxury Background", outfit: selectedStyle, caption: "THE ISSUE" };
      generateImage(coverScene, true).then(url => updatePageState('cover', { imageUrl: url, isLoading: false }));

      setTimeout(() => {
          setShowSetup(false);
          setIsTransitioning(false);
          
          // 3. Generate pages in background
          scenes.forEach((scene, index) => {
              if (index >= TOTAL_PAGES) return;
              const pageId = `page-${index + 1}`;
              updatePageState(pageId, { sceneDesc: scene });
              generateImage(scene, false).then(url => updatePageState(pageId, { imageUrl: url, isLoading: false }));
          });

      }, 1500);
  };

  const handleSheetClick = (index: number) => {
      if (index === 0 && currentSheetIndex === 0) return; // Must use button to open cover
      if (index < currentSheetIndex) setCurrentSheetIndex(index);
      else if (index === currentSheetIndex) setCurrentSheetIndex(prev => prev + 1);
  };

  return (
    <div className="lookbook-scene">
      <Setup 
          show={showSetup} 
          isTransitioning={isTransitioning}
          person={person}
          brand={brand}
          selectedLocation={selectedLocation}
          selectedStyle={selectedStyle}
          onPersonUpload={handlePersonUpload}
          onBrandUpload={handleBrandUpload}
          onLocationChange={setSelectedLocation}
          onStyleChange={setSelectedStyle}
          onLaunch={launchCatalogue}
      />
      
      <Book 
          pages={pages}
          currentSheetIndex={currentSheetIndex}
          onSheetClick={handleSheetClick}
          onOpenBook={() => setCurrentSheetIndex(1)}
          onGenerateVideo={generateVideo}
      />
    </div>
  );
};

export default App;