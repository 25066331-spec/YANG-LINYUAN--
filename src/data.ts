/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CharacterData, InventoryItem } from './types';

export const CHARACTERS: CharacterData[] = [
  {
    id: 'helena',
    name: 'Helena • 灵媒大宗',
    title: '蔷薇以太灵媒 (Aether Seer)',
    avatar: '👩‍🎤',
    rarity: 'SSR',
    lore: '自幼能感知高维次元的微弱以太回响。在以太纪元重合的余波中，她披着编织有命运因果线的“蔷薇以太使”华服，代表本能与感性直觉重塑虚宿。拥有操控精神狂迷与预知短暂未来的直觉视界。',
    activeSkill: {
      name: '宿命灵锁 (Aether Binding)',
      desc: '强行偏转因果轨道，使下两次“直觉空跃”百分百成功且溢出以太碎片。',
      cost: '消耗 15 颗原石 | 冷却 2 回合'
    },
    passiveSkill: {
      name: '虚空意志 (Ether Guard)',
      desc: '当因果判定触发“惩罚事件”时，SAN值伤害扣减自动抵免 -2 PT（最少扣除 0 PT）。',
      cost: '常驻被动触发'
    },
    hp: 120,
    mp: 90,
    portraitPath: './assets/char_helena_base.png'
  },
  {
    id: 'steiner',
    name: 'Steiner • 哲学使者',
    title: '逻辑齿轮密使 (Logic Templar)',
    avatar: '👨‍🔧',
    rarity: 'SSR',
    lore: '秉持极致理性的哲学隐修士。他视因果矩阵为一座巨大精密的“发条天球仪”。借助量化逻辑、黄铜齿轮与先验演绎进行精确格点突围，对本能流沙 and 无序星团发起理性的反叛。',
    activeSkill: {
      name: '理性微积分 (Deterministic Steps)',
      desc: '锁定接下来 3 枚齿轮发条的旋转角度，使“理智步进”固定获得步数 [3, 4, 3]。',
      cost: '消耗 18 颗原石 | 冷却 3 回合'
    },
    passiveSkill: {
      name: '机械先验 (A Priori Gears)',
      desc: '每次成功发动理智步进时，额外产出极高纯度的以太原石 (Crystals) +15 枚。',
      cost: '常驻被动触发'
    },
    hp: 140,
    mp: 70,
    portraitPath: './assets/char_steiner_base.png'
  }
];

export const SKINS = [
  {
    id: 'skin_helena_rose',
    ownerId: 'helena',
    name: '蔷薇以太使',
    desc: '系统自带 • 灵媒的传代祭礼法袍。由带静电的紫色以太丝线手工梭织而成，裙摆点缀血晶蔷薇花瓣。',
    rarity: 'Legendary',
    cost: 0,
    unlocked: true,
    accent: 'from-fuchsia-600 to-rose-600',
    tag: '宿命契约',
    imagePath: './assets/char_helena_base.png'
  },
  {
    id: 'skin_helena_abyss',
    ownerId: 'helena',
    name: '深渊学者 Abyssal Scholar',
    desc: 'SSR限时专属 • 探索疯狂奇异点时的特制维宿学士官袍。轻纱缭绕着无声的深渊回响，裙摆悬挂流动的水星重氢块。提高 10% 狂迷豁免倾向。',
    rarity: 'Divine',
    cost: 1200,
    unlocked: false,
    accent: 'from-purple-900 to-indigo-950',
    tag: '典藏限时',
    imagePath: './assets/skin_helena_abyss.png'
  },
  {
    id: 'skin_steiner_gear',
    ownerId: 'steiner',
    name: '齿轮机械狂热',
    desc: '典藏形态 • Steiner游学蒸汽工坊时的特制重甲。挂载有液压助退杠杆与黄铜三向气动活塞。',
    rarity: 'Epic',
    cost: 800,
    unlocked: true,
    accent: 'from-amber-600 to-yellow-700',
    tag: '工坊造物',
    imagePath: './assets/char_steiner_base.png'
  },
  {
    id: 'skin_steiner_overlord',
    ownerId: 'steiner',
    name: '发条大君 Clockwork Overlord',
    desc: 'SSR限时专属 • 调试命核核心至最高重合状态下的古典哲学大祭司礼冠工作重装。配有铜压多轴联动气门与晶振平衡摆臂。可额外产出以太结晶。',
    rarity: 'Divine',
    cost: 1200,
    unlocked: false,
    accent: 'from-amber-500 via-yellow-600 to-stone-900',
    tag: '至臻限时',
    imagePath: './assets/skin_steiner_overlord.png'
  },
  {
    id: 'skin_moci_fate',
    ownerId: 'player',
    name: '莫测 • 宿命纺织人',
    desc: '限定外装 • 用于伪装执局者身份的高维织缕仪。胸口装配有一款永不停歇的微型发条心脏。',
    rarity: 'Divine',
    cost: 1500,
    unlocked: false,
    accent: 'from-cyan-600 to-indigo-700',
    tag: '执局天外',
    imagePath: './assets/skin_moci_fate.png'
  }
];

export const INVENTORY: InventoryItem[] = [
  {
    name: '精金发条齿轮',
    count: 14,
    iconName: 'Settings',
    type: '功能原材',
    desc: '用于润滑并微调因果发条仪的咬合比，能恢复 1 回合的冷却。'
  },
  {
    name: '常温以太稳定剂',
    count: 3,
    iconName: 'ShieldAlert',
    type: '稳定剂',
    desc: '高密度的以太安定注射液。喝下后使陷入“疯狂奇异点”的执局者瞬间恢复 +10 SAN值（理智值）。'
  },
  {
    name: '盲维直觉罗盘',
    count: 5,
    iconName: 'Compass',
    type: '罗盘',
    desc: '非欧几里得几何罗盘。在指针狂转时点击能引导下一次“直觉空跃”跃迁到安全格。'
  },
  {
    name: '因果发条钥匙',
    count: 1,
    iconName: 'Key',
    type: '圣物罕品',
    desc: '打开命运大君暗门格口的黄铜发条钥匙，在被遗失的因果圣殿深处可以解密高级双轨故事卷轴。'
  },
  {
    name: '水星凝霜原石',
    count: 247,
    iconName: 'Gem',
    type: '原始结晶',
    desc: '极低温度下凝固的以太粒子，可用来跟黑市大君兑换最新的秘誓礼服。'
  }
];

export const FAQS = [
  {
    q: '什么是理智步进与直觉空跃的双轨机制？',
    a: '在本局游戏中，行棋存在两条规则轴。理智步进由物理轴（发条齿轮）驱动，结果确定安全但步数较少。直觉空跃由精神轴驱动，结果具备极高空间上限和跳跃爆发，但失败可能导致SAN值流失，触发疯狂扣减或神秘惩罚事件。'
  },
  {
    q: '疯狂状态（SAN降至0）会有什么严重后果？',
    a: '当SAN值（理智）扣除至零，执局者将遭遇“思维失序”，沙盘节点永久性锁死3个，且进入精神异化。必须喝下“常温以太稳定剂”或寻求“大君协助”，否则结算时评分打至极低的“凡人”档次。'
  },
  {
    q: '大君协助（Leader Help）会在什么时候触发？',
    a: '当执局者连续3次掷出低点数骰子，或SAN降至8以下时，背景的星轨道格将合拢，触发“大君协助半屏弹窗”。执局者需在“古典理性派大君”与“现代直觉意志派大君”两张命运卡牌中择一契约，获得大幅度补给。'
  }
];

export const LEADERBOARD = [
  { rank: 'Rank I', name: '苏格拉底 • 永恒理智', point: '32,190 PT', select: 'steiner', color: 'text-amber-500 bg-amber-500/10 border-amber-500/20' },
  { rank: 'Rank II', name: '赫尔墨斯 • 炼金行者', point: '29,400 PT', select: 'helena', color: 'text-zinc-400 bg-zinc-300/10 border-zinc-300/20' },
  { rank: 'Rank III', name: '康德 • 纯粹理性', point: '27,820 PT', select: 'steiner', color: 'text-amber-700 bg-amber-700/10 border-amber-700/20' },
  { rank: 'Rank IV', name: '黑格尔 • 绝对理念', point: '25,110 PT', select: 'steiner', color: 'text-stone-500 bg-stone-500/10' },
  { rank: 'Rank V', name: '尼采 • 酒神狂欢', point: '24,800 PT', select: 'helena', color: 'text-stone-500 bg-stone-500/10' }
];

export const STORIES = [
  {
    id: 1,
    title: '1955、西伯利亚：反应炉鬼火',
    text: '极地冰川下，苏维埃以太核反应堆的压力阀正按不规则的斐波那契数列敲击。阀门缝隙喷吐出绿紫交织的鬼火，那是以太纪元融合引起的维度褶皱在吸吮周遭的重氢。Steiner感知到压力指针逻辑失灵，惊呼警报；Helena却把指尖抚在滚烫的管道上，面带疯狂的温柔，捕捉到了鬼火中来自高维生命体“星原古神”的轻声鸣响。抉择，在此锁紧……',
    optA: '稳妥排放：拉下排压拉杆，强制进入泄能闭环。需要理智和严谨发条微调。',
    optAEffect: '效果：理智步骤 +3，消耗 50 枚以太原石。',
    optB: '逆涌感应：把精神能量灌注进极冷鬼火中。寻求虚空的神秘祝福。',
    optBEffect: '效果：直觉空跃增加，SAN值随机变动，有概率面临灵魂审判！'
  }
];
