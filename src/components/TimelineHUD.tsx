import React, { useState, useEffect } from 'react';
import { ZoomIn, ZoomOut, Compass, Sparkles, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TimelineHUDProps {
  isLightMode: boolean;
  sanity: number;
  onNodeClick: (nodeName: string) => void;
  character: 'helena' | 'steiner' | null;
  currentNodeId: string;
  visitedNodeIds: string[];
  lordGlow?: 'RATIONAL' | 'EMOTIONAL' | null;
}

export default function TimelineHUD({ 
  isLightMode, 
  sanity, 
  onNodeClick,
  character,
  currentNodeId = 'center',
  visitedNodeIds = ['start', 'center'],
  lordGlow = null
}: TimelineHUDProps) {
  const [zoom, setZoom] = useState<number>(0.95);
  const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [selectedNode, setSelectedNode] = useState<string>('当前命核');
  const [imageError, setImageError] = useState<Record<string, boolean>>({});

  const getNodeImage = (nodeId: string) => {
    if (nodeId === 'abyss') return './assets/grid_trap_cog.png';
    if (nodeId.startsWith('intuitive')) return './assets/grid_event_cog.png';
    return './assets/grid_safe_cog.png';
  };

  // Node coordinates (Steampunk Stellar Matrix nodes)
  const nodes = [
    { id: 'start', label: '以太始源', x: -120, y: 100, desc: '宿命因果的初始节点，满载发条铜锈' },
    { id: 'center', label: '当前命核', x: 0, y: 20, desc: '执局者·莫测 的理智驻留点，中央平衡轮' },
    { id: 'rational_1', label: '逻辑发条 I', x: 110, y: -50, desc: '齿轮齿距精确锁定的理性回路，精密平衡杆' },
    { id: 'rational_2', label: '律令核心 II', x: 230, y: -100, desc: '哲学意志对时空纠缠的绝对矫正器' },
    { id: 'intuitive_1', label: '灵觉空跳 I', x: 100, y: 110, desc: '突破逻辑规则的气动释放阀，高压过热区' },
    { id: 'intuitive_2', label: '直觉漩涡 II', x: 240, y: 130, desc: '双重以太过载、充满纯粹直觉奇迹的盲区' },
    { id: 'abyss', label: '迷狂奇异点', x: -100, y: -90, desc: '理智流失后的崩溃深渊区，齿轮咬合失灵点' },
  ];

  // Orbit lines
  const paths = [
    { from: 'start', to: 'center', type: 'base' },
    { from: 'center', to: 'rational_1', type: 'rational' },
    { from: 'rational_1', to: 'rational_2', type: 'rational' },
    { from: 'center', to: 'intuitive_1', type: 'intuitive' },
    { from: 'intuitive_1', to: 'intuitive_2', type: 'intuitive' },
    { from: 'center', to: 'abyss', type: 'chaos' },
  ];

  // Smooth centering helper
  const recenterOnActive = () => {
    const activeNode = nodes.find(n => n.id === currentNodeId);
    if (activeNode) {
      setOffset({
        x: -activeNode.x * zoom,
        y: -activeNode.y * zoom
      });
      setSelectedNode(activeNode.label);
    }
  };

  // Synced Position Alignment & Viewport Follow
  useEffect(() => {
    recenterOnActive();
  }, [currentNodeId, zoom]);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.15, 1.8));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.15, 0.65));

  // Determine character presentation for token
  const getCharacterTokenAvatar = () => {
    if (character === 'helena') return '👁️';
    if (character === 'steiner') return '⚙️';
    return '🧭';
  };

  const getCharacterTokenColor = () => {
    if (character === 'helena') return '#3E9B85'; // Deep turquoise for psychic
    if (character === 'steiner') return '#d4af37'; // Molten gold for rationalist
    return '#c19a6b';
  };

  return (
    <div className={`relative h-[435px] w-full rounded-2xl border shadow-geo ${
      isLightMode 
        ? 'bg-[#FAF7F2]/90 border-gold-light/40' 
        : 'bg-[#12100f]/95 border-border-chocolate/60'
    } overflow-hidden flex flex-col`} id="timeline_hud_wrapper">
      
      {/* Dynamic Background Grid and Circular Tracks */}
      <div className="absolute inset-0 opacity-25 pointer-events-none">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="matrix_grid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke={isLightMode ? '#c19a6b' : '#3c2e21'} strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#matrix_grid)" />
          {/* Concentric orbital rings symbolizing destiny gears */}
          <circle cx="50%" cy="50%" r="60" fill="none" stroke={isLightMode ? '#c19a6b' : '#4d3b2b'} strokeWidth="1" strokeDasharray="3 6" />
          <circle cx="50%" cy="50%" r="120" fill="none" stroke={isLightMode ? '#a1835b' : '#5d4634'} strokeWidth="0.5" />
          <circle cx="50%" cy="50%" r="180" fill="none" stroke={isLightMode ? '#c19a6b' : '#2d2218'} strokeWidth="1" />
        </svg>
      </div>

      {/* Decorative Rotating Steam Machine Backgrounds */}
      <div className="absolute -top-14 -left-14 pointer-events-none opacity-20">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
          className="text-gold-light/40"
        >
          <svg width="130" height="130" viewBox="0 0 100 100" fill="currentColor">
            <path d="M50 20c-16.5 0-30 13.5-30 30s13.5 30 30 30 30-13.5 30-30-13.5-30-30-30zm0 48c-9.9 0-18-8.1-18-18s8.1-18 18-18 18 8.1 18 18-8.1 18-18 18z" />
            {[...Array(12)].map((_, i) => (
              <rect key={i} x="47" y="2" width="6" height="10" transform={`rotate(${i * 30} 50 50)`} rx="1" />
            ))}
          </svg>
        </motion.div>
      </div>

      <div className="absolute -bottom-16 -right-16 pointer-events-none opacity-15">
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
          className="text-orange-500/30"
        >
          <svg width="180" height="180" viewBox="0 0 100 100" fill="currentColor">
            <circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" strokeWidth="2.5" strokeDasharray="6 4" />
            {[...Array(16)].map((_, i) => (
              <rect key={i} x="48" y="0" width="4" height="12" transform={`rotate(${i * 22.5} 50 50)`} />
            ))}
          </svg>
        </motion.div>
      </div>

      {/* Interactive Map Area */}
      <div className="flex-1 relative cursor-grab active:cursor-grabbing">
        <svg width="100%" height="100%" className="absolute inset-0">
          <g transform={`translate(${160 + offset.x}, ${170 + offset.y}) scale(${zoom})`}>
            
            {/* Draw Path Linkages */}
            {paths.map((p, index) => {
              const nodeFrom = nodes.find(n => n.id === p.from);
              const nodeTo = nodes.find(n => n.id === p.to);
              if (!nodeFrom || !nodeTo) return null;

              // Check if both nodes in this path are already visited
              const isPathVisited = visitedNodeIds.includes(p.from) && visitedNodeIds.includes(p.to);

              let strokeColor = isLightMode ? '#c19a6b' : '#5a4634';
              let dash = '0';
              let weight = '2.5';

              if (isPathVisited) {
                // Glow molten gold/brass for passed paths
                strokeColor = '#e2c799'; 
                weight = '3.5';
              } else {
                if (p.type === 'rational') {
                  strokeColor = '#3D86CD50'; 
                } else if (p.type === 'intuitive') {
                  strokeColor = '#e2844550'; 
                  dash = '4 3';
                } else if (p.type === 'chaos') {
                  strokeColor = '#D44A4A40';
                }
              }

              return (
                <g key={`path-${index}`}>
                  {/* Outer Glow behind paths if visited */}
                  {isPathVisited && (
                    <line
                      x1={nodeFrom.x}
                      y1={nodeFrom.y}
                      x2={nodeTo.x}
                      y2={nodeTo.y}
                      stroke="#f5a623"
                      strokeWidth="7"
                      className="opacity-20 blur-sm"
                    />
                  )}
                  <line
                    x1={nodeFrom.x}
                    y1={nodeFrom.y}
                    x2={nodeTo.x}
                    y2={nodeTo.y}
                    stroke={strokeColor}
                    strokeWidth={weight}
                    strokeDasharray={dash}
                    className="transition-all duration-500"
                  />
                  {/* Energy dot traveling on destiny paths */}
                  <circle r="3" fill={isPathVisited ? '#ffae19' : strokeColor} className="opacity-95">
                    <animateMotion
                      dur={`${isPathVisited ? 2.5 : 5 + index}s`}
                      repeatCount="indefinite"
                      path={`M ${nodeFrom.x} ${nodeFrom.y} L ${nodeTo.x} ${nodeTo.y}`}
                    />
                  </circle>
                </g>
              );
            })}

            {/* Render Nodes as Steampunk Cogwheels */}
            {nodes.map(n => {
              const isSelected = selectedNode === n.label;
              const isActiveCurrentNode = n.id === currentNodeId;
              const isVisited = visitedNodeIds.includes(n.id);
              
              const isAbyss = n.id === 'abyss';
              const isCenter = n.id === 'center';
              const isRational = n.id.startsWith('rational');
              const isIntuitive = n.id.startsWith('intuitive');

              // Visual coloring for node types
              let baseColor = '#5a4634'; // Unpassed dark brass
              if (isVisited) {
                baseColor = '#d4af37'; // Passed permanent glowing molten gold
              } else {
                if (isCenter) baseColor = '#4a5b50';
                else if (isRational) baseColor = '#2b4d70';
                else if (isIntuitive) baseColor = '#704221';
                else if (isAbyss) baseColor = '#772525';
              }

              let gearHighlightColor = isVisited ? '#f5a623' : '#a1835b';
              if (isActiveCurrentNode) {
                gearHighlightColor = '#ffae19';
              }

              return (
                <g
                  key={n.id}
                  transform={`translate(${n.x}, ${n.y})`}
                  onClick={() => {
                    setSelectedNode(n.label);
                    onNodeClick(n.label);
                  }}
                  className="cursor-pointer group"
                >
                  {/* Great Lord Path Coloring Feedback Halo */}
                  {lordGlow === 'RATIONAL' && isRational && (
                    <g>
                      <circle
                        r="28"
                        fill="none"
                        stroke="#00f0ff"
                        strokeWidth="4"
                        className="animate-pulse opacity-90 blur-[1.5px]"
                        style={{ filter: "drop-shadow(0 0 8px #00f0ff)" }}
                      />
                      <circle
                        r="24"
                        fill="none"
                        stroke="#3D86CD"
                        strokeWidth="1.5"
                        strokeDasharray="4 2"
                        className="animate-spin-slow opacity-80"
                      />
                    </g>
                  )}
                  {lordGlow === 'EMOTIONAL' && isIntuitive && (
                    <g>
                      <circle
                        r="28"
                        fill="none"
                        stroke="#df55ff"
                        strokeWidth="4"
                        className="animate-pulse opacity-90 blur-[1.5px]"
                        style={{ filter: "drop-shadow(0 0 8px #df55ff)" }}
                      />
                      <circle
                        r="24"
                        fill="none"
                        stroke="#e28445"
                        strokeWidth="1.5"
                        strokeDasharray="4 2"
                        className="animate-spin-slow opacity-80"
                      />
                    </g>
                  )}

                  {/* Character Token Anchor & Pulse Rings on Active Node */}
                  {isActiveCurrentNode && (
                    <g>
                      {/* Double pulse dynamic rings */}
                      <circle
                        r="25"
                        fill="none"
                        stroke={getCharacterTokenColor()}
                        strokeWidth="1.5"
                        className="animate-ping opacity-35"
                      />
                      <circle
                        r="18"
                        fill="none"
                        stroke={getCharacterTokenColor()}
                        strokeWidth="2"
                        className="opacity-40 animate-pulse"
                      />
                      {/* Token background shade */}
                      <circle
                        r="14"
                        fill={isLightMode ? '#ffffff' : '#0a0908'}
                        stroke={getCharacterTokenColor()}
                        strokeWidth="3.5"
                        className="shadow-geo"
                      />
                      {/* Mini character token text/character node logo */}
                      <text
                        x="0"
                        y="4"
                        textAnchor="middle"
                        className="text-xs select-none leading-none scale-110"
                      >
                        {getCharacterTokenAvatar()}
                      </text>
                    </g>
                  )}

                  {/* Standard Cogwheel Nodes (Hidden underneath if current active player token is rendered on top) */}
                  {!isActiveCurrentNode && (
                    <g className="transition-transform duration-300 group-hover:scale-115">
                      {/* Spinning cogs gears teeth */}
                      <g className={`${isSelected ? 'animate-spin-slow' : ''}`}>
                        {!imageError[getNodeImage(n.id)] ? (
                          <image
                            href={getNodeImage(n.id)}
                            x="-15"
                            y="-15"
                            width="30"
                            height="30"
                            onError={() => setImageError(prev => ({ ...prev, [getNodeImage(n.id)]: true }))}
                            className="pointer-events-none"
                          />
                        ) : (
                          <>
                            <circle
                              r="12"
                              fill="none"
                              stroke={baseColor}
                              strokeWidth="2.5"
                            />
                            {[...Array(6)].map((_, idx) => (
                              <rect
                                key={idx}
                                x="-2"
                                y="-14"
                                width="4"
                                height="4"
                                fill={baseColor}
                                transform={`rotate(${idx * 60})`}
                                rx="1"
                              />
                            ))}
                          </>
                        )}
                      </g>
                      
                      {/* Core central axis lock pin */}
                      <circle
                        r="5"
                        fill={isLightMode ? '#FCFBF9' : '#12100f'}
                        stroke={gearHighlightColor}
                        strokeWidth="2"
                      />
                      <circle r="1.5" fill={gearHighlightColor} />
                    </g>
                  )}

                  {/* Node Title Overlay Background - Placed to prevent text overlap */}
                  <rect
                    x="-34"
                    y={n.y > 50 ? '14' : '-25'}
                    width="68"
                    height="12"
                    rx="3"
                    fill={isActiveCurrentNode ? '#ffd384ee' : (isLightMode ? '#FAF7F2EC' : '#12100fEC')}
                    stroke={isActiveCurrentNode ? '#e28445' : (isSelected ? gearHighlightColor : '#4d3b2b/40')}
                    strokeWidth="0.5"
                    className="opacity-95 shadow-sm"
                  />

                  {/* Node Label Text */}
                  <text
                    x="0"
                    y={n.y > 50 ? '22' : '-17'}
                    textAnchor="middle"
                    className={`font-serif text-[7.5px] font-bold select-none leading-none ${
                      isActiveCurrentNode ? 'fill-amber-950 font-black' : (isLightMode ? 'fill-[#4a3b32]' : 'fill-[#e2c799]')}
                    `}
                  >
                    {n.label}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>

        {/* Floating Node Tooltip */}
        <div className="absolute top-2 left-2 max-w-[170px] pointer-events-none z-10">
          <div className={`p-2 rounded-lg border text-[9.5px] shadow-geo flex flex-col backdrop-blur-md ${
            isLightMode 
              ? 'bg-[#FAF7F2]/95 border-gold-light/40 text-[#4a3b32]' 
              : 'bg-[#12100fed]/95 border-border-chocolate/70 text-stone-200'
          }`}>
            <span className="font-mono text-[7px] tracking-wider text-orange-400 font-bold">NODE LORE / 时空坐标窍级</span>
            <span className="font-bold text-xs text-gold-light font-serif mt-0.5 flex items-center gap-1">
              ⚙️ {selectedNode}
              {nodes.find(n => n.label === selectedNode)?.id === currentNodeId && (
                <span className="text-[7px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded px-1 scale-90 leading-none">
                  ACTIVE / 驻留
                </span>
              )}
            </span>
            <span className="opacity-80 mt-1 leading-normal font-sans">
              {nodes.find(n => n.label === selectedNode)?.desc || '点选发条星盘节点读取缘起事件段...'}
            </span>
          </div>
        </div>

        {/* Floating Matrix Zoom Controls */}
        <div className="absolute bottom-2 right-2 flex flex-col gap-1.5 z-10">
          <button
            onClick={handleZoomIn}
            className={`p-1.5 rounded-lg border text-xs flex items-center justify-center transition hover:bg-gold-light/30 shadow-geo cursor-pointer ${
              isLightMode ? 'bg-[#FAF7F2]/90 border-gold-light/35 text-gold-light' : 'bg-[#12100f]/90 border-border-chocolate text-gold-light'
            }`}
            title="放大视角"
          >
            <ZoomIn className="h-3.2 w-3.2 text-gold-light" />
          </button>
          <button
            onClick={handleZoomOut}
            className={`p-1.5 rounded-lg border text-xs flex items-center justify-center transition hover:bg-gold-light/30 shadow-geo cursor-pointer ${
              isLightMode ? 'bg-[#FAF7F2]/90 border-gold-light/35 text-gold-light' : 'bg-[#12100f]/90 border-border-chocolate text-gold-light'
            }`}
            title="缩小视角"
          >
            <ZoomOut className="h-3.2 w-3.2 text-gold-light" />
          </button>
          <button
            onClick={() => {
              setZoom(1);
              recenterOnActive();
            }}
            className={`px-2 py-1 rounded-lg border text-[8px] font-sans font-bold flex items-center gap-1 transition shadow-geo cursor-pointer leading-none hover:bg-gold-light/30 ${
              isLightMode ? 'bg-[#FAF7F2]/90 border-gold-light/35 text-gold-light' : 'bg-[#1a1614] border-border-chocolate text-gold-light'
            }`}
          >
            <Compass className="h-2.5 w-2.5 text-orange-500 animate-pulse" />
            ◎居中主角
          </button>
        </div>
      </div>

      {/* Orbit Footer status link */}
      <div className={`p-1 px-2 border-t flex justify-between items-center text-[7.5px] font-mono tracking-wide shrink-0 ${
        isLightMode ? 'bg-orange-50/50 border-gold-light/10 text-[#4a3b32]' : 'bg-[#0a0908] border-border-chocolate/40 text-gold-light'
      }`}>
        <span className="flex items-center gap-1">
          <span className={`h-1.5 w-1.5 rounded-full ${sanity > 5 ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500 animate-ping'}`} />
          AETHER STATE: ORBIT COG SYNCED: ({sanity}/20 SAN)
        </span>
        <span className="opacity-75">CAMERA LENS: {Math.round(zoom * 100)}%</span>
      </div>
    </div>
  );
}
