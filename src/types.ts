/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ScreenId = 'login' | 'character' | 'daily_checkin' | 'loading' | 'hud' | 'leaderboard' | 'story' | 'wardrobe' | 'profile_settings';

export interface GameState {
  sanity: number;
  steps: number;
  crystals: number;
  character: 'helena' | 'steiner' | null;
  activeScreen: ScreenId;
  isLightMode: boolean;
  activeTab: 'orbit' | 'action' | 'inventory' | 'wardrobe' | 'pilgrim' | 'config';
  diceHistory: number[];
  inventory: InventoryItem[];
  selectedItemIndex: number | null;
  matchmakingState: 'idle' | 'searching' | 'matched';
  isDrawerOpen: boolean;
  claimedDays: boolean[];
  faqExpanded: number | null;
  activeSpeaker: 'helena' | 'steiner';
  showPenalty: boolean;
  selectedSkinId: string;
  // Extended Mobile UI state
  hasMonthlyCard: boolean;
  monthlyCardDaysLeft: number;
  profileName: string;
  settingsVolume: number;
  settingsGraphics: 'high' | 'medium' | 'low';
  settingsLanguage: 'zh' | 'en' | 'la';
  dialogFeedback: {
    type: 'success' | 'error' | 'confirm' | 'info';
    title: string;
    message: string;
    confirmText?: string;
    onConfirm: () => void;
  } | null;
}

export interface InventoryItem {
  name: string;
  count: number;
  iconName: string;
  type: string;
  desc: string;
}

export interface SkillDetails {
  name: string;
  desc: string;
  cost: string;
}

export interface CharacterData {
  id: 'helena' | 'steiner';
  name: string;
  title: string;
  avatar: string;
  rarity: string;
  lore: string;
  activeSkill: SkillDetails;
  passiveSkill: SkillDetails;
  hp: number;
  mp: number;
  portraitPath: string;
}
