/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  GameState, 
  InventoryItem, 
  CharacterData 
} from '../types';
import { 
  CHARACTERS, 
  SKINS, 
  INVENTORY, 
  FAQS, 
  LEADERBOARD, 
  STORIES 
} from '../data';
import TimelineHUD from './TimelineHUD';
import { 
  Coins, 
  Compass, 
  Award, 
  Shirt, 
  Swords, 
  Settings, 
  User, 
  Lock, 
  Unlock, 
  X, 
  ChevronDown, 
  ChevronUp, 
  ChevronRight,
  BookOpen,
  RefreshCw, 
  Play, 
  Flame, 
  ShieldAlert, 
  Key, 
  Gem, 
  Check, 
  Volume2, 
  MessageSquare,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Zap,
  HelpCircle,
  Sliders
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MobileDeviceProps {
  state: GameState;
  setState: React.Dispatch<React.SetStateAction<GameState>>;
}

export default function MobileDevice({ state, setState }: MobileDeviceProps) {
  // Local active screen tracking
  const { 
    activeScreen, 
    isLightMode, 
    character, 
    sanity, 
    steps, 
    crystals, 
    activeTab,
    hasMonthlyCard,
    monthlyCardDaysLeft,
    profileName,
    settingsVolume,
    settingsGraphics,
    settingsLanguage,
    dialogFeedback
  } = state;

  // Sound effects simulator using Web Audio API synthesized tones
  const playSound = (type: 'click' | 'roll' | 'success' | 'danger' | 'match') => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
      } else if (type === 'roll') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(200, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(450, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
      } else if (type === 'success') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(400, ctx.currentTime);
        osc.frequency.setValueAtTime(600, ctx.currentTime + 0.1);
        osc.frequency.setValueAtTime(800, ctx.currentTime + 0.18);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      } else if (type === 'danger') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(160, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(80, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.07, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      } else if (type === 'match') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(520, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + 0.45);
      }

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch (e) {
      // Ignored if browser policy blocks autoplay initially
    }
  };

  // Local Matchmaking and Dice states
  const [matchingTimer, setMatchingTimer] = useState<number>(0);
  const [imageError, setImageError] = useState<Record<string, boolean>>({});
  const [matchedOpponent, setMatchedOpponent] = useState<any>(null);
  const [isRollingDice, setIsRollingDice] = useState<boolean>(false);
  const [rollingValue, setRollingValue] = useState<number>(5);
  const [loginUser, setLoginUser] = useState<string>('莫测');
  const [loginPass, setLoginPass] = useState<string>('aether_1955');
  const [loginErr, setLoginErr] = useState<string>('');
  const [activeLoreNode, setActiveLoreNode] = useState<string>('当前命核');
  const [currentNodeId, setCurrentNodeId] = useState<string>('center');
  const [visitedNodeIds, setVisitedNodeIds] = useState<string[]>(['start', 'center']);
  const [spellMessage, setSpellMessage] = useState<string>('');

  // Extended Custom States for Mobile Parity & State Tracking
  const [lordGlow, setLordGlow] = useState<'RATIONAL' | 'EMOTIONAL' | null>(null);
  const [diceBoughtToday, setDiceBoughtToday] = useState<number>(2);
  const [showAgreementModal, setShowAgreementModal] = useState<boolean>(false);
  const [showRegisterModal, setShowRegisterModal] = useState<boolean>(false);
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [showOverviewModal, setShowOverviewModal] = useState<boolean>(false);
  const [showDrawer, setShowDrawer] = useState<boolean>(false);

  // Register fields
  const [newRegUser, setNewRegUser] = useState<string>('');
  const [newRegPass, setNewRegPass] = useState<string>('');
  const [newRegConfirm, setNewRegConfirm] = useState<string>('');

  // Extended Interactive States for smartphone parity
  const [isAiOpen, setIsAiOpen] = useState<boolean>(false);
  const [aiMessage, setAiMessage] = useState<string>('');
  const [aiHistory, setAiHistory] = useState<Array<{ sender: 'ai' | 'player'; text: string }>>([
    { sender: 'ai', text: '主控回路链接完毕。我是「智能守护小秘号」，随时为您定位因果沙盘节点。点选下方快速指令或向我提问：' }
  ]);
  const [showLordHelp, setShowLordHelp] = useState<boolean>(false);
  const [lordTipRevealed, setLordTipRevealed] = useState<string>('');
  const [isLordPanelOpen, setIsLordPanelOpen] = useState<boolean>(false);
  
  // Player edit profile state
  const [tempProfileName, setTempProfileName] = useState<string>('执局者·莫测');

  // Trigger custom state-driven beautiful dialogue alerts
  const triggerFeedback = (
    type: 'success' | 'error' | 'confirm' | 'info',
    title: string,
    message: string,
    onConfirm: () => void,
    confirmText?: string
  ) => {
    playSound(type === 'error' ? 'danger' : 'success');
    setState(prev => ({
      ...prev,
      dialogFeedback: { type, title, message, onConfirm, confirmText }
    }));
  };

  const closeFeedback = () => {
    setState(prev => ({ ...prev, dialogFeedback: null }));
  };

  // Auto loading progress simulated
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  useEffect(() => {
    if (activeScreen === 'loading') {
      setLoadingProgress(5);
      const interval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setState(s => ({ ...s, activeScreen: 'hud', activeTab: 'orbit' }));
              playSound('success');
            }, 500);
            return 100;
          }
          return prev + Math.floor(Math.random() * 20) + 5;
        });
      }, 250);
      return () => clearInterval(interval);
    }
  }, [activeScreen]);

  // Matchmaking simulation Timer
  useEffect(() => {
    let t: any;
    if (state.matchmakingState === 'searching') {
      t = setInterval(() => {
        setMatchingTimer(prev => {
          if (prev >= 4) {
            clearInterval(t);
            playSound('match');
            setMatchedOpponent({
              name: '虚无之理 • 回响型',
              avatar: '🤖',
              power: '2,940 PT',
              skin: '齿轮机械狂热'
            });
            setState(s => ({ ...s, matchmakingState: 'matched' }));
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      setMatchingTimer(0);
    }
    return () => clearInterval(t);
  }, [state.matchmakingState]);

  // Handle dice rolling
  const rollDice = () => {
    if (isRollingDice) return;
    if (diceBoughtToday >= 5) {
      triggerFeedback(
        'error',
        '今日时空限购已满',
        '今日限购命运骰纹契约已达 5/5 次饱满上限！时空齿隙正在极热散热中，暂无法追加更多宿命发条。请克制精神冲动！',
        () => {}
      );
      return;
    }
    playSound('roll');
    setDiceBoughtToday(prev => prev + 1);
    setIsRollingDice(true);
    let count = 0;
    const interval = setInterval(() => {
      setRollingValue(Math.floor(Math.random() * 6) + 1);
      count++;
      if (count > 8) {
        clearInterval(interval);
        const finalVal = Math.floor(Math.random() * 6) + 1;
        setRollingValue(finalVal);
        setIsRollingDice(false);
        
        // Move character dynamically along the gear path based on dice value
        const track = ['center', 'rational_1', 'rational_2', 'intuitive_2', 'intuitive_1', 'start', 'center'];
        const currentIdx = track.indexOf(currentNodeId);
        const stepsToTake = finalVal;
        const nextNode = track[(currentIdx === -1 ? 0 : currentIdx + stepsToTake) % track.length];

        setCurrentNodeId(nextNode);
        setVisitedNodeIds(prev => prev.includes(nextNode) ? prev : [...prev, nextNode]);

        const nodeLabels: Record<string, string> = {
          'start': '以太始源',
          'center': '当前命核',
          'rational_1': '逻辑发条 I',
          'rational_2': '律令核心 II',
          'intuitive_1': '灵觉空跳 I',
          'intuitive_2': '直觉漩涡 II',
          'abyss': '迷狂奇异点'
        };
        setActiveLoreNode(nodeLabels[nextNode] || '当前命核');

        // Update steps & crystals
        setState(prev => {
          const nextCrystals = prev.crystals + finalVal * 15;
          const nextSteps = prev.steps + finalVal;
          // 25% chance of random sanity reduction on dice outcomes (Mysterious Aether erosion)
          const sanityCost = Math.random() < 0.25 ? 2 : 0;
          const nextSanity = Math.max(0, prev.sanity - sanityCost);

          return {
            ...prev,
            steps: nextSteps,
            crystals: nextCrystals,
            sanity: nextSanity,
            diceHistory: [finalVal, ...prev.diceHistory.slice(0, 4)]
          };
        });

        playSound('success');
      }
    }, 100);
  };

  // Step or Leap Action
  const performAction = (actionType: 'step' | 'leap' | 'spell') => {
    playSound('click');
    if (actionType === 'step') {
      if (state.steps < 1) {
        playSound('danger');
        triggerFeedback(
          'error',
          '发条步数耗尽',
          '因果齿轮空置！可操纵的发条步数为 0。请先在主界面的大发条齿轮 [🎲 掷骰 (15)] 获取步数。',
          () => {}
        );
        return;
      }

      // Step along rational chain: center -> rational_1 -> rational_2 -> center
      let nextNode = 'rational_1';
      if (currentNodeId === 'center') nextNode = 'rational_1';
      else if (currentNodeId === 'rational_1') nextNode = 'rational_2';
      else if (currentNodeId === 'rational_2') nextNode = 'center';
      else nextNode = 'rational_1';

      setCurrentNodeId(nextNode);
      setVisitedNodeIds(prev => prev.includes(nextNode) ? prev : [...prev, nextNode]);

      const nodeLabels: Record<string, string> = {
        'start': '以太始源',
        'center': '当前命核',
        'rational_1': '逻辑发条 I',
        'rational_2': '律令核心 II',
        'intuitive_1': '灵觉空跳 I',
        'intuitive_2': '直觉漩涡 II',
        'abyss': '迷狂奇异点'
      };
      setActiveLoreNode(nodeLabels[nextNode] || '当前命核');

      setState(prev => ({
        ...prev,
        steps: prev.steps - 1,
        crystals: prev.crystals + 30
      }));
      setSpellMessage(`理智齿轮旋转！角色已步进至 ${nodeLabels[nextNode]}，以太结晶+30`);
      setTimeout(() => setSpellMessage(''), 2500);
    } else if (actionType === 'leap') {
      // Intuitive leap has 30% chance to fail and deduct SANITY!
      const isSuccess = Math.random() > 0.3;
      const nodeLabels: Record<string, string> = {
        'start': '以太始源',
        'center': '当前命核',
        'rational_1': '逻辑发条 I',
        'rational_2': '律令核心 II',
        'intuitive_1': '灵觉空跳 I',
        'intuitive_2': '直觉漩涡 II',
        'abyss': '迷狂奇异点'
      };

      if (isSuccess) {
        // Leap along intuitive tracks: center -> intuitive_1 -> intuitive_2 -> center
        let nextNode = 'intuitive_1';
        if (currentNodeId === 'center') nextNode = 'intuitive_1';
        else if (currentNodeId === 'intuitive_1') nextNode = 'intuitive_2';
        else if (currentNodeId === 'intuitive_2') nextNode = 'center';
        else nextNode = 'intuitive_1';

        setCurrentNodeId(nextNode);
        setVisitedNodeIds(prev => prev.includes(nextNode) ? prev : [...prev, nextNode]);
        setActiveLoreNode(nodeLabels[nextNode] || '当前命核');

        setState(prev => ({
          ...prev,
          crystals: prev.crystals + 120
        }));
        setSpellMessage(`宿命跃迁成功！避开因果锁，瞬移至 ${nodeLabels[nextNode]}！原石+120`);
        playSound('success');
      } else {
        // Helena passive reduces sanity penalty by 2
        const basePenalty = 4;
        const finalPenalty = character === 'helena' ? Math.max(0, basePenalty - 2) : basePenalty;

        // Fail leaps drag Helena/Steiner into the "abyss" node coordinate as penalty, triggering a high-contrast danger focus!
        setCurrentNodeId('abyss');
        setVisitedNodeIds(prev => prev.includes('abyss') ? prev : [...prev, 'abyss']);
        setActiveLoreNode('迷狂奇异点');

        setState(prev => ({
          ...prev,
          sanity: Math.max(0, prev.sanity - finalPenalty)
        }));
        setSpellMessage(`跳跃紊乱！遭遇以太撕扯，意志坠入 迷狂奇异点！SAN-${finalPenalty}`);
        playSound('danger');
      }
      setTimeout(() => setSpellMessage(''), 3000);
    } else if (actionType === 'spell') {
      // 神之秘仪
      if (state.crystals < 50) {
        playSound('danger');
        triggerFeedback(
          'error',
          '以太结晶告急',
          '您拥有的以太极化晶体不足 50 枚。无法对命运因果进行秘仪洗礼！夺取竞技积分或每日契约来充富底能。',
          () => {}
        );
        return;
      }
      setState(prev => ({
        ...prev,
        crystals: prev.crystals - 50,
        sanity: Math.min(20, prev.sanity + 5)
      }));
      setSpellMessage("神秘阵列发动！以太降流净化心灵，SAN值恢复+5");
      playSound('success');
      setTimeout(() => setSpellMessage(''), 3000);
    }
  };

  // Reset demo
  const resetDemoState = () => {
    playSound('click');
    setState({
      sanity: 20,
      steps: 3,
      crystals: 1778,
      character: 'helena',
      activeScreen: 'login',
      isLightMode: false,
      activeTab: 'orbit',
      diceHistory: [],
      inventory: INVENTORY,
      selectedItemIndex: null,
      matchmakingState: 'idle',
      isDrawerOpen: false,
      claimedDays: [true, true, false, false, false, false, false],
      faqExpanded: null,
      activeSpeaker: 'helena',
      showPenalty: false,
      selectedSkinId: 'skin_helena_rose',
      // Extended mobile defaults
      hasMonthlyCard: false,
      monthlyCardDaysLeft: 0,
      profileName: '执局者·莫测',
      settingsVolume: 80,
      settingsGraphics: 'high',
      settingsLanguage: 'zh',
      dialogFeedback: null
    });
    setTempProfileName('执局者·莫测');
    setMatchedOpponent(null);
  };

  // Simulated Login Submit
  const handleLoginSubmit = () => {
    if (!loginUser.trim()) {
      setLoginErr('以太指纹特征缺失，请输入名字');
      playSound('danger');
      return;
    }
    setLoginErr('');
    playSound('success');
    setState(s => ({ ...s, profileName: loginUser, activeScreen: 'character' }));
    setTempProfileName(loginUser);
  };

  // Simulated claim Check-in
  const claimCheckIn = (dayIndex: number) => {
    if (state.claimedDays[dayIndex]) return;
    playSound('click');
    setState(prev => {
      const nextDays = [...prev.claimedDays];
      nextDays[dayIndex] = true;
      return {
        ...prev,
        claimedDays: nextDays,
        crystals: prev.crystals + 150
      };
    });
    playSound('success');
  };

  // Use Backpack Item
  const useBackpackItem = (index: number) => {
    const item = state.inventory[index];
    if (!item || item.count <= 0) return;
    playSound('click');
    setState(prev => {
      const nextInv = [...prev.inventory];
      let nextSanity = prev.sanity;
      let nextCrystals = prev.crystals;
      
      nextInv[index] = { ...item, count: item.count - 1 };
      
      if (item.name === '常温以太稳定剂') {
        nextSanity = Math.min(20, prev.sanity + 10);
      } else if (item.name === '水星凝霜原石') {
        nextCrystals = prev.crystals + 100;
      } else if (item.name === '精金发条齿轮') {
        nextCrystals = prev.crystals + 20;
      }

      return {
        ...prev,
        inventory: nextInv,
        sanity: nextSanity,
        crystals: nextCrystals
      };
    });
    playSound('success');
  };

  // Buy or equip skin
  const handleSkinAction = (skin: any) => {
    playSound('click');
    if (skin.cost === 0 || skin.unlocked) {
      // Equip directly
      setState(s => ({ ...s, selectedSkinId: skin.id }));
      playSound('success');
    } else {
      // Buy skin
      if (crystals < skin.cost) {
        playSound('danger');
        triggerFeedback(
          'error',
          '交换结晶缺口',
          `以太晶石不足解锁该典藏外观！购买需消耗 ${skin.cost} 水晶，当前可用存量为 ${crystals}。`,
          () => {}
        );
        return;
      }
      setState(prev => ({
        ...prev,
        crystals: prev.crystals - skin.cost,
        selectedSkinId: skin.id
      }));
      skin.unlocked = true; // Update local mock
      playSound('success');
      triggerFeedback(
        'success',
        '契约霓赏熔铸成功',
        `已成功扣减 ${skin.cost} 原石并缔结 ${skin.name} 的永久上身特权契约！可在衣橱中极速穿戴展现。`,
        () => {}
      );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-3 relative select-none">
      
      {/* STEAMPUNK DEV FRAME OUTER EMBELLISHMENTS */}
      <div className={`p-4 rounded-[40px] border-[5px] flex flex-col items-center transition-all shadow-geo z-10 ${
        isLightMode 
          ? 'bg-[#fcfaf4] border-gold-light' 
          : 'bg-[#1c1815] border-border-chocolate text-stone-100'
      }`} style={{ width: '380px', height: '690px' }}>
        
        {/* Device Top Speaker Grille & Lens */}
        <div className="flex items-center gap-3 mb-2 opacity-80">
          <div className="h-1.5 w-12 rounded-full bg-gold-light/40" />
          <div className="h-2.5 w-2.5 rounded-full bg-chocolate-dark border border-gold-light" />
        </div>

        {/* Outer Header quick controls */}
        <div className="w-full px-2 mb-1 flex justify-between items-center text-[10px] font-mono opacity-80">
          <span className="flex items-center gap-1 text-gold-light font-semibold">
            <Volume2 className="h-3 w-3 text-gold-light animate-pulse" />
            SYNTH AUDIO READY
          </span>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setState(s => ({ ...s, isLightMode: !s.isLightMode }))}
              className="px-2 py-0.5 rounded border border-gold-light/45 bg-gold-light/10 text-gold-light hover:bg-gold-light/25 font-bold cursor-pointer"
            >
              {isLightMode ? '🌙 暗色沙盘' : '☀️ 亮影微澜'}
            </button>
            <button 
              onClick={resetDemoState}
              title="重校仪轨"
              className="p-0.5 rounded border border-gold-light/45 text-gold-light hover:bg-gold-light/25 cursor-pointer"
            >
              <RotateCcw className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* INNER 9:16 PHONE SCREEN VIEWPORT */}
        <div className={`w-[342px] h-[585px] rounded-[24px] overflow-hidden relative border flex flex-col transition-all duration-300 ${
          isLightMode 
            ? 'bg-[#FAF7F2] border-gold-light/25 text-[#4a3b32]' 
            : 'bg-chocolate-dark border-border-chocolate text-stone-200'
        }`} id="mobile_viewport">
          
          <AnimatePresence mode="wait">
            
            {/* -------------------- 1. LOGIN SCREEN -------------------- */}
            {activeScreen === 'login' && (
              <motion.div
                key="login"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col p-6 py-8 justify-between bg-gradient-to-b from-[#1c1815] via-chocolate-dark to-[#0a0908]"
              >
                {/* Steampunk Logo Header */}
                <div className="text-center mt-2 flex flex-col items-center">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
                    className="h-16 w-16 mb-2 rounded-full border-2 border-dashed border-gold-light/65 flex items-center justify-center text-gold-light shadow-geo"
                  >
                    <Compass className="h-9 w-9 animate-pulse text-gold-light" />
                  </motion.div>
                  <h1 className="text-2xl font-bold tracking-widest text-gold-light font-serif">命运迷局</h1>
                  <span className="text-[9px] font-mono tracking-widest text-[#e2c799]/85 mt-1 uppercase">
                    FATE MYSTERY MOBILE v1.2
                  </span>
                </div>

                {/* Vertical stacked input credentials */}
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block text-[10px] font-mono tracking-wider text-gold-light mb-1">
                      ENTER IDENTITY / 执局者印记
                    </label>
                    <div className="relative">
                      <input 
                        type="text" 
                        value={loginUser}
                        onChange={(e) => setLoginUser(e.target.value)}
                        className="w-full text-xs bg-[#12100f] border border-border-chocolate/80 rounded-lg py-2.5 px-3 text-stone-100 focus:outline-none focus:border-gold-light font-semibold"
                        placeholder="请输入您的执局勋号..."
                      />
                      <span className="absolute right-3 top-3 text-[10px] text-gold-light opacity-50 font-bold">#莫测</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono tracking-wider text-gold-light mb-1">
                      AETHER SECURITY LINK / 密码锁扣
                    </label>
                    <input 
                      type="password" 
                      value={loginPass}
                      onChange={(e) => setLoginPass(e.target.value)}
                      className="w-full text-xs bg-[#12100f] border border-border-chocolate/80 rounded-lg py-2.5 px-3 text-stone-100 focus:outline-none focus:border-gold-light tracking-widest"
                      placeholder="••••••••"
                    />
                  </div>

                  {loginErr && (
                    <span className="text-[10px] text-rose-400 font-semibold bg-rose-500/10 p-2 rounded-lg text-center border border-rose-500/20">
                      {loginErr}
                    </span>
                  )}

                  <div className="text-[10px] opacity-65 text-center leading-normal text-stone-300 font-sans">
                    勾选代表已达成 <span className="text-gold-light underline">以太契约</span> 与 <span className="text-gold-light underline">理智保障规范</span>
                  </div>
                </div>

                {/* Primary full-width login button in gold touch zone */}
                <div className="mb-2 flex flex-col gap-2.5">
                  <button 
                    onClick={handleLoginSubmit}
                    className="w-full py-3.5 rounded-xl text-xs font-bold tracking-widest bg-gradient-to-r from-[#e28445] via-[#c19a6b] to-[#92400e] hover:brightness-110 active:scale-95 text-stone-950 transition shadow-active border border-yellow-500/35 cursor-pointer font-serif"
                  >
                    进入迷局 CLIMB THE SPIRAL
                  </button>
                  
                  {/* Flanked quick actions for real smartphone logins */}
                  <div className="flex justify-between items-center px-1 text-[9px] font-sans text-stone-400">
                    <button 
                      onClick={() => {
                        playSound('click');
                        setLoginUser('莫测');
                        setLoginPass('aether_1955');
                        triggerFeedback('success', '执局者快速读取', '检测到先前残留的以太印记：执局者·莫测。已急速加载预备特征！', () => {});
                      }}
                      className="hover:text-gold-light cursor-pointer underline decoration-dotted decoration-gold-light/40"
                    >
                      快速登录
                    </button>
                    <span className="opacity-35 font-mono">|</span>
                    <button 
                      onClick={() => {
                        playSound('click');
                        setNewRegUser('');
                        setNewRegPass('');
                        setNewRegConfirm('');
                        setShowRegisterModal(true);
                      }}
                      className="hover:text-gold-light cursor-pointer underline decoration-dotted decoration-gold-light/40 font-bold text-amber-400"
                    >
                      注册号
                    </button>
                    <span className="opacity-35 font-mono">|</span>
                    <button 
                      onClick={() => {
                        playSound('click');
                        setShowAgreementModal(true);
                      }}
                      className="hover:text-gold-light cursor-pointer underline decoration-dotted decoration-gold-light/40 font-bold text-amber-400"
                    >
                      用户协议
                    </button>
                  </div>

                  <p className="text-center text-[7.5px] opacity-40 uppercase tracking-widest mt-1 text-stone-500 font-mono">
                    REPLICATED & ADAPTED FROM IPAD WIREFRAME
                  </p>
                </div>
              </motion.div>
            )}

            {/* -------------------- 2. CHARACTER SELECTION -------------------- */}
            {activeScreen === 'character' && (
              <motion.div
                key="character"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col justify-between p-4 bg-chocolate-dark text-stone-100"
              >
                {/* Header text */}
                <div className="text-center mt-1 shrink-0">
                  <span className="text-[8px] font-mono text-gold-light uppercase tracking-widest block font-bold">命运选择枢纽 • COGNITIVE CROSSINGS</span>
                  <h2 className="text-sm font-bold text-gold-light font-serif mt-0.5">宿命之人已于次元重叠</h2>
                  <p className="text-[8px] opacity-75 leading-relaxed max-w-[210px] mx-auto text-stone-400">请选择并缔结您的契约执棋者，不同角色承载独特的因果被动秘法与理智上限。</p>
                </div>

                {/* Helena vs Steiner - Side-by-Side balanced grid */}
                <div className="flex-grow flex gap-2.5 my-3 items-stretch min-h-0 select-none">
                  {CHARACTERS.map((char) => {
                    const isSelected = character === char.id;
                    return (
                      <div
                        key={char.id}
                        onClick={() => {
                          setState(s => ({ ...s, character: char.id }));
                          playSound('click');
                        }}
                        className={`flex-1 rounded-xl border transition-all duration-300 cursor-pointer relative hover:border-gold-light/60 flex flex-col justify-between p-2.5 overflow-hidden group ${
                          isSelected 
                            ? 'bg-gold-light/10 border-gold-light shadow-active ring-2 ring-gold-light/15' 
                            : 'bg-chocolate-card/85 border-border-chocolate/70'
                        }`}
                      >
                        {/* Selector badge overlay */}
                        <div className={`absolute top-2 right-2 h-4 w-4 rounded-full border flex items-center justify-center transition-all duration-300 ${
                          isSelected 
                            ? 'bg-gold-light border-gold-light text-chocolate-dark scale-110' 
                            : 'border-stone-500 bg-black/40'
                        }`}>
                          {isSelected && <Check className="h-2.5 w-2.5 stroke-[3.5]" />}
                        </div>

                        {/* Title & Avatar */}
                        <div className="flex flex-col items-center text-center mt-1 shrink-0">
                          <span className="text-xl mb-1">{char.avatar}</span>
                          <div>
                            <h3 className={`font-serif font-extrabold text-[11px] leading-tight transition-colors duration-200 ${
                              isSelected ? 'text-gold-light' : 'text-stone-100'
                            }`}>
                              {char.name}
                            </h3>
                            <span className="text-[7px] font-mono text-stone-400 uppercase tracking-widest block mt-0.5">
                              {char.id === 'helena' ? '灵媒大宗' : '哲学使者'}
                            </span>
                          </div>
                        </div>

                        {/* PREMIUM CUSTOM PORTRAIT IMAGE SLOT */}
                        <div className="relative flex-1 min-h-[105px] rounded-lg overflow-hidden border border-gold-light/15 bg-stone-950/80 mt-2 flex flex-col items-center justify-center p-2 text-center group-hover:border-gold-light/25 transition-all">
                          {!imageError[char.portraitPath] ? (
                            <>
                              <img 
                                src={char.portraitPath} 
                                alt={char.name} 
                                onError={() => setImageError(prev => ({ ...prev, [char.portraitPath]: true }))}
                                referrerPolicy="no-referrer"
                                className="absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-500 group-hover:scale-105"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-[#12100f] via-transparent to-black/30 z-10" />
                              <div className="z-20 text-stone-100 flex flex-col items-center pointer-events-none">
                                <span className="text-[7.5px] font-mono font-bold tracking-wider leading-none text-gold-light uppercase">{char.id === 'helena' ? 'HELENA PORTRAIT' : 'STEINER PORTRAIT'}</span>
                                <span className="text-[5.5px] opacity-75 mt-0.5 font-mono">{char.portraitPath}</span>
                              </div>
                            </>
                          ) : (
                            char.id === 'helena' ? (
                              <>
                                <div className="absolute inset-0 bg-gradient-to-t from-purple-950/90 via-purple-900/10 to-stone-950/70" />
                                <div className="absolute inset-1.5 border border-dashed border-purple-500/15 rounded pointer-events-none" />
                                <div className="z-10 flex flex-col items-center gap-1">
                                  <span className="text-[7.5px] font-mono text-rose-400 font-bold tracking-wider leading-none">HELENA PORTRAIT</span>
                                  <span className="text-[6.5px] text-stone-500 font-sans leading-none block">主立绘槽位</span>
                                  <div className="h-4.5 w-4.5 bg-purple-500/10 rounded-full flex items-center justify-center text-[9px] text-purple-400 border border-purple-500/20 mt-1 shadow animate-pulse">👁️</div>
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="absolute inset-0 bg-gradient-to-t from-blue-950/90 via-blue-900/10 to-stone-950/70" />
                                <div className="absolute inset-1.5 border border-dashed border-blue-500/15 rounded pointer-events-none" />
                                <div className="z-10 flex flex-col items-center gap-1">
                                  <span className="text-[7.5px] font-mono text-blue-400 font-bold tracking-wider leading-none">STEINER PORTRAIT</span>
                                  <span className="text-[6.5px] text-stone-500 font-sans leading-none block">主立绘槽位</span>
                                  <div className="h-4.5 w-4.5 bg-blue-500/10 rounded-full flex items-center justify-center text-[9px] text-blue-400 border border-blue-500/20 mt-1 shadow animate-pulse">⚙️</div>
                                </div>
                              </>
                            )
                          )}
                        </div>

                        {/* Stats Info */}
                        <div className="mt-2 text-[7.5px] font-mono space-y-0.5 shrink-0 text-left">
                          <div className="flex justify-between border-b border-border-chocolate/20 pb-0.5">
                            <span className="opacity-60 text-stone-400 font-semibold">MAX SAN:</span>
                            <span className="text-gold-light font-bold">{char.id === 'helena' ? '12 PT' : '20 PT'}</span>
                          </div>
                          <div className="flex justify-between border-b border-border-chocolate/20 pb-0.5">
                            <span className="opacity-60 text-stone-400 font-semibold">INTUITION:</span>
                            <span className="text-stone-300 font-bold">{char.id === 'helena' ? '85%' : '40%'}</span>
                          </div>
                        </div>

                        {/* Passive Skill Details */}
                        <div className="mt-1.5 p-1 bg-black/45 rounded border border-border-chocolate/30 text-[7px] text-stone-300 text-left shrink-0">
                          <span className="text-gold-light font-serif font-bold block">✨ 被动: {char.activeSkill.name}</span>
                          <span className="opacity-75 block text-[6.5px] mt-0.5 leading-tight">{char.activeSkill.desc}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Bound Fate trigger full width at bottom */}
                <div className="mt-auto shrink-0 pt-1.5 h-14 flex items-center">
                  <AnimatePresence>
                    {character && (
                      <motion.button
                        key="connect-button"
                        initial={{ opacity: 0, scale: 0.95, y: 15 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 15 }}
                        onClick={() => {
                          if (!character) return;
                          playSound('success');
                          setState(s => ({ ...s, activeScreen: 'daily_checkin' }));
                        }}
                        className="w-full py-3.5 rounded-xl text-xs font-bold tracking-widest bg-gradient-to-r from-gold-light via-amber-500 to-amber-600 text-[#0c0a09] hover:brightness-110 active:scale-95 cursor-pointer shadow-active font-serif border border-yellow-500/30 transition-all duration-300"
                      >
                        确认选择并缔结宿命灵锁 (CONFIRM DESTINY LOCK)
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}

            {/* -------------------- 2.5 DAILY CHECK-IN (PINNED FORWARD) -------------------- */}
            {activeScreen === 'daily_checkin' && (
              <motion.div
                key="daily_checkin"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col justify-between p-4 bg-gradient-to-b from-[#1c1815] via-chocolate-dark to-[#090807] text-stone-100 font-sans"
              >
                {/* Header */}
                <div className="text-center mt-2 shrink-0">
                  <div className="h-10 w-10 rounded-full border border-gold-light/40 bg-gold-light/10 flex items-center justify-center text-gold-light mx-auto mb-2 animate-pulse">
                    <Award className="h-5 w-5" />
                  </div>
                  <span className="font-mono text-[7px] tracking-widest text-[#a88158] block mb-0.5 uppercase">
                    DAILY SIGNATURE CONTRACT / 每日星轨契约缔结
                  </span>
                  <h3 className="text-sm font-serif font-bold text-gold-light">每日契约签到</h3>
                  <p className="text-[8px] opacity-75 max-w-[240px] mx-auto text-stone-400 mt-0.5">
                    降临发条仪沙盘之前，请签署以太纪元回馈契约，直接认领丰沛的结晶奖励。
                  </p>
                </div>

                {/* 7-Day compact grid for mobile */}
                <div className="flex-grow flex flex-col justify-center my-3 gap-2.5">
                  <div className="grid grid-cols-4 gap-2">
                    {Array.from({ length: 7 }).map((_, idx) => {
                      const claimed = state.claimedDays[idx];
                      const dayRewards = [
                        { name: 'D1 • 原石契约', detail: '原石+150', icon: '150' },
                        { name: 'D2 • 稳定物料', detail: '原石+150', icon: '150' },
                        { name: 'D3 • 理性之曜', detail: '原石+150', icon: '150' },
                        { name: 'D4 • 盲维罗盘', detail: '罗盘×1', icon: '🧭' },
                        { name: 'D5 • 发条之晶', detail: '原石+150', icon: '150' },
                        { name: 'D6 • 步进以太', detail: '原石+150', icon: '150' },
                        { name: 'D7 • 理智神殿', detail: '发条钥匙×1', icon: '🔑' },
                      ];

                      return (
                        <div
                          key={idx}
                          onClick={() => {
                            if (!claimed) {
                              playSound('success');
                              setState(prev => {
                                const nextDays = [...prev.claimedDays];
                                nextDays[idx] = true;
                                return {
                                  ...prev,
                                  claimedDays: nextDays,
                                  crystals: prev.crystals + 150
                                };
                              });
                            }
                          }}
                          className={`p-2 rounded-lg border flex flex-col items-center justify-between text-center cursor-pointer transition-all ${
                            idx === 6 ? 'col-span-2 py-3 border-amber-500/40 bg-amber-500/5' : ''
                          } ${
                            claimed
                              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400'
                              : 'bg-[#12100f] border-border-chocolate/60 text-stone-300 hover:border-gold-light/60 hover:bg-[#1a1715]'
                          }`}
                        >
                          <span className="text-[7px] font-mono opacity-60 leading-none">DAY 0{idx + 1}</span>
                          <span className="text-xs my-0.5 block">{dayRewards[idx].icon === '150' ? '💎' : dayRewards[idx].icon}</span>
                          <span className="text-[7px] font-bold tracking-tight">{claimed ? '已签署领取' : dayRewards[idx].detail}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Aesthetic visual check-in guide */}
                  <div className="p-2.5 rounded-xl border border-dashed border-border-chocolate/40 bg-[#12100f]/60 text-center text-[7.5px] text-stone-400 leading-normal max-w-[240px] mx-auto">
                    “时空流沙的累进需要仪式证明。签署当前高能契约即可激活发条盘，获取本季奖励配额。”
                  </div>
                </div>

                {/* Confirm sign check & Proceed directly to loading screen */}
                <div className="mt-auto shrink-0">
                  <button
                    onClick={() => {
                      playSound('success');
                      // Ensure first unclaimed day is marked claimed
                      setState(prev => {
                        const nextDays = [...prev.claimedDays];
                        const nextUnclaimed = nextDays.findIndex(d => !d);
                        let finalCrystals = prev.crystals;
                        if (nextUnclaimed !== -1) {
                          nextDays[nextUnclaimed] = true;
                          finalCrystals += 150;
                        }
                        return {
                          ...prev,
                          claimedDays: nextDays,
                          crystals: finalCrystals,
                          activeScreen: 'loading'
                        };
                      });
                    }}
                    className="w-full py-3.5 rounded-xl text-xs font-bold tracking-widest bg-gradient-to-r from-amber-600 via-[#e28445] to-gold-light text-[#0c0a09] hover:brightness-110 active:scale-95 cursor-pointer shadow-active font-serif border border-yellow-500/35 transition-all"
                  >
                    🚀 签到领赏并熔铸纪元 (CHECK-IN & LAUNCH)
                  </button>
                </div>
              </motion.div>
            )}

            {/* -------------------- 3. LOADING SCREEN -------------------- */}
            {activeScreen === 'loading' && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col justify-center items-center p-6 bg-chocolate-dark text-stone-100"
              >
                <div className="text-center flex flex-col items-center max-w-xs">
                  {/* Glowing core gears */}
                  <div className="relative h-20 w-20 flex items-center justify-center mb-6">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 text-gold-light/20"
                    >
                      <svg width="100%" height="100%" viewBox="0 0 100 100" fill="currentColor">
                        <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="6 4" />
                      </svg>
                    </motion.div>
                    
                    <motion.div
                      animate={{ rotate: -360 }}
                      transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                      className="text-gold-light"
                    >
                      <Compass className="h-10 w-10 animate-pulse text-gold-light" />
                    </motion.div>
                  </div>

                  {/* PDF core adapted progress text */}
                  <h3 className="text-sm font-semibold tracking-wide text-gold-light mb-1.5 font-serif">
                    以太纪元重合熔融中...
                  </h3>
                  <div className="w-48 h-1 bg-[#12100f] border border-border-chocolate/40 rounded-full overflow-hidden mb-2">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-[#e28445] to-gold-light rounded-full"
                      style={{ width: `${loadingProgress}%` }}
                    />
                  </div>
                  <span className="font-mono text-[10px] tracking-widest text-[#e28445] font-semibold">
                    AETHER FUSION PROGRESS: {loadingProgress}%
                  </span>

                  <p className="text-[9px] opacity-60 mt-6 leading-relaxed font-sans text-stone-300">
                    在时空的断层格点重新排定前，理智流沙与直觉空跃的双轨发条正在对准...
                  </p>
                </div>
              </motion.div>
            )}

            {/* -------------------- 11. PLAYER PROFILE & SYSTEM SETTINGS SCREEN -------------------- */}
            {activeScreen === 'profile_settings' && (
              <motion.div
                key="profile_settings"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                className="absolute inset-0 flex flex-col justify-between p-4 py-5 bg-gradient-to-b from-[#1c1815] via-chocolate-dark to-[#090807] text-stone-100 font-sans select-none"
              >
                {/* Visual Header */}
                <div className="flex items-center justify-between border-b border-gold-light/20 pb-2.5">
                  <div className="flex items-center gap-1.5 text-gold-light font-serif">
                    <Sliders className="h-4 w-4 text-gold-light animate-spin-slow" />
                    <span className="font-bold text-xs tracking-wider">系统配置与执局印记</span>
                  </div>
                  <button
                    onClick={() => {
                      playSound('click');
                      setState(s => ({ ...s, activeScreen: 'hud' }));
                    }}
                    className="p-1 rounded-full border border-gold-light/35 bg-gold-light/10 text-gold-light hover:bg-gold-light/25 active:scale-95 cursor-pointer leading-none"
                  >
                    ✕
                  </button>
                </div>

                {/* Main scrollable body */}
                <div className="flex-1 overflow-y-auto pr-0.5 py-3 flex flex-col gap-4 min-h-0 text-[11px]">
                  
                  {/* Top Section: Avatar, ID, leveling stats */}
                  <div className="p-3 rounded-xl border border-border-chocolate/80 bg-chocolate-card/65 flex flex-col gap-2.5 shadow-geo">
                    <div className="flex items-center gap-3">
                      {/* Avatar within steampunk orbit wires */}
                      <div className="relative h-12 w-12 rounded-full border border-gold-light/50 bg-stone-950 flex items-center justify-center text-xl shadow-active">
                        <div className="absolute inset-0.5 rounded-full border-2 border-dashed border-rose-500/20 animate-spin-slow" />
                        {character === 'helena' ? '👩‍🎤' : '👨‍🔧'}
                      </div>

                      <div className="flex-1 flex flex-col gap-1">
                        {/* Nickname modifier input */}
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[8px] font-mono text-gold-light tracking-widest uppercase font-bold leading-none">
                            执局者名字密钥 (RE-INIT IDENTITY)
                          </span>
                          <div className="flex gap-1.5 items-center mt-1">
                            <input
                              type="text"
                              value={tempProfileName}
                              onChange={(e) => {
                                setTempProfileName(e.target.value);
                              }}
                              className="bg-stone-950 border border-border-chocolate/80 rounded px-2 py-1 text-stone-100 font-semibold focus:outline-none focus:border-gold-light text-[10px] w-full"
                              maxLength={12}
                              placeholder="核对名字印记..."
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="h-px bg-border-chocolate/40 my-0.5" />

                    {/* Leveling indicators */}
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="opacity-80">执局等级: <strong className="text-gold-light">时辰贤者 (凡)</strong></span>
                        <span className="font-mono text-gold-light font-bold">LV.42</span>
                      </div>
                      <div className="w-full h-1.5 bg-[#12100f] border border-border-chocolate/45 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full" style={{ width: '51.6%' }} />
                      </div>
                      <div className="flex justify-between text-[8px] font-mono opacity-50">
                        <span>1550 EXP</span>
                        <span>3000 LIMIT</span>
                      </div>
                    </div>

                    {/* Account bind stats */}
                    <div className="flex justify-between items-center bg-[#12100f] p-1.5 rounded border border-border-chocolate/35 text-[9px] font-mono text-stone-400 mt-0.5">
                      <span>安全信标关联 (BINDING)</span>
                      <span className="text-emerald-400 font-bold flex items-center gap-0.5">
                        <Check className="h-2 w-2 text-emerald-400" /> 以太签名密钥
                      </span>
                    </div>
                  </div>

                  {/* Middle Settings Toggles & Sliders */}
                  <div className="p-3 rounded-xl border border-border-chocolate/80 bg-chocolate-card/65 flex flex-col gap-3.5">
                    
                    {/* Audio volume slider */}
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between text-[10px] font-mono">
                        <span className="text-stone-300 font-semibold">🎼 音频音量合成器 (MASTER AUDIO)</span>
                        <span className="text-gold-light font-bold">{settingsVolume}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={settingsVolume}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          setState(prev => ({ ...prev, settingsVolume: val }));
                        }}
                        className="w-full h-1 bg-[#12100f] rounded-lg appearance-none cursor-pointer accent-gold-light"
                      />
                    </div>

                    {/* Dark Mode toggle */}
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-stone-300 font-semibold">☀️ 亮色模式/暗色沙盘</span>
                        <span className="text-[8px] opacity-60 leading-tight">即时倾倒以太色谱</span>
                      </div>
                      <button
                        onClick={() => {
                          playSound('click');
                          setState(s => ({ ...s, isLightMode: !s.isLightMode }));
                        }}
                        className={`px-3 py-1 text-[9px] rounded-md font-bold cursor-pointer transition ${
                          isLightMode 
                            ? 'bg-amber-600 text-stone-950 shadow-active border border-amber-400/30' 
                            : 'bg-stone-950 text-stone-300 border border-border-chocolate'
                        }`}
                      >
                        {isLightMode ? '亮影开启' : '暗夜冥想'}
                      </button>
                    </div>

                    {/* Graphics switcher */}
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] text-[#e28445] font-semibold block leading-none">⚙️ 宿命图形渲染品质 (GRAPHICS REZ)</span>
                      <div className="flex gap-1.5">
                        {(['high', 'medium', 'low'] as const).map((g) => {
                          const names = { high: '高解析以太', medium: '中恒发条', low: '极简流沙' };
                          const isSel = settingsGraphics === g;
                          return (
                            <button
                              key={g}
                              onClick={() => {
                                playSound('click');
                                setState(s => ({ ...s, settingsGraphics: g }));
                              }}
                              className={`flex-1 py-1 rounded text-[8.5px] font-bold border transition duration-200 cursor-pointer ${
                                isSel 
                                  ? 'bg-gold-light/10 border-gold-light text-gold-light' 
                                  : 'bg-stone-950 text-stone-400 border-border-chocolate hover:text-stone-200'
                              }`}
                            >
                              {names[g]}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Language dropdown */}
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-stone-300 font-semibold">🗺️ 时空时宿定位语言</span>
                      <select
                        value={settingsLanguage}
                        onChange={(e) => {
                          playSound('click');
                          setState(s => ({ ...s, settingsLanguage: e.target.value as any }));
                        }}
                        className="bg-stone-950 border border-border-chocolate rounded px-2 py-0.5 text-[10px] text-stone-200 focus:outline-none focus:border-gold-light"
                      >
                        <option value="zh">🇨🇳 简体中文</option>
                        <option value="en">🇬🇧 Aether English</option>
                        <option value="la">📜 Classical Latin</option>
                      </select>
                    </div>

                  </div>

                </div>

                {/* Bottom Actions Row */}
                <div className="border-t border-border-chocolate/40 pt-3 flex flex-col gap-2 shrink-0">
                  <div className="flex gap-2">
                    {/* Switch Account */}
                    <button
                      onClick={() => {
                        playSound('danger');
                        triggerFeedback(
                          'confirm',
                          '断开当前以太链接',
                          '此操作将注销当前执局身份印记并退回凭证建立界面。确定要降维断开吗？',
                          () => {
                            setState(prev => ({
                              ...prev,
                              activeScreen: 'login',
                              hasMonthlyCard: false,
                              crystals: 1778,
                              steps: 3,
                              sanity: 20
                            }));
                          },
                          '确认降维注销'
                        );
                      }}
                      className="flex-1 py-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/30 text-[10px] font-bold cursor-pointer hover:bg-rose-500/20 active:scale-95 transition"
                    >
                      切换账号
                    </button>

                    {/* Contact Customer Service / Pigeon */}
                    <button
                      onClick={() => {
                        playSound('click');
                        triggerFeedback(
                          'success',
                          '命运秘旨客服飞鸽',
                          `【命运终局客服信道已接通】\n飞鸽传音：执局者 ${profileName} 安好！若您遇到卡机或者结晶延迟注入，请不要惊慌，请在心流中默念「艾尔号」即可。我们将于两个沙盘刻度内修正宇宙规则。`,
                          () => {}
                        );
                      }}
                      className="flex-1 py-2 rounded-lg bg-[#3D86CD]/10 text-[#3D86CD] border border-[#3D86CD]/30 text-[10px] font-bold cursor-pointer hover:bg-[#3D86CD]/20 active:scale-95 transition"
                    >
                      联系客服
                    </button>
                  </div>

                  {/* Save and Close */}
                  <button
                    onClick={() => {
                      if (!tempProfileName.trim()) {
                        triggerFeedback('error', '勋号不可为空', '请写入完整的名字印记！以太不愿命名虚无的执局之人。', () => {});
                        return;
                      }
                      playSound('success');
                      setState(s => ({
                        ...s,
                        profileName: tempProfileName.trim(),
                        activeScreen: 'hud'
                      }));
                      triggerFeedback('success', '印记重构成功', '执局者名字密钥与各项时宿音量渲染参数已经保存至发条主核中！', () => {});
                    }}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:brightness-110 active:scale-95 text-stone-950 font-serif font-bold text-xs tracking-wider cursor-pointer shadow-active border border-yellow-500/20 transition"
                  >
                    保存并返回沙盘
                  </button>
                </div>
              </motion.div>
            )}

            {/* -------------------- 4-7. MAIN APP SHELL WITH TABS -------------------- */}
            {activeScreen !== 'login' && activeScreen !== 'character' && activeScreen !== 'daily_checkin' && activeScreen !== 'loading' && activeScreen !== 'profile_settings' && (
              <motion.div
                key="app_main"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 flex flex-col h-full relative"
              >
                {/* TOP HEADER STATUS BAR (Replicates Top status exactly) */}
                <div className={`px-4 py-2 flex items-center justify-between border-b shrink-0 ${
                  isLightMode ? 'bg-[#FAF7F2] border-gold-light/20' : 'bg-chocolate-card border-border-chocolate/40'
                }`}>
                  <div 
                    onClick={() => {
                      playSound('click');
                      setState(s => ({ ...s, activeScreen: 'profile_settings' }));
                    }}
                    className="flex items-center gap-2 cursor-pointer hover:bg-gold-light/5 p-1 rounded-lg transition-all group"
                    title="点击打开个人信息与系统设置"
                  >
                    {/* User profile with Character specific avatar */}
                    <div className="h-7 w-7 rounded-full border border-gold-light bg-gold-light/10 flex items-center justify-center text-xs shadow-geo group-hover:scale-105 transition-transform duration-300">
                      {character === 'helena' ? '👩‍🎤' : '👨‍🔧'}
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="text-[9px] font-bold tracking-tight font-serif text-gold-light group-hover:underline">
                          {profileName}
                        </span>
                        <span className="text-[7.5px] bg-gold-light/20 text-gold-light px-0.5 py-0.2 rounded font-mono leading-none font-semibold">
                          {character === 'helena' ? '灵媒' : '哲学'}
                        </span>
                      </div>
                      {/* Active profile role label */}
                      <span className="text-[7.5px] font-mono block opacity-60 leading-none mt-0.5 flex items-center gap-0.5">
                        ID: FATE_472834 <span className="text-gold-light font-bold">⚙️设置</span>
                      </span>
                    </div>
                  </div>

                  {/* Resource meters stacked neatly - SANITY, STEPS, crystals */}
                  <div className="flex items-center gap-2 text-[9px] font-mono">
                    <div className="flex items-center gap-0.5 bg-rose-500/10 text-rose-400 px-1.5 py-0.5 rounded border border-rose-500/20" title="SAN值">
                      <Zap className="h-2.5 w-2.5" />
                      <strong>SAN:</strong> {sanity}/20
                    </div>

                    <div className="flex items-center gap-0.5 bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded border border-blue-500/20" title="可累积，步数无上限">
                      <Compass className="h-2.5 w-2.5" />
                      <strong>步数:</strong> {steps} <span className="text-[7.5px] opacity-75 font-serif">(无上限)</span>
                    </div>

                    <div className="flex items-center gap-0.5 bg-gold-light/10 text-gold-light px-1.5 py-0.5 rounded border border-gold-light/20" title="以太原石">
                      <Gem className="h-2.5 w-2.5 animate-pulse" />
                      <strong>以太:</strong> {crystals}
                    </div>
                  </div>
                </div>

                {/* MAIN INNER SCROLLABLE CONTENT ACCORDING TO TABS */}
                <div className="flex-1 overflow-y-auto relative p-3 flex flex-col gap-3 min-h-0 pb-16">
                  
                  {/* -------------------- TAB 1: 深览·命轨 (COGNITIVE ORBIT SCREEN) -------------------- */}
                  {activeTab === 'orbit' && (
                    <>
                      {/* Interactive Sandbox Wrapper with Floating Buttons */}
                      <div className="relative rounded-2xl overflow-hidden shrink-0 border border-gold-light/20 shadow-geo">
                        {/* Floating Rankings Drawer Trigger */}
                        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 z-35 select-none">
                          <button
                            onClick={() => {
                              playSound('click');
                              setShowDrawer(true);
                            }}
                            className="py-3 px-1.5 bg-stone-950/95 hover:bg-gold-light/10 text-gold-light border-y border-r border-gold-light/35 rounded-r-xl shadow-lg flex flex-col items-center gap-1 cursor-pointer transition-all duration-200 active:scale-95 text-[8.5px] tracking-widest text-gold-light leading-none"
                            title="点击侧拉执局者天梯榜"
                          >
                            <span className="font-serif font-bold">🏆</span>
                            <span className="font-mono text-[7px]" style={{ writingMode: 'vertical-lr' }}>RANK</span>
                          </button>
                        </div>

                        {/* Floating Seasons Overview Trigger */}
                        <div className="absolute right-2 top-2 z-35 select-none">
                          <button
                            onClick={() => {
                              playSound('click');
                              setShowOverviewModal(true);
                            }}
                            className="btn-macro-map p-1.5 px-2 bg-stone-950/90 border border-gold-light/45 text-gold-light rounded-lg shadow-geo hover:bg-gold-light/15 active:scale-95 transition-all text-[8px] font-bold font-serif flex items-center gap-1 cursor-pointer leading-none animate-bounce"
                          >
                            <span>🗺️</span>
                            <span>大盘总览</span>
                          </button>
                        </div>

                        <TimelineHUD 
                          isLightMode={isLightMode} 
                          sanity={sanity} 
                          character={character}
                          currentNodeId={currentNodeId}
                          visitedNodeIds={visitedNodeIds}
                          lordGlow={lordGlow}
                          onNodeClick={(n) => {
                            playSound('click');
                            setActiveLoreNode(n);
                          }} 
                        />
                      </div>

                      {/* Display warning feedback if spell message active */}
                      {spellMessage && (
                        <div className="p-2 text-[10px] font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-center rounded-lg animate-bounce leading-none">
                          {spellMessage}
                        </div>
                      )}

                      {/* COLLAPSIBLE GREAT LORD PANEL INTEGRATED DIRECTLY */}
                      <div className={`rounded-xl border flex flex-col overflow-hidden transition-all duration-300 shadow-geo shrink-0 ${
                        isLightMode ? 'bg-[#FAF7F2] border-gold-light/25' : 'bg-[#12100f]/90 border-border-chocolate/40'
                      }`}>
                        {/* Header handle to toggle */}
                        <div
                          onClick={() => {
                            playSound('click');
                            setIsLordPanelOpen(!isLordPanelOpen);
                          }}
                          className="flex justify-between items-center bg-[#090807]/30 p-2 cursor-pointer hover:bg-gold-light/5 transition-all"
                        >
                          <span className="text-[10px] font-bold text-gold-light flex items-center gap-1.5 font-serif">
                            <Compass className="h-3.2 w-3.2 text-orange-500 animate-spin-slow" />
                            大君神启 • 因果天平集成盘
                          </span>
                          <span className="text-[7px] font-mono bg-orange-500/15 text-orange-400 border border-orange-500/20 px-1 py-0.2 rounded font-bold">
                            {isLordPanelOpen ? 'COLLAPSE / 收起' : 'EXPAND / 展开'}
                          </span>
                        </div>

                        {/* Collapsed view details */}
                        {isLordPanelOpen && (
                          <div className="p-2 border-t border-border-chocolate/25 flex flex-col gap-1.5 bg-[#090807]/35 text-[9px] animate-fadeIn">
                            <p className="text-[7.5px] opacity-75 text-stone-400 font-sans leading-relaxed">
                              执棋核心呼唤古神，大君降临沙盘。可在下方承袭神旨增益：
                            </p>
                            <div className="grid grid-cols-2 gap-2 mt-0.5">
                              {/* Option Rational */}
                              <div className="p-1 px-1.5 border border-[#3D86CD]/30 rounded bg-[#12100f] flex flex-col justify-between">
                                <span className="text-[7px] font-mono text-[#3D86CD] font-bold uppercase truncate">RATIONAL / 理性向</span>
                                <span className="text-[8px] font-bold text-gold-light font-serif mt-0.5">确定性定势 (+5步)</span>
                                <button
                                  onClick={() => {
                                    playSound('success');
                                    setState(s => ({ ...s, steps: s.steps + 5 }));
                                    triggerFeedback(
                                      'success',
                                      '理性大君的发条神启',
                                      '古典理性大君降赐【确定性定势】！时枢轴承跃迁，发条总步数直接增加 +5 步！',
                                      () => {}
                                    );
                                  }}
                                  className="mt-1.5 py-1 text-center font-bold text-[7.5px] bg-[#3D86CD]/10 text-stone-100 hover:bg-[#3D86CD]/25 border border-[#3D86CD]/40 rounded cursor-pointer leading-none transition-all active:scale-95"
                                >
                                  理性承袭
                                </button>
                              </div>

                              {/* Option Emotional */}
                              <div className="p-1 px-1.5 border border-orange-500/35 rounded bg-[#12100f] flex flex-col justify-between">
                                <span className="text-[7px] font-mono text-orange-400 font-bold uppercase truncate">EMOTIONAL / 感性向</span>
                                <span className="text-[8px] font-bold text-[#e28445] font-serif mt-0.5 font-bold uppercase truncate">盲维抚慰 (SAN 满额)</span>
                                <button
                                  onClick={() => {
                                    playSound('click');
                                    setState(s => ({ ...s, sanity: 20 }));
                                    triggerFeedback(
                                      'success',
                                      '感性大君的盲维抚慰',
                                      '直觉大君撕裂思维迷障！神迹抚慰，精神理智值 (SAN) 强制原点恢复至 20 PT！',
                                      () => {}
                                    );
                                  }}
                                  className="mt-1.5 py-1 text-center font-bold text-[7.5px] bg-orange-500/10 text-stone-100 hover:bg-orange-500/25 border border-orange-500/40 rounded cursor-pointer leading-none transition-all active:scale-95"
                                >
                                  感性承袭
                                </button>
                              </div>
                            </div>

                            {/* Great Lord Path Coloring Dynamic Aura Feedback */}
                            <div className="mt-2 border-t border-border-chocolate/20 pt-2 flex flex-col gap-1 text-[8px]">
                              <span className="font-semibold text-gold-light font-serif block text-left">🌌 大君命轨路径染层强反馈 (Aura Contrast) - 消耗 20 结晶:</span>
                              <div className="flex gap-1.5 mt-1">
                                <button
                                  onClick={() => {
                                    if (crystals < 20) {
                                      triggerFeedback('error', '以太结晶不足', '古典大君对寒微之客闭目。需至少 20 颗以太结晶以激活偏误校准！', () => {});
                                      return;
                                    }
                                    playSound('success');
                                    setState(prev => ({ ...prev, crystals: prev.crystals - 20 }));
                                    setLordGlow('RATIONAL');
                                    triggerFeedback(
                                      'success',
                                      '理性之曜照临路径',
                                      '您行纳祭祀完成！前方逻辑命轨已浸润蔚蓝光晕， border shadow 瞬间点燃！',
                                      () => {}
                                    );
                                  }}
                                  className={`flex-1 py-1 px-0.5 rounded border text-[7.5px] font-bold transition duration-200 cursor-pointer ${
                                    lordGlow === 'RATIONAL'
                                      ? 'bg-blue-900/45 border-[#00f0ff] text-[#00f0ff] shadow-active'
                                      : 'bg-black/60 border-border-chocolate/50 text-[#3D86CD] hover:text-[#00f0ff]'
                                  }`}
                                >
                                  🔴 理性向 (Neon-Blue)
                                </button>

                                <button
                                  onClick={() => {
                                    if (crystals < 20) {
                                      triggerFeedback('error', '以太结晶不足', '古典大君对寒微之客闭目。需至少 20 颗以太结晶以激活感性突围！', () => {});
                                      return;
                                    }
                                    playSound('success');
                                    setState(prev => ({ ...prev, crystals: prev.crystals - 20 }));
                                    setLordGlow('EMOTIONAL');
                                    triggerFeedback(
                                      'success',
                                      '直觉奇迹唤醒路径',
                                      '您行纳祭祀完成！前方灵动命轨已浸润深紫光晕，物理高压突变提示已开启！',
                                      () => {}
                                    );
                                  }}
                                  className={`flex-1 py-1 px-0.5 rounded border text-[7.5px] font-bold transition duration-200 cursor-pointer ${
                                    lordGlow === 'EMOTIONAL'
                                      ? 'bg-purple-900/45 border-[#df55ff] text-[#df55ff] shadow-active'
                                      : 'bg-black/60 border-border-chocolate/50 text-[#e28445] hover:text-[#df55ff]'
                                  }`}
                                >
                                  🟣 感性向 (Neon-Violet)
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Action Matrix & Roll Section (Highly Compact Micro-icon stream) */}
                      <div className={`p-1.5 px-2.5 rounded-xl border flex flex-col gap-1 shrink-0 shadow-geo ${
                        isLightMode ? 'bg-[#FAF7F2] border-gold-light/25' : 'bg-chocolate-card border-border-chocolate/40'
                      }`}>
                        <div className="flex justify-between items-center text-[7.5px] font-mono opacity-80 leading-none">
                          <span className="flex items-center gap-0.5 text-gold-light font-bold">
                            <Sparkles className="h-2 w-2" />
                            ACT MATRIX / 因果动作
                          </span>
                          <span className="text-stone-400">DICE: {state.diceHistory.slice(-3).join(', ') || '暂无'}</span>
                        </div>

                        <div className="flex gap-1.5 items-center justify-between">
                          {/* Three quick action mini keys */}
                          <div className="flex-1 grid grid-cols-3 gap-1">
                            <button
                              onClick={() => { playSound('click'); performAction('step'); }}
                              className={`py-1 px-1 rounded border text-[7.5px] font-bold font-serif leading-none active:scale-95 transition-all truncate cursor-pointer ${
                                isLightMode 
                                  ? 'bg-orange-50/50 border-gold-light/30 hover:bg-gold-light/15 text-[#4a3b32]' 
                                  : 'bg-[#12100f] border-border-chocolate/60 hover:bg-gold-light/10 text-stone-200'
                              }`}
                              title="理智步进: 确率 100% | 步数-1"
                            >
                              理智步进
                            </button>

                            <button
                              onClick={() => { playSound('click'); performAction('leap'); }}
                              className={`py-1 px-1 rounded border text-[7.5px] font-bold font-serif leading-none active:scale-95 transition-all truncate cursor-pointer ${
                                isLightMode 
                                  ? 'bg-orange-50/50 border-gold-light/30 hover:bg-gold-light/15 text-[#4a3b32]' 
                                  : 'bg-[#12100f] border-border-chocolate/60 hover:bg-gold-light/10 text-stone-200'
                              }`}
                              title="直觉空跃: 30%狂迷风险 | 步数0"
                            >
                              直觉空跃
                            </button>

                            <button
                              onClick={() => { playSound('click'); performAction('spell'); }}
                              className={`py-1 px-1 rounded border text-[7.5px] font-bold font-serif leading-none active:scale-95 transition-all truncate cursor-pointer ${
                                isLightMode 
                                  ? 'bg-orange-50/50 border-gold-light/30 hover:bg-gold-light/15 text-[#4a3b32]' 
                                  : 'bg-[#12100f] border-border-chocolate/60 hover:bg-gold-light/10 text-stone-200'
                              }`}
                              title="神之秘仪: 耗原石-50 | SAN+5"
                            >
                              神之秘仪
                            </button>
                          </div>

                           {/* Rolling Dice action */}
                           <div className="flex flex-col items-center gap-0.5 select-none shrink-0">
                             <button
                               onClick={() => { playSound('click'); rollDice(); }}
                               disabled={isRollingDice || diceBoughtToday >= 5}
                               className={`px-2 py-1.5 rounded text-[7px] font-bold font-serif leading-none border border-gold-light/40 flex items-center gap-0.5 transition-all shadow-sm cursor-pointer ${
                                 isRollingDice
                                   ? 'bg-[#12100f] text-stone-500'
                                   : diceBoughtToday >= 5
                                   ? 'opacity-40 pointer-events-none bg-stone-900/60 border-red-500/10 text-rose-500'
                                   : 'bg-gradient-to-r from-orange-500 to-amber-600 text-stone-950 font-extrabold hover:brightness-110 active:scale-95 animate-pulse'
                               }`}
                             >
                               <span>🎲</span>
                               <span className="truncate">{isRollingDice ? `[${rollingValue}]` : '掷骰 (15)'}</span>
                             </button>
                             <span className="text-[6.5px] font-mono text-center block mt-0.5 text-gold-light/80 leading-none">
                               今日限购: {diceBoughtToday}/5
                             </span>
                           </div>
                        </div>
                      </div>

                      {/* COGNITION DRAWER: bottom sheet handle */}
                      <div className={`mt-auto p-2.5 rounded-xl border flex flex-col gap-2 shadow-geo ${
                        isLightMode ? 'bg-[#FAF7F2] border-gold-light/25' : 'bg-chocolate-card border-border-chocolate/40'
                      }`}>
                        <div 
                          onClick={() => setState(s => ({ ...s, isDrawerOpen: !s.isDrawerOpen }))}
                          style={{ cursor: 'pointer' }}
                          className="flex justify-between items-center bg-gold-light/15 p-2 rounded-lg cursor-pointer hover:bg-gold-light/25 border border-gold-light/20"
                        >
                          <span className="text-[10px] font-semibold text-gold-light flex items-center gap-1 font-serif">
                            <BookOpen className="h-3 w-3" />
                            COGNITION DRAWER / 命运契约与手册 (展开)
                          </span>
                          {state.isDrawerOpen ? <ChevronDown className="h-3.5 w-3.5 text-gold-light" /> : <ChevronUp className="h-3.5 w-3.5 text-gold-light" />}
                        </div>

                        {/* Expandable drawer items */}
                        {state.isDrawerOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="flex flex flex-col gap-2 pt-1"
                          >
                            {/* Season progress 75% bar */}
                            <div className="p-2 border border-border-chocolate/60 rounded bg-[#12100f] text-[9px]">
                              <div className="flex justify-between mb-1 text-stone-300">
                                <span className="opacity-75 font-mono">季限因果征程进度 (Season Progress)</span>
                                <span className="font-bold text-gold-light font-serif">75%</span>
                              </div>
                              <div className="w-full h-2 rounded-full bg-stone-950 overflow-hidden relative">
                                <div className="h-full bg-gradient-to-r from-[#e28445] to-gold-light" style={{ width: '75%' }} />
                                <div className="absolute top-0 right-[25%] h-full w-0.5 bg-yellow-400 animate-pulse" />
                              </div>
                            </div>

                            {/* Daily Check-in grids (每日契约签到) */}
                            <div className="p-2 border border-border-chocolate/60 rounded bg-chocolate-dark text-[9px]">
                              <span className="text-gold-light font-semibold font-mono block mb-1">每日契约签到 (Daily Reward Coins)</span>
                              <div className="grid grid-cols-7 gap-1">
                                {state.claimedDays.map((claimed, idx) => (
                                  <button
                                    key={idx}
                                    onClick={() => claimCheckIn(idx)}
                                    className={`py-1.5 px-0.5 rounded text-center font-mono cursor-pointer ${
                                      claimed 
                                        ? 'bg-[#1c2e26]/90 border border-emerald-500/40 text-emerald-400' 
                                        : 'bg-[#12100f] border border-border-chocolate/60 text-stone-400 hover:border-gold-light'
                                    }`}
                                  >
                                    <div>D{idx+1}</div>
                                    <div className="text-[7.5px] mt-0.5">{claimed ? '已领' : '+150'}</div>
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* FAQs accordions */}
                            <div className="space-y-1 mt-1">
                              {FAQS.map((faq, index) => {
                                const isExpanded = state.faqExpanded === index;
                                return (
                                  <div key={index} className="border border-border-chocolate/60 rounded overflow-hidden">
                                    <button
                                      onClick={() => setState(s => ({ ...s, faqExpanded: isExpanded ? null : index }))}
                                      className="w-full p-2 text-left text-[9px] font-semibold flex justify-between items-center hover:bg-gold-light/10 text-stone-300 cursor-pointer"
                                    >
                                      <span className="font-serif">{faq.q}</span>
                                      {isExpanded ? <ChevronDown className="h-3 w-3 text-gold-light" /> : <ChevronRight className="h-3 w-3 text-gold-light" />}
                                    </button>
                                    {isExpanded && (
                                      <p className="p-2 border-t border-border-chocolate/40 text-[8.5px] opacity-85 leading-relaxed bg-[#12100f] text-stone-300">
                                        {faq.a}
                                      </p>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </>
                  )}

                  {/* -------------------- TAB 2: 动作·发条 (STORY & DIALOGUE SCREEN) -------------------- */}
                  {activeTab === 'action' && (
                    <div className="flex-1 flex flex-col justify-between gap-3 min-h-0">
                      
                      {/* Character dialogue avatars at top side-by-side */}
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#12100f] border border-border-chocolate/40 shrink-0">
                        {/* Helena */}
                        <div className={`flex items-center gap-2 p-1.5 rounded-lg border transition cursor-pointer ${
                          state.activeSpeaker === 'helena' ? 'border-gold-light bg-gold-light/10 shadow-active' : 'border-[#1c1815] opacity-60'
                        }`} onClick={() => setState(s => ({ ...s, activeSpeaker: 'helena' }))}>
                          <span className="text-xl">👩‍🎤</span>
                          <div>
                            <span className="text-[9px] font-bold block text-stone-200">Helena 灵媒</span>
                            <span className="text-[7.5px] font-mono text-gold-light font-bold">ACTIVE RESONANCE</span>
                          </div>
                        </div>

                        {/* Glowing indicator line representing discussion dynamic */}
                        <div className="flex-1 px-4 flex flex-col items-center">
                          <span className="text-[8px] font-mono tracking-widest text-gold-light uppercase mb-0.5">SOUL FEEDBACK</span>
                          <div className="w-full h-1 bg-stone-950 rounded-full relative overflow-hidden">
                            <div className="h-full bg-gold-light animate-pulse" style={{ width: '60%' }} />
                          </div>
                        </div>

                        {/* Steiner */}
                        <div className={`flex items-center gap-2 p-1.5 rounded-lg border transition cursor-pointer ${
                          state.activeSpeaker === 'steiner' ? 'border-gold-light bg-gold-light/10 shadow-active' : 'border-[#1c1815] opacity-60'
                        }`} onClick={() => setState(s => ({ ...s, activeSpeaker: 'steiner' }))}>
                          <span className="text-xl">👨‍🔧</span>
                          <div>
                            <span className="text-[9px] font-bold block text-stone-200">Steiner 哲学</span>
                            <span className="text-[7.5px] font-mono text-[#3D86CD] font-bold">STANDBY LOGIC</span>
                          </div>
                        </div>
                      </div>

                      {/* Scrollable Story Narrative container */}
                      <div className="flex-1 p-3.5 rounded-xl border bg-[#12100f] border-border-chocolate/40 overflow-y-auto max-h-[190px]">
                        <span className="text-gold-light font-bold text-[9px] font-mono block mb-1">
                          ACTIVE STORY CHRONO / 命运卷轴
                        </span>
                        <h4 className="font-semibold text-xs text-gold-light mb-1.5 font-serif">
                          {STORIES[0].title}
                        </h4>
                        <p className="text-[10px] leading-relaxed opacity-90 text-stone-200 text-justify font-sans">
                          {STORIES[0].text}
                        </p>
                      </div>

                      {/* Choice Stack in gold area */}
                      <div className="flex flex-col gap-2 mt-auto">
                        <button
                          onClick={() => {
                            playSound('success');
                            setState(prev => ({
                              ...prev,
                              steps: prev.steps + 3,
                              crystals: Math.max(0, prev.crystals - 50)
                            }));
                            setSpellMessage("已选择 选项 A: 理智发条锁死，步进+3，消耗原石50");
                            setTimeout(() => setSpellMessage(''), 3000);
                          }}
                          className="w-full p-2.5 rounded-lg text-left text-[9px] border bg-[#12100f]/90 hover:bg-[#1c1815] border-border-chocolate/60 relative cursor-pointer"
                        >
                          <span className="absolute right-2 top-2 px-1 text-[7.5px] rounded bg-[#3D86CD]/20 text-[#3D86CD] font-mono font-bold">理智路径</span>
                          <span className="font-bold text-stone-100 block font-serif">选项 A: 开启稳定防波堤</span>
                          <span className="opacity-80 block text-[8px] text-[#3D86CD]/95 mt-0.5">{STORIES[0].optAEffect}</span>
                        </button>

                        <button
                          onClick={() => {
                            playSound('danger');
                            // Helena passive saves 2 sanities
                            const isPenaltyTrigger = Math.random() < 0.4;
                            if (isPenaltyTrigger) {
                              playSound('danger');
                              setState(s => ({ ...s, showPenalty: true, sanity: Math.max(0, s.sanity - 4) }));
                            } else {
                              setState(prev => ({
                                ...prev,
                                crystals: prev.crystals + 150
                              }));
                              setSpellMessage("神迹逆涌成功！躲过古神回响，以太原石 +150 PT！");
                              setTimeout(() => setSpellMessage(''), 2500);
                            }
                          }}
                          className="w-full p-2.5 rounded-lg text-left text-[9px] border bg-[#12100f]/90 hover:bg-[#1c1815] border-border-chocolate/65 relative cursor-pointer"
                        >
                          <span className="absolute right-2 top-2 px-1 text-[7.5px] rounded bg-[#e28445]/20 text-[#e28445] font-mono font-bold">直觉本能</span>
                          <span className="font-bold text-stone-100 block font-serif">选项 B: 逆涌注入意志流</span>
                          <span className="opacity-80 block text-[8px] text-[#e28445]/95 mt-0.5">{STORIES[0].optBEffect}</span>
                        </button>

                        {/* Trigger Punishment Feedback explicitly */}
                        <button
                          onClick={() => {
                            playSound('danger');
                            setState(s => ({ ...s, showPenalty: true, sanity: Math.max(0, s.sanity - 4) }));
                          }}
                          className="w-full py-1.5 rounded-lg border border-dashed border-rose-500/40 text-[9px] text-center font-mono hover:bg-rose-500/10 text-rose-400 cursor-pointer"
                        >
                          ⚠ 立即模拟触发疯狂惩罚反馈事件 (Aether Penalty Alert)
                        </button>
                      </div>
                    </div>
                  )}

                  {/* -------------------- TAB 3: 现物·秘藏 (9-SLOT INVENTORY SCREEN) -------------------- */}
                  {activeTab === 'inventory' && (
                    <div className="flex-1 flex flex-col justify-between gap-1 text-stone-300 min-h-0">
                      
                      {/* Stash Header */}
                      <div className="flex justify-between items-center text-[10px] font-mono border-b border-border-chocolate/40 pb-1.5 shrink-0">
                        <span className="text-gold-light font-bold text-xs font-serif">执局神圣秘藏箱 (INVENTORY)</span>
                        <span>容量: {state.inventory.filter(i => i.count > 0).length}/9 格已满</span>
                      </div>

                      {/* 3x3 Responsive Inventory Grid optimized for fingertips */}
                      <div className="grid grid-cols-3 gap-2 shrink-0 my-1">
                        {Array.from({ length: 9 }).map((_, index) => {
                          const item: InventoryItem | undefined = state.inventory[index];
                          const isSelected = state.selectedItemIndex === index;
                          const isOwned = item && item.count > 0;

                          return (
                            <div
                              key={index}
                              onClick={() => {
                                if (item) {
                                  setState(s => ({ ...s, selectedItemIndex: index }));
                                  playSound('click');
                                }
                              }}
                              className={`aspect-square rounded-xl border transition-all duration-300 flex flex-col items-center justify-center p-1.5 relative cursor-pointer ${
                                isSelected 
                                  ? 'bg-gold-light/10 border-gold-light shadow-active' 
                                  : item 
                                    ? 'bg-[#12100f] border-border-chocolate/75 hover:border-gold-light/40 text-stone-200 shadow-sm' 
                                    : 'bg-[#12100f]/30 border-border-chocolate/20 border-dashed cursor-default text-stone-600'
                              }`}
                            >
                              {/* OWNED Badge for precision adaptation */}
                              {isOwned && (
                                <span className="absolute top-1 left-1 px-1 py-0.2 rounded bg-gold-light/15 border border-gold-light/35 text-gold-light text-[6.5px] font-mono font-bold leading-none transform scale-90">
                                  已拥有
                                </span>
                              )}

                              {item ? (
                                <>
                                  <span className="text-xl mb-0.5 flex items-center justify-center">
                                    {item.name === '精金发条齿轮' ? '⚙️' : 
                                     item.name === '常温以太稳定剂' ? '🧪' : 
                                     item.name === '盲维直觉罗盘' ? '🧭' : 
                                     item.name === '因果发条钥匙' ? '🔑' : '💎'}
                                  </span>
                                  <span className="text-[8px] font-bold text-stone-200 text-center truncate px-0.5 w-full">
                                    {item.name}
                                  </span>
                                  <span className="absolute bottom-1 right-1 text-[8px] font-mono px-1 rounded bg-stone-950/80 text-gold-light font-bold">
                                    x{item.count}
                                  </span>
                                </>
                              ) : (
                                <span className="text-[7px] font-mono tracking-widest text-[#4d3b2b]">LOCKED</span>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Selected Item details card underneath */}
                      <div className="flex-1 overflow-y-auto pr-0.5 mt-0.5 min-h-[75px] max-h-[145px]">
                        {state.selectedItemIndex !== null && state.inventory[state.selectedItemIndex] ? (
                          <div className="p-2.5 rounded-xl border bg-[#12100f]/85 border-gold-light/35 text-[9px] flex flex-col gap-1.5 animate-fadeIn">
                            <div className="flex justify-between items-center border-b border-border-chocolate/30 pb-1">
                              <span className="font-bold text-xs text-gold-light font-serif">
                                {state.inventory[state.selectedItemIndex].name}
                              </span>
                              <span className="px-1.5 py-0.2 rounded bg-gold-light/10 text-gold-light font-semibold font-mono text-[7px] border border-gold-light/20">
                                {state.inventory[state.selectedItemIndex].type}
                              </span>
                            </div>
                            <p className="opacity-85 leading-relaxed font-sans text-stone-300">
                              {state.inventory[state.selectedItemIndex].desc}
                            </p>
                            <div className="flex justify-between items-center pt-1 mt-0.5">
                              <span className="opacity-60 text-[8px] text-stone-400 font-mono">
                                AETHER STASH COUNT: {state.inventory[state.selectedItemIndex].count}
                              </span>
                              <button
                                onClick={() => useBackpackItem(state.selectedItemIndex!)}
                                disabled={(state.inventory[state.selectedItemIndex]?.count || 0) <= 0}
                                className={`py-1 px-3 rounded text-[9px] font-bold tracking-wider leading-none cursor-pointer ${
                                  (state.inventory[state.selectedItemIndex]?.count || 0) <= 0
                                    ? 'bg-zinc-800 text-stone-500 border border-zinc-700/30 cursor-not-allowed'
                                    : 'bg-gold-light text-chocolate-dark hover:brightness-110 active:scale-95 shadow-geo'
                                }`}
                              >
                                {state.inventory[state.selectedItemIndex].name.includes('稳定') ? '使用稳定剂' : '激活使用'}
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="p-4 rounded-xl border border-dashed border-border-chocolate/50 text-center text-[9px] opacity-75 text-stone-400">
                            ◀ 请点击上方秘宝装备查看具体因果效能
                          </div>
                        )}
                      </div>

                      {/* Bottom Button to close inventory block */}
                      <button
                        onClick={() => {
                          playSound('click');
                          setState(s => ({ ...s, activeTab: 'orbit' }));
                        }}
                        className="w-full py-2 rounded-xl text-[10px] font-bold tracking-widest bg-[#12100f] border border-gold-light/25 text-gold-light hover:bg-[#1c1815] transition active:scale-95 cursor-pointer flex items-center justify-center gap-1 shrink-0 mt-0.5"
                      >
                        📥 合拢藏宝封顶 (CLOSE INVENTORY)
                      </button>

                    </div>
                  )}

                  {/* -------------------- TAB 4: 贵物·原石 (WARDROBE CAROUSEL SCREEN) -------------------- */}
                  {activeTab === 'wardrobe' && (
                    <div className="flex-1 flex flex-col gap-3">
                      <div className="flex justify-between items-center text-[10px] font-mono border-b border-border-chocolate/40 pb-1.5 shrink-0 text-stone-300">
                        <span className="text-gold-light font-semibold">WARDROBE & COSMETICS / 衣橱秘誓</span>
                        <span>可用原石: {crystals}</span>
                      </div>

                      {/* Swipe / List of Skins (3 Skins) adapted beautifully */}
                      <div className="space-y-3 flex-1 overflow-y-auto">
                        {SKINS.map((skin) => {
                          const isEquipped = state.selectedSkinId === skin.id;
                          return (
                            <div
                              key={skin.id}
                              className={`p-3 rounded-xl border flex flex-col gap-1.5 relative overflow-hidden transition-all duration-300 ${
                                isEquipped 
                                  ? 'bg-[#12100f] border-gold-light shadow-active' 
                                  : 'bg-chocolate-card border-border-chocolate/50 text-stone-300'
                              }`}
                            >
                              <div className={`absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b ${skin.accent}`} />
                              
                              <div className="flex justify-between items-start pl-1.5">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-bold text-xs text-gold-light font-serif">{skin.name}</h4>
                                    <span className="px-1 py-0.2 rounded text-[7px] bg-rose-500/20 text-rose-400 font-bold font-sans">
                                      {skin.rarity}
                                    </span>
                                  </div>
                                  <span className="text-[8px] font-mono text-stone-400 block mt-0.5">OWNER: {skin.ownerId === 'helena' ? 'Helena' : 'Steiner/Moci'}</span>
                                </div>
                                <span className="px-1.5 py-0.5 rounded bg-stone-950 text-[7.5px] font-bold text-gold-light font-serif">
                                  {skin.tag}
                                </span>
                              </div>

                              {/* SKIN PREVIEW GRAPHIC ASSET SLOT */}
                              <div className="relative h-16 w-full rounded-lg overflow-hidden border border-gold-light/10 bg-stone-950/80 my-1 flex items-center justify-center text-center">
                                {!imageError[skin.imagePath || ''] ? (
                                  <>
                                    <img 
                                      src={skin.imagePath} 
                                      alt={skin.name} 
                                      onError={() => setImageError(prev => ({ ...prev, [skin.imagePath || '']: true }))}
                                      referrerPolicy="no-referrer"
                                      className="absolute inset-0 w-full h-full object-cover z-0 opacity-80 hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#12100f] via-transparent to-black/35 z-10" />
                                    <div className="z-20 text-stone-200 text-center pointer-events-none flex flex-col items-center">
                                      <span className="text-[7.5px] font-mono tracking-wider font-bold leading-none uppercase text-gold-light">SKIN CARD SLOT</span>
                                      <span className="text-[6px] opacity-75 mt-0.5 font-mono">{skin.imagePath}</span>
                                    </div>
                                  </>
                                ) : (
                                  <div className={`absolute inset-0 bg-gradient-to-r ${skin.accent} opacity-20 flex items-center justify-center`}>
                                    <span className="text-[7.5px] font-serif text-gold-light text-center">✨ 立绘渲染备用背景</span>
                                  </div>
                                )}
                              </div>

                              <p className="text-[9px] opacity-80 leading-relaxed pl-1.5 font-sans animate-fadeIn">
                                {skin.desc}
                              </p>

                              <div className="mt-1 flex justify-between items-center pt-1.5 border-t border-border-chocolate/40 pl-1.5">
                                <span className="font-mono text-[9px] text-gold-light font-semibold">
                                  {skin.cost === 0 ? '免费形态' : `以太结晶: ${skin.cost}`}
                                </span>
                                
                                <button
                                  onClick={() => handleSkinAction(skin)}
                                  className={`px-3 py-1 rounded text-[8px] font-bold tracking-widest cursor-pointer ${
                                    isEquipped 
                                      ? 'bg-emerald-600 text-stone-100 shadow-active' 
                                      : skin.unlocked 
                                        ? 'bg-[#12100f] text-stone-200 border border-border-chocolate/70 hover:bg-gold-light/10' 
                                        : 'bg-gold-light text-chocolate-dark hover:brightness-110 active:scale-95 shadow-geo'
                                  }`}
                                >
                                  {isEquipped ? '✓ 已上身' : skin.unlocked ? '穿戴' : '解锁 (使用原石)'}
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* -------------------- TAB 5: 灵临·朝圣 (ARENA MATCHMAKING SCREEN) -------------------- */}
                  {activeTab === 'pilgrim' && (
                    <div className="flex-1 flex flex-col gap-3 min-h-0 text-stone-300">
                      
                      {/* Top Season Title */}
                      <div className="flex items-center justify-between bg-gold-light/10 border border-gold-light/25 rounded-lg px-2.5 py-1.5 shrink-0">
                        <div className="flex items-center gap-1.5">
                          <Compass className="h-3.5 w-3.5 text-gold-light animate-spin-slow" />
                          <span className="text-[10px] font-bold font-serif text-gold-light tracking-wide">
                            第二赛季：原子充能-铀索崩塌
                          </span>
                        </div>
                        <span className="text-[7.5px] bg-[#e28445]/20 text-[#e28445] font-mono px-1 py-0.2 rounded font-bold uppercase">
                          S2 LIVE
                        </span>
                      </div>

                      {/* 128 Ladder Points Progress Bar */}
                      <div className="bg-[#12100f] p-2.5 rounded-xl border border-border-chocolate/40 flex flex-col gap-1.5 shrink-0">
                        <div className="flex justify-between items-center text-[9px] font-semibold">
                          <span className="flex items-center gap-1">
                            🏆 当前天梯等级: <strong className="text-gold-light">精金信标守卫</strong>
                          </span>
                          <span className="text-gold-light font-mono font-bold">128 / 200 分</span>
                        </div>
                        <div className="w-full h-2 bg-[#090807] border border-border-chocolate/40 rounded-full overflow-hidden p-[1px]">
                          <div className="h-full bg-gradient-to-r from-amber-600 via-orange-500 to-gold-light rounded-full" style={{ width: '64%' }} />
                        </div>
                        <div className="flex justify-between text-[7px] font-mono opacity-50">
                          <span>原初白银 (60分)</span>
                          <span>星钻大君 (200分)</span>
                        </div>
                      </div>

                      {/* Primogem Monthly Card Block */}
                      <div className="border border-gold-light/40 bg-gradient-to-b from-chocolate-card/80 to-[#12100f] rounded-xl p-3 flex flex-col gap-2 relative overflow-hidden shrink-0">
                        {/* Premium Tag decorative */}
                        <div className="absolute right-0 top-0 bg-gradient-to-l from-amber-600 to-amber-500 text-stone-950 font-serif font-extrabold text-[7px] px-2 py-0.5 rounded-bl shadow-sm uppercase tracking-widest">
                          PREMIUM PASS
                        </div>

                        <div className="flex flex-col gap-0.5">
                          <span className="font-serif font-bold text-xs text-gold-light flex items-center gap-1 leading-none">
                            尊贵原石月卡
                          </span>
                          <span className="text-[8px] opacity-60 font-mono tracking-tight leading-none mt-1">
                            AETHER PRIMOGEM MONTHLY CONTRACT / 100% 官方正版权益
                          </span>
                        </div>

                        <ul className="text-[8px] text-stone-300 space-y-1 my-1 list-disc pl-3">
                          <li>
                            <strong>每日注入结晶:</strong> 登录后自动向主发条盘注入 <span className="text-gold-light font-bold">3 枚以太原石</span> (持续 30 天，共计 90 枚晶体材料)。
                          </li>
                          <li>
                            <strong>高维物料配置:</strong> 尊享背包物品熔融合成 10% 成功加成，在因果流沙配额中享有优先匹配队列等级。
                          </li>
                          <li>
                            <strong>不支持重复购买 / Not available for duplicate purchase:</strong> 契约不可堆叠，生效期间限制重复下单认购。
                          </li>
                        </ul>

                        <div className="flex items-center justify-between border-t border-border-chocolate/30 pt-2 mt-1 shrink-0">
                          <div className="flex flex-col">
                            <span className="text-[7.5px] opacity-50 leading-none">购买代价 (PRICE)</span>
                            <span className="font-serif text-gold-light font-bold text-xs mt-0.5">30 以太结晶 / (模拟专售试用版)</span>
                          </div>

                          {state.hasMonthlyCard ? (
                            <button
                              disabled
                              className="px-3 py-1.5 rounded-lg bg-zinc-800 text-stone-500 border border-zinc-700 font-bold text-[9px] cursor-not-allowed flex items-center gap-1"
                            >
                              🔒 已在生效中 | 不支持重复购买
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                playSound('roll');
                                triggerFeedback(
                                  'confirm',
                                  '认购尊贵原石月卡',
                                  '确定消耗 30 颗以太晶石，缔结 30 天【尊贵原石月卡】契约协议吗？此契约每日自动给您的账号注入 3 原石晶石。',
                                  () => {
                                    if (crystals < 30) {
                                      triggerFeedback('error', '以太结晶不足', '您的以太结晶少于 30 枚，无法结纳此高维金卡契约！请先在沙盘解密星轨或签到获取结晶。', () => {});
                                      return;
                                    }
                                    playSound('success');
                                    setState(prev => ({
                                      ...prev,
                                      crystals: prev.crystals - 30,
                                      hasMonthlyCard: true,
                                      monthlyCardDaysLeft: 30
                                    }));
                                    triggerFeedback(
                                      'success',
                                      '原石月卡协议签署生效',
                                      '恭喜！「尊贵原石月卡」已即时激活绑定！未来 30 天您每天登录都将直接获取 3 枚原石。不支持重复购买购买保障已生效。',
                                      () => {}
                                    );
                                  },
                                  '确认划扣30原石认购'
                                );
                              }}
                              className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-amber-600 to-amber-400 hover:brightness-110 active:scale-95 text-stone-950 font-bold text-[9px] cursor-pointer shadow-geo border border-amber-400/25 transition"
                            >
                              立即认购月卡
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Main queue card layout */}
                      <div className="flex-1 flex flex-col justify-center items-center p-3 border border-border-chocolate/45 rounded-xl bg-chocolate-card/80 py-4 my-0.5 shadow-geo text-stone-300 min-h-[90px]">
                        {state.matchmakingState === 'idle' && (
                          <div className="text-center flex flex-col items-center">
                            <span className="text-2xl animate-bounce">⚔️</span>
                            <span className="text-[10px] font-semibold text-gold-light mt-1.5 block font-serif">执局序列：准备就绪</span>
                            <p className="text-[8px] opacity-75 mt-0.5 max-w-[210px] leading-normal font-sans text-stone-400">
                              匹配系统将抓取此时处于同一时空定位下的其他执棋者，比拼双方的发条步阶与理智。
                            </p>
                          </div>
                        )}

                        {state.matchmakingState === 'searching' && (
                          <div className="text-center flex flex-col items-center">
                            <RefreshCw className="h-6 w-6 text-gold-light animate-spin mb-2" />
                            <span className="text-[10px] font-semibold text-gold-light block font-serif">
                              时空契约捕获中... [ {matchingTimer}s / 5s ]
                            </span>
                            <span className="text-[7px] font-mono tracking-widest block opacity-75 mt-0.5 text-stone-400">
                              CAPTURING VIRTUAL RESONANCE POINT
                            </span>
                          </div>
                        )}

                        {state.matchmakingState === 'matched' && matchedOpponent && (
                          <div className="w-full space-y-2">
                            <div className="text-center font-bold text-[9px] text-emerald-400 font-mono tracking-wider animate-pulse mb-0.5">
                              ✓ COMPATIBLE OPPONENT ACQUIRED!
                            </div>
                            
                            <div className="flex justify-between items-center px-2 py-1 bg-[#12100f] border border-border-chocolate/50 rounded-xl">
                              <div className="text-left">
                                <span className="text-[7px] font-mono block opacity-60 text-stone-400">MY OPPONENT</span>
                                <span className="text-[10px] font-bold font-sans text-rose-400 leading-none">{matchedOpponent.name}</span>
                                <span className="text-[8px] block font-mono text-gold-light font-bold mt-0.5">{matchedOpponent.power}</span>
                              </div>
                              <span className="text-lg">{matchedOpponent.avatar}</span>
                            </div>

                            <p className="text-[8px] opacity-80 leading-normal text-center bg-emerald-950/20 p-1.5 rounded border border-emerald-500/20 text-emerald-300 font-sans">
                              理智对比结果：<strong>莫测 ({sanity} PT)</strong> vs <strong>对家 ({matchedOpponent.power === '2,940 PT' ? '14 PT' : '11 PT'})</strong>。此轮对抗取得执局大捷，以太结晶+200！
                            </p>

                            <button
                              onClick={() => {
                                playSound('click');
                                setState(s => ({ ...s, crystals: s.crystals + 200, matchmakingState: 'idle' }));
                                setMatchedOpponent(null);
                              }}
                              className="w-full py-1.5 rounded bg-emerald-600 font-bold text-stone-100 text-[9px] tracking-wider transition-all hover:bg-emerald-500 cursor-pointer shadow-geo"
                            >
                              提取对决奖励并重返战备 (Claim +200)
                            </button>
                          </div>
                        )}
                      </div>

                      {/* High touch gold zone full width CTA buttons */}
                      <div className="mt-auto shrink-0 mb-0.5">
                        {state.matchmakingState === 'idle' && (
                          <button
                            onClick={() => {
                              playSound('roll');
                              setState(s => ({ ...s, matchmakingState: 'searching' }));
                            }}
                            className="w-full py-2.5 rounded-xl font-bold tracking-wider text-[11px] transition bg-gradient-to-r from-red-600 via-[#FF932E] to-gold-light hover:brightness-110 active:scale-95 text-stone-950 shadow-active font-serif cursor-pointer"
                          >
                            开始快速匹配对战（时空比阶）
                          </button>
                        )}
                        {state.matchmakingState === 'searching' && (
                          <button
                            onClick={() => {
                              playSound('click');
                              setState(s => ({ ...s, matchmakingState: 'idle' }));
                            }}
                            className="w-full py-1.5 rounded-xl font-semibold text-[9px] text-zinc-400 border border-border-chocolate/40 bg-chocolate-card hover:text-stone-200 cursor-pointer"
                          >
                            中断以太捕获 (Cancel Match)
                          </button>
                        )}
                      </div>

                    </div>
                  )}

                  {/* -------------------- TAB 6: 游戏配置 (LEADERBOARD & LORD HELP SCREEN) -------------------- */}
                  {activeTab === 'config' && (
                    <div className="flex-1 flex flex-col justify-between gap-3 min-h-0 text-stone-300">
                      
                      {/* Leaderboard scrollable part */}
                      <div className="flex flex-col gap-2 min-h-0 overflow-y-auto max-h-[190px]">
                        <div className="flex justify-between items-center text-[10px] font-mono opacity-85 border-b border-border-chocolate/40 pb-1.5 shrink-0">
                          <span className="text-gold-light font-bold">LEADERBOARD TOP-5 / 贤者榜</span>
                          <span>执局等级-凡</span>
                        </div>

                        <div className="space-y-1.5">
                          {LEADERBOARD.map((item, index) => (
                            <div
                              key={index}
                              className={`p-2 rounded-xl border flex justify-between items-center text-[9px] ${
                                isLightMode ? 'bg-[#FAF7F2] border-gold-light/25 text-[#4a3b32]' : 'bg-[#12100f]/90 border-border-chocolate/40 text-stone-200'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <span className={`px-1 rounded font-bold font-mono text-[8px] ${item.color}`}>
                                  {item.rank}
                                </span>
                                <span className="font-semibold text-stone-200 font-serif">{item.name}</span>
                              </div>
                              <span className="font-mono text-gold-light font-bold">{item.point}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Interactive Simulated Network Interrupt Switch */}
                      <div className={`p-2.5 rounded-xl border flex flex-col gap-1 shrink-0 ${
                        isLightMode ? 'bg-[#FAF7F2] border-gold-light/25' : 'bg-black/40 border-border-chocolate/40'
                      }`}>
                        <div className="flex justify-between items-center select-none text-[8.5px]">
                          <div className="flex flex-col text-left mr-2">
                            <span className="font-bold text-gold-light font-serif">⚠️ 物理断网仿真模拟 (Simulate Connection Drop)</span>
                            <span className="text-[7px] text-stone-400 font-mono">TEST OFFLINE FREEZE MODAL</span>
                          </div>
                          <button
                            onClick={() => {
                              playSound('danger');
                              setIsOffline(!isOffline);
                            }}
                            className={`px-2 py-1 rounded text-[7.5px] font-bold border transition duration-200 cursor-pointer ${
                              isOffline
                                ? 'bg-[#ff3b30]/20 border-[#ffff3b]/40 text-[#ff8177] shadow-active'
                                : 'bg-stone-900 border-stone-700 text-stone-400 hover:text-stone-200'
                            }`}
                          >
                            {isOffline ? '已离线/OFFLINE' : '在线中/ONLINE'}
                          </button>
                        </div>
                      </div>

                      {/* Bottom Lord Help trigger button */}
                      <div className="mt-auto pt-2 border-t border-border-chocolate/40 text-center shrink-0">
                        <span className="text-[8px] font-mono text-stone-400 block mb-1">EMERGENCY ASSIST / 星轨崩溃特种求救</span>
                        <button
                          onClick={() => {
                            playSound('roll');
                            setState(s => ({ ...s, showPenalty: false })); // dismiss penalty if showing
                            setShowLordHelp(true);
                          }}
                          className="w-full py-2.5 rounded-lg border border-gold-light/40 hover:bg-gold-light/10 text-xs font-semibold text-gold-light flex items-center justify-center gap-1.5 cursor-pointer font-serif transition duration-300"
                        >
                          <Flame className="h-3.5 w-3.5 text-orange-500 animate-pulse" />
                          寻求大君协助 (Seek Lord Council)
                        </button>
                      </div>
                    </div>
                  )}

                </div>

                {/* PINNED BOTTOM NAVIGATION TAB BAR (Replicates 6 tabs flawlessly for phone screens) */}
                <div className={`absolute bottom-0 inset-x-0 h-14 border-t flex items-center justify-around px-2 z-20 ${
                  isLightMode ? 'bg-[#FAF7F2] border-gold-light/25' : 'bg-[#12100f] border-border-chocolate/80'
                }`}>
                  {/* Tab 1: 深览·命轨 */}
                  <button
                     onClick={() => {
                       setState(s => ({ ...s, activeTab: 'orbit' }));
                       playSound('click');
                     }}
                     role="tab"
                     className={`flex flex-col items-center justify-center transition-all cursor-pointer ${
                       activeTab === 'orbit' ? 'text-gold-light scale-105' : 'text-stone-500 hover:text-stone-300'
                     }`}
                  >
                    <Compass className="h-4.5 w-4.5" />
                    <span className="text-[8px] mt-0.5 font-bold font-serif">深览·命轨</span>
                  </button>

                  {/* Tab 2: 动作·发条 */}
                  <button
                    onClick={() => {
                      setState(s => ({ ...s, activeTab: 'action' }));
                      playSound('click');
                    }}
                    role="tab"
                    className={`flex flex-col items-center justify-center transition-all cursor-pointer ${
                      activeTab === 'action' ? 'text-gold-light scale-105' : 'text-stone-500 hover:text-stone-300'
                    }`}
                  >
                    <MessageSquare className="h-4.5 w-4.5" />
                    <span className="text-[8px] mt-0.5 font-bold font-serif">动作·发条</span>
                  </button>

                  {/* Tab 3: 现物·秘藏 */}
                  <button
                    onClick={() => {
                      setState(s => ({ ...s, activeTab: 'inventory', selectedItemIndex: 0 }));
                      playSound('click');
                    }}
                    role="tab"
                    className={`flex flex-col items-center justify-center transition-all cursor-pointer ${
                      activeTab === 'inventory' ? 'text-gold-light scale-105' : 'text-stone-500 hover:text-stone-300'
                    }`}
                  >
                    <Key className="h-4.5 w-4.5" />
                    <span className="text-[8px] mt-0.5 font-bold font-serif">现物·秘藏</span>
                  </button>

                  {/* Tab 4: 贵物·原石 */}
                  <button
                    onClick={() => {
                      setState(s => ({ ...s, activeTab: 'wardrobe' }));
                      playSound('click');
                    }}
                    role="tab"
                    className={`flex flex-col items-center justify-center transition-all cursor-pointer ${
                      activeTab === 'wardrobe' ? 'text-gold-light scale-105' : 'text-stone-500 hover:text-stone-300'
                    }`}
                  >
                    <Shirt className="h-4.5 w-4.5" />
                    <span className="text-[8px] mt-0.5 font-bold font-serif">贵物·原石</span>
                  </button>

                  {/* Tab 5: 灵临·朝圣 */}
                  <button
                    onClick={() => {
                      setState(s => ({ ...s, activeTab: 'pilgrim' }));
                      playSound('click');
                    }}
                    role="tab"
                    className={`flex flex-col items-center justify-center transition-all cursor-pointer ${
                      activeTab === 'pilgrim' ? 'text-gold-light scale-105' : 'text-stone-500 hover:text-stone-300'
                    }`}
                  >
                    <Swords className="h-4.5 w-4.5" />
                    <span className="text-[8px] mt-0.5 font-bold font-serif">灵临·朝圣</span>
                  </button>

                  {/* Tab 6: 游戏配置 */}
                  <button
                    onClick={() => {
                      setState(s => ({ ...s, activeTab: 'config' }));
                      playSound('click');
                    }}
                    role="tab"
                    className={`flex flex-col items-center justify-center transition-all cursor-pointer ${
                      activeTab === 'config' ? 'text-gold-light scale-105' : 'text-stone-500 hover:text-stone-300'
                    }`}
                  >
                    <Award className="h-4.5 w-4.5" />
                    <span className="text-[8px] mt-0.5 font-bold font-serif">游戏配置</span>
                  </button>
                </div>

                {/* -------------------- 6. PUNISHMENT FEEDBACK FULL SCREEN MODAL -------------------- */}
                {state.showPenalty && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-[#070606]/95 flex flex-col justify-between p-6 z-45"
                  >
                    <div className="text-center mt-4 text-stone-300 font-sans">
                      <div className="h-12 w-12 rounded-full border border-red-500/40 bg-red-500/10 flex items-center justify-center text-red-500 mx-auto animate-pulse mb-3">
                        <AlertTriangle className="h-6 w-6" />
                      </div>
                      <span className="font-mono text-[8px] tracking-widest text-[#D44A4A] block mb-1">
                        狂迷深渊思维失序判定 / MENTAL EROSION
                      </span>
                      <h3 className="text-sm font-bold text-red-500 font-serif">SAN 值扣除通告</h3>
                    </div>

                    <div className="p-4 border border-border-chocolate/45 rounded-xl bg-chocolate-card/85 text-[9.5px] leading-relaxed text-stone-300 text-justify font-sans">
                      因您激活了狂迷的以太意志，思维产生不可逆流沙侵蚀。检测到理智值流失，发条天球仪轨偏移。
                      {character === 'helena' ? (
                        <p className="mt-2 text-emerald-400 font-semibold border-t border-border-chocolate/40 pt-2 font-serif">
                          ✓ 触发 Helena 专属被动 [虚空意志]：自动豁免 -2点 SAN值流失！
                        </p>
                      ) : (
                        <p className="mt-2 text-rose-400 font-medium font-serif">
                          此轮由于使用 Steiner 逻辑而遭遇了完全的维度剪裁损害。
                        </p>
                      )}
                    </div>

                    <div className="text-center text-[8.5px] text-[#C48A54]/80 opacity-80 leading-snug font-serif">
                      “若以太的巨轮偏航，即使神旨也无法阻断重合熔融。”
                    </div>

                    <button
                      onClick={() => {
                        playSound('success');
                        setState(s => ({ ...s, showPenalty: false }));
                      }}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-[#D44A4A] to-[#802D2D] hover:brightness-110 font-bold tracking-widest text-xs text-stone-100 shadow-md border border-red-500/20 cursor-pointer font-serif"
                    >
                      合拢宿命卷轴 (DISMISS RESIDENCE)
                    </button>
                  </motion.div>
                )}

                {showLordHelp && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute inset-x-2 bottom-16 top-10 rounded-2xl bg-[#090807]/98 border border-gold-light flex flex-col justify-between p-4 z-45 shadow-geo"
                  >
                    {/* Header */}
                    <div className="text-center mt-1 text-stone-200 shrink-0">
                      <div className="h-10 w-10 rounded-full border border-gold-light/40 bg-gold-light/10 flex items-center justify-center text-gold-light mx-auto mb-2 animate-spin-slow">
                        <Compass className="h-5 w-5" />
                      </div>
                      <span className="font-mono text-[7px] tracking-widest text-[#9c6a3c] block mb-0.5">
                        HIGH OVERSEER DUALITY COGNIZANCE / 命运天枢轨降
                      </span>
                      <h3 className="text-sm font-serif font-bold text-gold-light font-bold">命运大君协助</h3>
                      <p className="text-[8px] opacity-70 leading-normal max-w-[230px] mx-auto text-stone-400">
                        发条天球崩构偏移，执棋大核召唤古神之星，双派大君临莅沙盘。
                      </p>
                    </div>

                    {/* Dual Cards */}
                    <div className="grid grid-cols-2 gap-2.5 my-3 flex-grow overflow-y-auto">
                      {/* Classical Logic Lord */}
                      <div
                        onClick={() => {
                          playSound('success');
                          setState(s => ({ ...s, steps: s.steps + 5 }));
                          setShowLordHelp(false);
                          triggerFeedback(
                            'success',
                            '古典理性大君的发条律令',
                            '理性大君施加了【确定性定势】。发条轴承往返跃迁，您的【总步数增加 +5 步】！',
                            () => {}
                          );
                        }}
                        className="p-3 border border-border-chocolate/60 rounded-xl bg-[#12100f] hover:border-gold-light/60 transition cursor-pointer flex flex-col justify-between"
                      >
                        <div>
                          <div className="text-lg mb-1">⚖️</div>
                          <h4 className="text-[9.5px] font-bold text-gold-light font-serif">古典理性大君</h4>
                          <span className="text-[6px] font-mono text-[#3D86CD] uppercase tracking-wider block mb-1">Deterministic</span>
                          <p className="text-[7.5px] text-stone-400 leading-snug font-sans">
                            信奉因果守恒。当即跃迁发条，无条件赐予您 <strong>+5 个解密步数</strong>！
                          </p>
                        </div>
                        <span className="mt-2 text-[7px] font-mono text-center block text-stone-500 hover:text-gold-light uppercase tracking-widest border border-dashed border-border-chocolate/40 py-0.5 rounded">
                          承袭理性律令
                        </span>
                      </div>

                      {/* Infinite Volition Lord */}
                      <div
                        onClick={() => {
                          playSound('click');
                          setState(s => ({ ...s, sanity: 20 }));
                          setShowLordHelp(false);
                          triggerFeedback(
                            'success',
                            '现代直觉大君的盲维抚慰',
                            '直觉大君撕裂了黑域界。您的精神被完全高维重构，【理智值 (SAN) 回复满额至 20 PT】！',
                            () => {}
                          );
                        }}
                        className="p-3 border border-border-chocolate/60 rounded-xl bg-[#12100f] hover:border-gold-light/60 transition cursor-pointer flex flex-col justify-between"
                      >
                        <div>
                          <div className="text-lg mb-1">👁️</div>
                          <h4 className="text-[9.5px] font-bold text-[#e28445] font-serif">现代直觉大君</h4>
                          <span className="text-[6px] font-mono text-orange-400 uppercase tracking-wider block mb-1 font-semibold">Chaos Volition</span>
                          <p className="text-[7.5px] text-stone-400 leading-snug font-sans">
                            漠视物理禁闭。彻底冲刷并安抚深渊流沙，将<strong>理智 (SAN) 直接回满至 20 PT</strong>！
                          </p>
                        </div>
                        <span className="mt-2 text-[7px] font-mono text-center block text-stone-500 hover:text-gold-light uppercase tracking-widest border border-dashed border-border-chocolate/40 py-0.5 rounded">
                          纳取直觉神谕
                        </span>
                      </div>
                    </div>

                    {/* Divine Whispers Seek button */}
                    <div className="bg-[#12100f] p-2 border border-border-chocolate/35 rounded-xl text-center shrink-0 mb-3.5 flex flex-col gap-1 items-center justify-center">
                      <button
                        onClick={() => {
                          playSound('click');
                          const tips = [
                            "“因果并非时间的直线，而是在此时静止的发条。”",
                            "“在狂迷的以太潮汐中，紧闭眼眸比张望深渊能窥见更真实的命运。”",
                            "“发条的最高点在白金天盘之上，可用因果发条钥匙启动它。”",
                            "“Helena 适合在以太注入时依靠专属被动对抗理智损耗崩溃。”",
                            "“在黑暗沙盘的核心结节点上，切记用恒定理性理清线索。”"
                          ];
                          const randomTip = tips[Math.floor(Math.random() * tips.length)];
                          setLordTipRevealed(randomTip);
                        }}
                        className="text-[7.5px] font-mono text-gold-light hover:underline uppercase tracking-wide cursor-pointer flex items-center gap-1 font-semibold"
                      >
                        🔮 索取大君密言秘法 (Seek Divine Whispers)
                      </button>
                      {lordTipRevealed && (
                        <p className="text-[7.5px] text-stone-300 italic font-serif leading-tight animate-fadeIn max-w-[240px] border-t border-border-chocolate/20 pt-1 mt-0.5">
                          {lordTipRevealed}
                        </p>
                      )}
                    </div>

                    {/* Close action */}
                    <button
                      onClick={() => {
                        playSound('click');
                        setShowLordHelp(false);
                      }}
                      className="w-full py-2 rounded-xl text-[10px] bg-[#12100f] border border-gold-light/25 text-gold-light font-bold hover:bg-[#1c1815] cursor-pointer tracking-widest text-center font-serif leading-none shrink-0"
                    >
                      退避大君视界 (DISMISS DEITIES)
                    </button>
                  </motion.div>
                )}

                {/* Floating tappable AI assistant Icon bubble */}
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    playSound('click');
                    setIsAiOpen(true);
                  }}
                  className="absolute right-3.5 top-[58%] z-40 h-11 w-11 rounded-full border border-gold-light bg-[#090807]/95 text-gold-light flex flex-col items-center justify-center cursor-pointer shadow-active animate-bounce duration-1000"
                  style={{ animationDuration: '3s' }}
                >
                  <span className="text-sm">👩‍💻</span>
                  <span className="text-[6.5px] font-mono font-bold tracking-tight text-gold-light mt-px leading-none scale-90 text-center">小秘</span>
                  <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-green-500 border border-[#090807]" />
                </motion.div>

                {/* Compact AI Speech Overlay drawer */}
                <AnimatePresence>
                  {isAiOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 150 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 150 }}
                      className="absolute inset-x-2 bottom-16 top-10 rounded-2xl bg-[#090807]/98 border border-gold-light flex flex-col justify-between p-3.5 z-45 shadow-active"
                    >
                      {/* Header with Title and close action */}
                      <div className="flex items-center justify-between border-b border-border-chocolate/45 pb-2">
                        <div className="flex items-center gap-1.5 text-gold-light">
                          <span className="text-sm">👩‍💻</span>
                          <div className="text-left">
                            <span className="font-bold text-xs block font-serif">智能守护小秘号 AI 协同</span>
                            <span className="text-[7px] font-mono text-stone-400 block leading-none">AETHER COOPERATIVE AI COGNITION</span>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            playSound('click');
                            setIsAiOpen(false);
                          }}
                          className="h-5 w-5 rounded-full bg-[#12100f] hover:bg-gold-light/10 border border-gold-light/35 flex items-center justify-center text-gold-light font-bold text-[9px] cursor-pointer leading-none"
                        >
                          ✕
                        </button>
                      </div>

                      {/* Msg Area scrollable */}
                      <div className="flex-1 my-2 overflow-y-auto space-y-2 pr-0.5 text-[9px]">
                        {aiHistory.map((item, idx) => (
                          <div
                            key={idx}
                            className={`flex ${item.sender === 'player' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className={`p-2 rounded-xl border max-w-[210px] text-justify leading-relaxed ${
                              item.sender === 'player'
                                ? 'bg-[#3D86CD]/15 border-[#3D86CD]/40 text-stone-200'
                                : 'bg-chocolate-card border-border-chocolate/55 text-stone-300'
                            }`}>
                              <span className="text-[7.5px] font-mono text-gold-light block mb-0.5 font-bold uppercase leading-none">
                                {item.sender === 'player' ? 'YOU / 执局者' : 'A_A_I / 小秘小助手'}
                              </span>
                              {item.text}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Fast Question preset buttons to avoid cumbersome typing on mobile */}
                      <div className="grid grid-cols-2 gap-1 mb-2.5 shrink-0">
                        {[
                          { q: "沙盘玩法规则？", a: "【规则速览】：在主屏幕通过 [🎲 掷骰 (15)] 可以随机消耗 15 原石，获取额外的因果发条步数，并在地图节点跃迁！每一步前进，您的以太结晶都将丰沛，但注意避开黑域的诡计。" },
                          { q: "Helena 与 Steiner 有何区别？", a: "【职业差序】：海伦娜 (Helena) 属于灵媒大宗，精通直觉空跃，遭遇惩罚狂迷时将自动减损并庇护 2 点 SAN 值；施泰纳 (Steiner) 属于古典哲学，代表确定性思维，行走规则完全理性，初始状态更厚重沉稳。" },
                          { q: "如何赚取以太结晶？", a: "【生财契约】：1) 在主页面点开下方 Cognition Drawer 领取 7天契约回馈签到奖励；2) 通过 [灵临·朝圣] 进入竞技比阶，匹配虚拟对手并打败他们来获得大额 +200 结晶！" },
                          { q: "专属月卡有什么福利？", a: "【月卡权限】：花费 30 结晶认购，即可触发每日稳定自动派发 3 枚以太原石契约行为，维持 30 天，且自动开启手机专属高能防重复下单保护，不浪费任何晶体。" }
                        ].map((btn, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              playSound('click');
                              setAiHistory(prev => [
                                ...prev,
                                { sender: 'player', text: btn.q },
                                { sender: 'ai', text: btn.a }
                              ]);
                            }}
                            className="p-1 px-1.5 rounded border border-border-chocolate/40 hover:border-gold-light/40 bg-chocolate-card/90 hover:bg-black/40 text-stone-400 hover:text-stone-200 text-left cursor-pointer truncate text-[7.5px] font-sans transition-all duration-200"
                          >
                            ❓ {btn.q}
                          </button>
                        ))}
                      </div>

                      {/* Chat text Typing area */}
                      <div className="flex gap-1.5 items-center shrink-0 border-t border-[#4d3b2b]/30 pt-2">
                        <input
                          type="text"
                          value={aiMessage}
                          onChange={(e) => setAiMessage(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              if (!aiMessage.trim()) return;
                              playSound('click');
                              const text = aiMessage.trim();
                              setAiHistory(prev => [...prev, { sender: 'player', text }]);
                              setAiMessage('');
                              setTimeout(() => {
                                playSound('success');
                                setAiHistory(prev => [
                                  ...prev,
                                  { sender: 'ai', text: `“在以太纠缠中接收到了您的意志信号：「${text}」...” 小秘智能核心判定当前以太深度正常，推荐点击上方快捷提问按钮直接了解沙盘时宿规则！` }
                                ]);
                              }, 1000);
                            }
                          }}
                          placeholder="向命轨核心发问..."
                          className="flex-1 bg-stone-950 border border-border-chocolate rounded-lg py-1.5 px-2.5 text-stone-100 focus:outline-none focus:border-gold-light text-[8.5px] font-sans"
                        />
                        <button
                          onClick={() => {
                            if (!aiMessage.trim()) return;
                            playSound('click');
                            const text = aiMessage.trim();
                            setAiHistory(prev => [...prev, { sender: 'player', text }]);
                            setAiMessage('');
                            setTimeout(() => {
                              playSound('success');
                              setAiHistory(prev => [
                                ...prev,
                                { sender: 'ai', text: `“在以太纠缠中接收到了您的意志信号「${text}」...” 小秘反馈：当前以太深度正常，推荐点击快捷提问按钮直接了解时宿规则！` }
                              ]);
                            }, 1000);
                          }}
                          className="py-1 px-2.5 rounded-lg bg-gold-light text-[#090807] font-bold text-[8.5px] hover:brightness-110 active:scale-95 cursor-pointer font-sans transition"
                        >
                          发信
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </motion.div>
            )}

          </AnimatePresence>

          {/* ==================== HIGH-FIDELITY SMARTPHONE CUSTOM DRAWER & MODAL CHIPS ==================== */}
          {/* 1. LEFT SLIDING FRIEND DRAWER */}
          <AnimatePresence>
            {showDrawer && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowDrawer(false)}
                  className="absolute inset-0 bg-black/60 z-40 cursor-pointer"
                />
                <motion.div
                  initial={{ x: -256 }}
                  animate={{ x: 0 }}
                  exit={{ x: -256 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="absolute top-0 bottom-0 left-0 w-64 bg-[#120f0d] border-r border-gold-light/40 z-50 flex flex-col p-4 shadow-2xl select-none"
                >
                  <div className="flex justify-between items-center border-b border-gold-light/25 pb-3 mb-3">
                    <div className="flex items-center gap-1.5 font-serif text-gold-light">
                      <span className="text-xs font-bold font-serif">🏆 执局者好友榜</span>
                    </div>
                    <button
                      onClick={() => {
                        playSound('click');
                        setShowDrawer(false);
                      }}
                      className="p-1.5 w-6 h-6 rounded-full border border-gold-light/35 bg-gold-light/10 text-gold-light hover:bg-gold-light/25 active:scale-95 leading-none cursor-pointer flex items-center justify-center font-bold text-xs"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto flex flex-col gap-2 pr-1 min-h-0">
                    {[
                      { rank: 'I', name: '苏格拉底', score: '9940', title: '雅典辩证先师', detail: '已通关第三区·空虚狂澜', avatar: '🏛️', bg: 'from-amber-600/10 to-amber-900/5' },
                      { rank: 'II', name: '赫尔墨斯', score: '8120', title: '三重深境圣使', detail: '已通关第两区·原子充能', avatar: '🔱', bg: 'from-purple-900/10 to-purple-950/5' },
                      { rank: 'III', name: '康德', score: '7540', title: '纯粹批判枢机', detail: '已通关第二区·铀索崩塌', avatar: '⚖️', bg: 'from-blue-900/10 to-blue-950/5' },
                      { rank: 'IV', name: '尼采', score: '6910', title: '超人查拉图斯特', detail: '宿命罗盘故障抢修中', avatar: '☄️', bg: 'from-rose-900/10 to-rose-950/5' },
                      { rank: 'V', name: '笛卡尔', score: '5200', title: '方法理智沉思官', detail: '当前活跃在第二季', avatar: '📐', bg: 'from-stone-800/20 to-stone-900/10' },
                    ].map((friend) => (
                      <div 
                        key={friend.rank} 
                        className={`p-2 rounded-lg border border-gold-light/10 bg-gradient-to-r ${friend.bg} flex items-center justify-between transition-all hover:border-gold-light/20`}
                      >
                        <div className="flex items-center gap-2 text-left">
                          <div className="w-6 h-6 rounded bg-stone-950 flex items-center justify-center text-xs font-serif border border-gold-light/10 text-gold-light">
                            {friend.avatar}
                          </div>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[9.5px] font-bold text-stone-100">{friend.name}</span>
                              <span className="text-[7.5px] text-orange-400 font-mono italic">Rank {friend.rank}</span>
                            </div>
                            <span className="text-[7.5px] text-stone-400 leading-none">{friend.title}</span>
                            <span className="text-[6.5px] text-stone-500 leading-none mt-0.5">{friend.detail}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-[9.5px] font-mono font-bold text-gold-light block">{friend.score}</span>
                          <span className="text-[6px] text-stone-500 tracking-tighter block scale-90">PT 积分</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-auto pt-3 border-t border-gold-light/10 text-center shrink-0 text-stone-500 font-mono text-[7px]">
                    STEAMPUNK ETHER BOARD GAME V1.2
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* 2. USER AGREEMENT MODAL */}
          <AnimatePresence>
            {showAgreementModal && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowAgreementModal(false)}
                  className="absolute inset-0 bg-black/60 z-40 cursor-pointer"
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute inset-4 rounded-2xl bg-stone-950 border border-gold-light/45 z-50 flex flex-col p-4 shadow-active text-stone-200 select-none justify-between"
                >
                  <div className="flex justify-between items-center border-b border-gold-light/20 pb-2 mb-2 shrink-0">
                    <span className="text-xs font-serif font-bold text-gold-light flex items-center gap-1">
                      📜 命运迷局执局协议及理智保障
                    </span>
                    <button
                      onClick={() => { playSound('click'); setShowAgreementModal(false); }}
                      className="text-gold-light text-xs font-bold font-mono hover:bg-gold-light/10 w-5 h-5 rounded flex items-center justify-center cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto text-left pr-1 flex flex-col gap-2.5 my-1 text-[8px] leading-relaxed max-h-[300px] text-stone-300 min-h-0 font-sans">
                    <div>
                      <h4 className="text-gold-light font-bold font-serif text-[9px] text-left">● 第一则：秩序与矩阵维护规则</h4>
                      <p className="mt-0.5 opacity-80 pl-1.5 text-justify">
                        此沙盘建立在绝对理性的量化因果矩阵上。每一位开启命核回廊的执局信徒，都有义务保持宿命钟摆的精确平衡，严禁注入高阶混淆性代码及违背先验演绎思维。
                      </p>
                    </div>
                    <div>
                      <h4 className="text-gold-light font-bold font-serif text-[9px] text-left">● 第二则：精神意志与理智（SAN值）损耗</h4>
                      <p className="mt-0.5 opacity-80 pl-1.5 text-justify">
                        因果双轨中行为产生的狂迷、崩溃惩罚将直接扣减执局者的理智净水(SAN)。当理智衰竭为0，宿命锁将被无情熔断。
                      </p>
                    </div>
                    <div>
                      <h4 className="text-gold-light font-bold font-serif text-[9px] text-left">● 第三则：以太结晶物权法则</h4>
                      <p className="mt-0.5 opacity-80 pl-1.5 text-justify">
                        执局过程中产出和充填的以太晶体属于稀有神迹资产，可在命理回廊中与古典大君换取特定方位的强反馈染色照临。
                      </p>
                    </div>
                    <div>
                      <h4 className="text-gold-light font-bold font-serif text-[9px] text-left">● 第四则：时空断网免责申明</h4>
                      <p className="mt-0.5 opacity-80 pl-1.5 text-justify">
                        由于重氢星盘崩塌或网络干涉引发的因果链条重构、断开，系统将自动进入脱机冻结状态，无法同步实存以太晶体数据。请一律重试“重新连接时空”。
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      playSound('success');
                      setShowAgreementModal(false);
                      triggerFeedback('success', '签署完成', '您已成功签署命运执局契约，命运之钥已为您上油润滑！', () => {});
                    }}
                    className="mt-3 w-full py-2 bg-gradient-to-r from-gold-light to-amber-500 font-bold text-[10px] text-stone-900 rounded-lg cursor-pointer hover:brightness-110 active:scale-95 transition"
                  >
                    我已阅读并签署契约
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* 3. NEW USER REGISTRATION */}
          <AnimatePresence>
            {showRegisterModal && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowRegisterModal(false)}
                  className="absolute inset-0 bg-black/60 z-40 cursor-pointer"
                />
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 30 }}
                  className="absolute inset-x-4 top-10 bottom-10 rounded-2xl bg-stone-950 border border-gold-light/45 z-50 flex flex-col p-4 shadow-active text-stone-200 justify-between select-none"
                >
                  <div className="flex justify-between items-center border-b border-gold-light/20 pb-2 mb-2 shrink-0">
                    <span className="text-xs font-serif font-bold text-gold-light flex items-center gap-1.5">
                      🔑 注册全新执局账号密钥 (SIGN UP)
                    </span>
                    <button
                      onClick={() => { playSound('click'); setShowRegisterModal(false); }}
                      className="text-gold-light text-xs font-mono hover:bg-gold-light/10 w-5 h-5 rounded flex items-center justify-center cursor-pointer font-bold"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="flex-grow overflow-y-auto flex flex-col gap-3 justify-center text-left py-2 min-h-0">
                    <div className="flex flex-col gap-1">
                      <span className="text-[8.5px] font-mono text-gold-light tracking-wider font-bold">● 全新的宇宙唯一执局号</span>
                      <input
                        type="text"
                        value={newRegUser}
                        onChange={(e) => setNewRegUser(e.target.value)}
                        className="bg-black/60 border border-border-chocolate/80 text-stone-100 rounded-lg p-2 text-xs focus:ring-1 focus:ring-gold-light font-bold"
                        placeholder="例如: Socrates_Aether"
                        maxLength={12}
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="text-[8.5px] font-mono text-gold-light tracking-wider font-bold">● 绑定安全特征特征码密码</span>
                      <input
                        type="password"
                        value={newRegPass}
                        onChange={(e) => setNewRegPass(e.target.value)}
                        className="bg-black/60 border border-border-chocolate/80 text-stone-100 rounded-lg p-2 text-xs focus:ring-1 focus:ring-gold-light font-mono"
                        placeholder="输入安全特征密码..."
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="text-[8.5px] font-mono text-gold-light tracking-wider font-bold">● 再次校对密码印痕</span>
                      <input
                        type="password"
                        value={newRegConfirm}
                        onChange={(e) => setNewRegConfirm(e.target.value)}
                        className="bg-black/60 border border-border-chocolate/80 text-stone-100 rounded-lg p-2 text-xs focus:ring-1 focus:ring-gold-light font-mono"
                        placeholder="重复密码特征..."
                      />
                    </div>

                    <p className="text-[7.5px] text-stone-400 font-sans leading-relaxed text-center italic mt-1 shrink-0">
                      “系统验证成功后，将自动向您的理智晶仓注入 150 结晶奖励，开启初始时宿狂澜！”
                    </p>
                  </div>

                  <div className="flex flex-col gap-1.5 shrink-0">
                    <button
                      onClick={() => {
                        if (!newRegUser.trim()) {
                          triggerFeedback('error', '密钥名称虚空', '因果沙盘不容纳空白命名的执局者！请写下合法代号', () => {});
                          return;
                        }
                        if (newRegPass.trim().length < 4) {
                          triggerFeedback('error', '因果密码过短', '不坚实的密码易遭受虚空辐射，请设置至少4位密码！', () => {});
                          return;
                        }
                        if (newRegPass !== newRegConfirm) {
                          triggerFeedback('error', '理智特征冲突', '两次密码不匹配，这会在高能共振中发生坍塌！', () => {});
                          return;
                        }
                        playSound('success');
                        setTempProfileName(newRegUser.trim());
                        setLoginUser(newRegUser.trim());
                        setLoginPass(newRegPass);
                        setShowRegisterModal(false);
                        
                        setState(prev => ({
                          ...prev,
                          activeScreen: 'character',
                          crystals: prev.crystals + 150,
                          profileName: newRegUser.trim()
                        }));
                        triggerFeedback('success', '执局缔约成功', `新局者 ${newRegUser} 已完成契约！赠送初始以太结晶 +150。请选择本源宿命契约之人！`, () => {});
                      }}
                      className="w-full py-2 bg-gradient-to-r from-gold-light via-amber-500 to-amber-600 font-serif font-bold text-[9.5px] text-stone-950 rounded-xl hover:brightness-110 active:scale-95 transition cursor-pointer shadow-active border border-yellow-400/20"
                    >
                      建立独立执局契约账户 (REGISTER)
                    </button>
                    
                    <button
                      onClick={() => { playSound('click'); setShowRegisterModal(false); }}
                      className="py-1 font-sans text-stone-400 text-[8.5px] hover:text-stone-200 transition cursor-pointer text-center"
                    >
                      返回秘钥插仓口
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* 4. SEASONS PROGRESS OVERVIEW MAP MODAL */}
          <AnimatePresence>
            {showOverviewModal && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowOverviewModal(false)}
                  className="absolute inset-0 bg-black/60 z-40 cursor-pointer"
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="absolute inset-x-3 inset-y-12 rounded-2xl bg-stone-950 border border-gold-light/45 z-50 flex flex-col p-4 shadow-active text-stone-200 justify-between select-none"
                >
                  <div className="flex justify-between items-center border-b border-gold-light/20 pb-2 shrink-0">
                    <div className="flex items-center gap-1 font-serif text-gold-light text-[10.5px]">
                      <span>🗺️</span>
                      <span className="font-bold">大盘总览 • 赛季契约因果</span>
                    </div>
                    <button
                      onClick={() => { playSound('click'); setShowOverviewModal(false); }}
                      className="text-gold-light text-xs font-mono bg-gold-light/10 w-5 h-5 rounded flex items-center justify-center cursor-pointer font-bold"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Linear Progress Bar Indicator */}
                  <div className="p-2.5 bg-black/50 rounded-xl border border-gold-light/15 my-2 shrink-0 select-none font-sans">
                    <div className="flex justify-between text-[7.5px] font-mono text-gold-light uppercase font-bold mb-1 leading-none text-left">
                      <span>Restoration / 当前赛季修复率</span>
                      <span>75% (3/4 命核已契合)</span>
                    </div>
                    <div className="w-full h-2.5 bg-stone-900 border border-border-chocolate rounded-full overflow-hidden relative shadow-inner p-0.5">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '75%' }}
                        className="h-full bg-gradient-to-r from-amber-600 via-yellow-400 to-yellow-300 rounded-full shadow-active"
                      />
                    </div>
                    <div className="flex justify-between text-[6.5px] text-stone-400 font-mono mt-0.5 leading-none">
                      <span>源核: 安全锁定 (100%)</span>
                      <span>分流精密发条: 修复中</span>
                    </div>
                  </div>

                  {/* Seasonal Lists */}
                  <div className="flex-1 overflow-y-auto pr-0.5 flex flex-col gap-2 min-h-0 text-[8px] justify-start py-1">
                    {/* Season I */}
                    <div className="p-2 border border-emerald-500/20 bg-emerald-950/10 rounded-lg flex flex-col gap-0.5 text-left font-sans">
                      <div className="flex justify-between items-center leading-none">
                        <span className="font-serif font-bold text-emerald-400">第一赛季：以太重叠 (UNLOCKED)</span>
                        <span className="text-[6.5px] font-mono font-bold bg-emerald-500/15 text-emerald-400 px-1 rounded">安全锁定 100%</span>
                      </div>
                      <p className="opacity-70 leading-relaxed mt-0.5">
                        初生之契约。完成了始源因果罗盘在三维星野的绝对咬合，获赔以太狂热成就。
                      </p>
                    </div>

                    {/* Season II */}
                    <div className="p-2 border border-[#A855F7]/30 bg-[#A855F7]/10 rounded-lg flex flex-col gap-0.5 text-left font-sans">
                      <div className="flex justify-between items-center leading-none">
                        <span className="font-serif font-bold text-purple-300">第二赛季：原子充能-铀索崩塌 (ACTIVE)</span>
                        <span className="text-[6.5px] font-mono font-bold bg-[#A855F7]/25 text-[#df55ff] px-1 rounded animate-pulse">进行中/75%</span>
                      </div>
                      <p className="opacity-80 leading-relaxed mt-0.5">
                        本期断裂纠缠重灾。理智命轨上第三齿盘存在铜绿故障，唯有依附大君染印方具有较强生存韧度。
                      </p>
                    </div>

                    {/* Season III */}
                    <div className="p-2 border border-stone-800 bg-stone-950/40 rounded-lg flex flex-col gap-0.5 text-left opacity-45 font-sans">
                      <div className="flex justify-between items-center leading-none">
                        <span className="font-serif font-bold text-stone-400">第三赛季：空虚狂澜 (LOCKED)</span>
                        <span className="text-[6.5px] font-mono bg-stone-900 text-stone-500 px-1 rounded">封闭锁止</span>
                      </div>
                      <p className="opacity-70 leading-relaxed mt-0.5 text-[7.5px]">
                        不可见之重压奇点。解锁需要消耗二重修复阶段多维星盘密钥。
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => { playSound('click'); setShowOverviewModal(false); }}
                    className="mt-3 w-full py-1.5 bg-stone-900 border border-gold-light/30 hover:border-gold-light/60 font-serif font-bold text-[9px] text-gold-light rounded-lg cursor-pointer transition active:scale-95 leading-none shrink-0"
                  >
                    返回命运因果沙盘 (HUD)
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* 5. OFFLINE EXCEPTION INTERCEPTION FREEZE OVERLAY */}
          <AnimatePresence>
            {isOffline && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-[#0c0a09]/95 z-55 flex flex-col justify-center items-center text-center p-5 select-none"
              >
                <div className="h-10 w-10 rounded-full border-2 border-red-500/60 bg-red-500/10 flex items-center justify-center text-red-500 mb-3 animate-pulse">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                </div>
                
                <span className="text-[7.5px] font-mono text-red-400 tracking-widest uppercase font-bold block mb-1">
                  CONNECTION DROP / 以太阻断
                </span>
                
                <h3 className="text-xs font-serif font-bold text-red-500 uppercase leading-snug">
                  ⚠️ 因果链接断开 <br /> Connection Severed.
                </h3>
                
                <div className="my-3 p-3 border border-red-500/35 bg-red-500/5 rounded-xl max-w-[210px] text-left">
                  <p className="text-[8.5px] text-red-300 leading-relaxed font-sans text-justify">
                    系统无法同步物理宇宙实存以太晶体数据，已冻结您在沙盘格之发条交互。请检查电磁振动与以太信道。
                  </p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    playSound('success');
                    const toast = document.createElement('div');
                    toast.className = 'absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-amber-600 border border-yellow-400 text-stone-950 font-sans font-bold text-[8px] py-1 px-3 rounded shadow-xl z-55';
                    toast.innerHTML = '⚡ 正在激活空维天平... Syncing...';
                    const container = document.getElementById('mobile_viewport');
                    if (container) container.appendChild(toast);
                    
                    setTimeout(() => {
                      if (container && toast.parentNode === container) {
                        container.removeChild(toast);
                      }
                      setIsOffline(false);
                      triggerFeedback('success', '因果天线归回', '脱机锁定完美融化，因果时宿传输已 100% 同步！', () => {});
                    }, 1100);
                  }}
                  className="px-5 py-2 bg-gradient-to-r from-red-600 to-rose-700 text-stone-100 font-serif border border-red-500/30 rounded-xl font-bold text-[9.5px] cursor-pointer shadow-active animate-pulse"
                >
                  重新连接时空 (RECONNECT TIMELINE)
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* Home key simulator at phone bottom */}
        <div className="mt-2 text-[8px] font-mono opacity-50 uppercase tracking-widest text-center flex flex-col items-center gap-1 text-stone-400">
          <div className="h-1 w-20 rounded-full bg-[#c19a6b]/45" />
          STEAMPUNK COGNITION VIEWPORT
        </div>

      </div>

    </div>
  );
}
