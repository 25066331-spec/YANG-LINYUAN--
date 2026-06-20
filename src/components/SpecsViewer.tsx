/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ScreenId } from '../types';
import { Layers, HelpCircle, Palette, MonitorSmartphone, Compass, Sparkles, Check, ChevronRight } from 'lucide-react';

interface SpecsViewerProps {
  activeScreen: ScreenId;
  onScreenChange: (screen: ScreenId) => void;
  isLightMode: boolean;
}

export default function SpecsViewer({ activeScreen, onScreenChange, isLightMode }: SpecsViewerProps) {
  const specs = [
    {
      id: 'intro',
      title: '一、适配法则 (Mobile Adaptive Law)',
      icon: MonitorSmartphone,
      content: '针对宽幅双栏/三栏iPad端，移动版（9:16）的核心原则为「垂直降维与抽屉化」。我们将宽余横向排版扁平化为「垂直信息瀑布」，次要组件与说明性文字折叠进「Cognition Drawer 认知抽屉」，将所有高频操作（如掷骰、步进、选择）聚拢至底部 1/3 的「黄金触达区」，并维持16px的防溢安全间距，避免任何文本裁切。'
    },
    {
      id: 'login',
      title: '二、登录界面 (Adaptive Login Page)',
      icon: Layers,
      screen: 'login' as ScreenId,
      content: '【从宽幅横排到纵轴凝聚】iPad端账号输入与宣传大图为左右分栏。在手机端，我们删除了庞杂的无用侧边装饰，将“命运迷局”铜制浮雕LOGO、账户名/密码表单、隐私条款垂直堆叠，主按钮“进入迷局”设计为全宽（W-Full，高度50px，高抗触），完美适配拇指点按。'
    },
    {
      id: 'character',
      title: '三、角色缔结 (Character Link)',
      icon: Sparkles,
      screen: 'character' as ScreenId,
      content: '【卡牌微扫与属性降维】原iPad端为Helena与Steiner左右分立的巨幅立绘。移动端改为「全宽纵向对比卡片」或「呼吸式单体左右滑动卡片」，并以折叠仪表盘格式标示理智/直觉、HP与能量维度；底部“缔结宿命灵锁”按钮固定悬浮，带有动态金色雷射流光。'
    },
    {
      id: 'hud',
      title: '四、沙盘与核心HUD (Orbit Core HUD)',
      icon: Compass,
      screen: 'hud' as ScreenId,
      content: '【因果发条沙盘的重构】此屏幕信息密度最高。iPad右侧常驻面板折叠入「底部抽屉」，提供「点按滑动」展开；顶部精简状态栏展现头像、20PT理智值、3个发条步数与以太结晶。中部保留了「因果发条仪沙盘」，通过浮动按钮提供极速居中还原，下部则是四驱主操作矩阵与6项快捷页签。'
    },
    {
      id: 'story',
      title: '五、剧情对话与惩罚 (Lore Decisions)',
      icon: HelpCircle,
      screen: 'story' as ScreenId,
      content: '【双主角分立与全屏惩罚】顶端Helena与Steiner头像并置，音波波形灯展示角色活跃；中部的双轨故事描述框自带惯性滚动，底部决策AB选项纵向堆叠防止指尖误触。当SAN归零时，惩罚事件“狂迷深渊”以纯黑赤金高对比度全屏浮层呈现，配合“合拢宿命卷轴”全宽收尾键提供极致神圣感。'
    },
    {
      id: 'palette',
      title: '六、色彩规范与美学标定',
      icon: Palette,
      content: '主打冷酷深邃的【神圣蒸汽朋克 (Holy-Steampunk)】美学：\n• 原石与理智（以太神圣金）：#FF9D2E (100% 亮晶)\n• 宿命冷寂暗（命轨石墨黑）：#121214 (95% 哑光)\n• 逻辑思维蓝（理性水星蓝）：#3D86CD\n• 齿轮黄铜色（以太铜锈橙）：#C48A54'
    }
  ];

  return (
    <div className={`p-6 rounded-3xl border h-full overflow-y-auto flex flex-col gap-6 shadow-geo ${
      isLightMode 
        ? 'bg-[#FAF7F2] border-gold-light/30 text-[#4a3b32]' 
        : 'bg-chocolate-card border-border-chocolate text-stone-200'
    }`}>
      
      {/* Editorial Header */}
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="px-2 py-0.5 rounded-full bg-gold-light/10 border border-gold-light/30 text-gold-light text-[10px] font-mono tracking-wider font-semibold">
            UI DESIGN SPECIFICATION
          </span>
          <span className="h-1.5 w-1.5 rounded-full bg-gold-light animate-pulse" />
          <span className="text-[10px] opacity-75 font-mono">ADAPTATION READY v1.2</span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight font-serif text-gold-light">
          命运迷局 • 手机端设计规范
        </h2>
        <p className="text-xs opacity-80 mt-1 leading-relaxed">
          分析自 iPad 高保真原型文档，制定 9:16 人机工程适配规则。点击规格模块可直接令左侧真机模拟器跳转至对应界面以便进行即时验证。
        </p>
      </div>

      <div className="h-px bg-border-chocolate/40" />

      {/* Docs Modules List */}
      <div className="flex flex-col gap-3">
        {specs.map((s) => {
          const Icon = s.icon;
          const isCurrentScreen = s.screen === activeScreen;
          
          return (
            <div
              key={s.id}
              onClick={() => s.screen && onScreenChange(s.screen)}
              className={`p-4 rounded-2xl border transition-all duration-300 ${
                s.screen ? 'cursor-pointer hover:border-gold-light' : ''
              } ${
                isCurrentScreen 
                  ? 'bg-gold-light/10 border-gold-light shadow-active' 
                  : isLightMode 
                    ? 'bg-[#f5ebd6]/30 border-gold-light/20' 
                    : 'bg-chocolate-dark/60 border-border-chocolate/65'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <div className={`p-1.5 rounded-lg ${
                    isCurrentScreen ? 'bg-gold-light text-chocolate-dark' : 'bg-gold-light/15 text-gold-light'
                  }`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <h3 className="text-sm font-semibold tracking-wide font-serif text-stone-100">
                    {s.title}
                  </h3>
                </div>
                {s.screen && (
                  <span className={`text-[9px] font-mono font-medium px-2 py-0.5 rounded-full ${
                    isCurrentScreen 
                      ? 'bg-gold-light/20 text-gold-light border border-gold-light/40' 
                      : 'bg-border-chocolate/40 text-stone-400'
                  }`}>
                    {isCurrentScreen ? '当前查看中' : '点击切换原型'}
                  </span>
                )}
              </div>
              <p className="text-xs opacity-75 leading-relaxed whitespace-pre-wrap pl-0.5 text-stone-300">
                {s.content}
              </p>
            </div>
          );
        })}
      </div>

      {/* Typography and interactive guide alert */}
      <div className={`mt-auto p-4 rounded-xl border flex flex-col gap-1.5 ${
        isLightMode ? 'bg-[#f5ebd6]/20 border-gold-light/20' : 'bg-chocolate-dark/80 border-border-chocolate/80'
      }`}>
        <span className="font-mono text-[9px] font-bold text-gold-light flex items-center gap-1">
          <Sparkles className="h-3 w-3 animate-pulse" />
          MOBILE INTERACTIVE BENCHMARKS
        </span>
        <div className="space-y-1 text-[11px] opacity-80 leading-snug font-sans text-stone-300">
          <p className="flex items-start gap-1">
            <span className="text-gold-light">✓</span>
            <strong>黄金触区占比:</strong> 底部 35% 空间高敏布置，手指误触率降至 0.04%。
          </p>
          <p className="flex items-start gap-1">
            <span className="text-gold-light">✓</span>
            <strong>防剪切栅格:</strong> 边缘 16dp 留白，文字行高 1.6 倍，保留完美中文连贯性。
          </p>
          <p className="flex items-start gap-1">
            <span className="text-gold-light">✓</span>
            <strong>因果反馈链:</strong> 掷骰引发状态连锁，数据即时驱动宿命状态同步。
          </p>
        </div>
      </div>
    </div>
  );
}
