/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GameState, ScreenId } from './types';
import { INVENTORY } from './data';
import MobileDevice from './components/MobileDevice';
import SpecsViewer from './components/SpecsViewer';
import { 
  Sparkles, 
  HelpCircle, 
  Compass, 
  Layers, 
  Flame, 
  ChevronRight, 
  MonitorSmartphone,
  Gem
} from 'lucide-react';

export default function App() {
  // Initial state for the unified validator workspace
  const [state, setState] = useState<GameState>({
    sanity: 20,
    steps: 3,
    crystals: 1778,
    character: 'helena', // Default character pre-selection state
    activeScreen: 'login', // Initial screen showing adaptive credentials
    isLightMode: false, // Default immersive dark mode chosen by default
    activeTab: 'orbit',
    diceHistory: [],
    inventory: INVENTORY,
    selectedItemIndex: 0,
    matchmakingState: 'idle',
    isDrawerOpen: false,
    claimedDays: [true, true, false, false, false, false, false],
    faqExpanded: null,
    activeSpeaker: 'helena',
    showPenalty: false,
    selectedSkinId: 'skin_helena_rose',
    // Extended mobile states
    hasMonthlyCard: false,
    monthlyCardDaysLeft: 0,
    profileName: '执局者·莫测',
    settingsVolume: 80,
    settingsGraphics: 'high',
    settingsLanguage: 'zh',
    dialogFeedback: null
  });

  // Directly change screen focus from specification clicking
  const handleSpecScreenChange = (screen: ScreenId) => {
    setState(prev => {
      let nextTab = prev.activeTab;
      let nextScreen = screen;
      
      // Map screen focus to appropriate tabs if HUD
      if (screen === 'hud') {
        nextTab = 'orbit';
        nextScreen = 'hud';
      } else if (screen === 'story') {
        nextTab = 'action';
        nextScreen = 'hud';
      } else if (screen === 'wardrobe') {
        nextTab = 'wardrobe';
        nextScreen = 'hud';
      }

      return {
        ...prev,
        activeScreen: nextScreen,
        activeTab: nextTab,
        // Close penalty modal to focus on main layouts when navigating
        showPenalty: false 
      };
    });
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 font-sans p-4 lg:p-8 flex flex-col justify-between radial-geo-grid ${
      state.isLightMode 
        ? 'bg-[#fcfaf4] text-[#4a3b32]' 
        : 'bg-chocolate-dark text-stone-100'
    }`}>
      
      {/* Dynamic Ambient Blur Orbs */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-gradient-to-tr from-gold-light/10 via-transparent to-transparent blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-gradient-to-br from-bronze-dark/10 via-transparent to-transparent blur-3xl pointer-events-none" />

      {/* TOP DECORATIVE META MATRIX RAIL (Anti-AIs-Slop clean human header) */}
      <header className="max-w-7xl mx-auto w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-4 mb-4 border-border-chocolate/40">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-chocolate-card border border-gold-light/40 rounded-xl">
            <Compass className="h-6 w-6 text-gold-light animate-spin-slow" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight font-serif flex items-center gap-2 text-gold-light">
              <span>命运迷局 • 移动版适配原型系统</span>
              <span className="text-[9px] bg-gold-light/20 text-gold-light px-2 py-0.5 rounded-full border border-gold-light/30 font-sans font-medium">
                9:16 HIGH ROTATION
              </span>
            </h1>
            <p className="text-xs opacity-75 font-sans mt-0.5 tracking-wide">
              iPad 高分辨率原型横向分栏降维为竖幅 9:16 移动端触屏规范验证
            </p>
          </div>
        </div>

        {/* Floating Quick status panel */}
        <div className="flex items-center gap-3 bg-chocolate-card/80 border border-border-chocolate px-3.5 py-2 rounded-2xl text-xs font-mono shadow-geo">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-gold-light animate-pulse" />
            <span className="opacity-80 text-gold-light/95">EMULATOR LIVE</span>
          </div>
          <div className="h-4 w-px bg-border-chocolate" />
          <span className="text-stone-300">
            ACTIVE VIEW: <strong className="uppercase font-bold text-gold-light">{state.activeScreen === 'hud' ? `${state.activeTab} HUD` : state.activeScreen}</strong>
          </span>
        </div>
      </header>

      {/* MAIN TWO-COLUMN RESPONSIVE LAYOUT */}
      <main className="max-w-7xl mx-auto w-full flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-2 pb-6">
        
        {/* Left Column: Mobile Emulator Container (col-span 5) */}
        <div className="lg:col-span-5 flex flex-col justify-center items-center">
          <div className="relative">
            {/* High-Fidelity Steampunk Phone Frame */}
            <MobileDevice state={state} setState={setState} />

            {/* Quick Interactive Tooltip indicators */}
            <div className={`absolute -right-28 top-12 hidden xl:flex flex-col gap-2 p-3 rounded-xl border max-w-[130px] shadow-geo ${
              state.isLightMode ? 'bg-[#FCFBF9] border-gold-light/30' : 'bg-[#181716]/95 border-border-chocolate'
            }`}>
              <span className="text-[8px] font-mono text-gold-light opacity-80 block uppercase tracking-wider font-semibold">Simulator Guide</span>
              <p className="text-[10px] leading-snug opacity-80 font-sans">
                可滑动或点按菜单。<b>掷骰按钮</b>可随机产出步骤与晶石，高保真模拟人机循环。
              </p>
            </div>

            <div className={`absolute -left-28 bottom-24 hidden xl:flex flex-col gap-2 p-3 rounded-xl border max-w-[130px] shadow-geo ${
              state.isLightMode ? 'bg-[#FCFBF9] border-gold-light/30' : 'bg-[#181716]/95 border-border-chocolate'
            }`}>
              <span className="text-[8px] font-mono text-gold-light opacity-80 block uppercase tracking-wider font-semibold">Sound Feedback</span>
              <p className="text-[10px] leading-snug opacity-80 font-sans">
                内置 Web Audio 物理触感音效，提供真实的交互振幅体验。
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Specifications Editorial Dashboard (col-span 7) */}
        <div className="lg:col-span-7 flex flex-col h-full min-h-[500px]">
          <SpecsViewer 
            activeScreen={state.activeScreen} 
            onScreenChange={handleSpecScreenChange} 
            isLightMode={state.isLightMode}
          />
        </div>

      </main>

      {/* FOOTER COGNITIVE CREDITS */}
      <footer className="max-w-7xl mx-auto w-full mt-4 pt-4 border-t border-border-chocolate/40 flex flex-col sm:flex-row justify-between items-center text-[10px] opacity-70 font-mono tracking-wide gap-2 text-stone-400">
        <span>© 2026《命运迷局》以太纪元移动化重工局. ALL RIGHTS RESERVED.</span>
        <span className="flex items-center gap-1.5 font-sans">
          <span>DESIGN REF: HIGH-FIDELITY IPAD TABLET WIREFRAMES</span>
          <span>•</span>
          <span className="text-gold-light font-medium">DEVELOPED VIA AI STUDIO</span>
        </span>
      </footer>

    </div>
  );
}
