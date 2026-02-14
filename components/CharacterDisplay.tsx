import React from 'react';
import { Character } from '../types';

interface CharacterDisplayProps {
  character: Character;
  onGeneratePortrait: () => void;
  isPortraitLoading: boolean;
  onGenerateBackstory: () => void;
  isBackstoryLoading: boolean;
  onSaveToDeck: (char: Character) => void;
  isSaved: boolean;
}

const getRarityStyles = (rarity: Character['rarity']) => {
  switch (rarity) {
    case 'Legendary': return 'border-[#ffd700] shadow-[0_0_60px_rgba(255,215,0,0.5)] bg-gradient-to-br from-[#2a1f0d] to-[#1a1612]';
    case 'Artifact': return 'border-[#a855f7] shadow-[0_0_60px_rgba(168,85,247,0.5)] bg-gradient-to-br from-[#1e142b] to-[#1a1612]';
    case 'Rare': return 'border-[#3b82f6] shadow-[0_0_40px_rgba(59,130,246,0.3)] bg-gradient-to-br from-[#141b2b] to-[#1a1612]';
    case 'Uncommon': return 'border-[#22c55e] bg-gradient-to-br from-[#142b1b] to-[#1a1612]';
    default: return 'border-[#5c4033] bg-[#1a1612]';
  }
};

const getElementIcon = (element: Character['element']) => {
  switch (element) {
    case 'Fire': return 'fa-fire text-orange-500';
    case 'Water': return 'fa-droplet text-blue-400';
    case 'Earth': return 'fa-mountain text-emerald-600';
    case 'Air': return 'fa-wind text-slate-300';
    case 'Light': return 'fa-sun text-yellow-200';
    case 'Dark': return 'fa-moon text-purple-900';
    case 'Void': return 'fa-circle-nodes text-fuchsia-600';
    default: return 'fa-star text-amber-500';
  }
};

const CharacterDisplay: React.FC<CharacterDisplayProps> = ({ 
  character, 
  onGeneratePortrait, 
  isPortraitLoading,
  onGenerateBackstory,
  isBackstoryLoading,
  onSaveToDeck,
  isSaved
}) => {
  const rarityStyle = getRarityStyles(character.rarity);
  const elementIcon = getElementIcon(character.element);

  return (
    <div className="relative w-full max-w-[400px] mx-auto animate-in zoom-in-95 slide-in-from-bottom-12 duration-700">
      {/* Bordered Player Card */}
      <div className={`relative p-2 rounded-[2.5rem] border-[12px] ${rarityStyle} shadow-2xl overflow-hidden group/card`}>
        
        {/* Shine Layer */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 translate-x-[-150%] group-hover/card:translate-x-[150%] transition-transform duration-2000 pointer-events-none z-10"></div>

        {/* Inner Content Container */}
        <div className="relative bg-black/70 rounded-[1.8rem] p-5 flex flex-col gap-5">
          
          {/* Top Bar: Name and Element Icon */}
          <div className="flex justify-between items-center border-b border-white/10 pb-3">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <i className={`fas ${elementIcon} text-lg drop-shadow-[0_0_8px_currentColor]`}></i>
                <h2 className="text-2xl font-black text-white fantasy-font leading-none tracking-tight">
                  {character.name}
                </h2>
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-500/60 mt-1">
                {character.rarity} {character.class}
              </span>
            </div>
            <div className="bg-stone-900/80 px-3 py-1 rounded-full border border-white/10">
               <span className="text-[10px] font-black text-stone-500 tracking-widest uppercase">LVL 01</span>
            </div>
          </div>

          {/* Main Portrait Frame */}
          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border-2 border-amber-900/30 bg-stone-900 group/portrait shadow-2xl">
            {character.portraitUrl ? (
              <img 
                src={character.portraitUrl} 
                alt={character.name} 
                className="w-full h-full object-cover transition-all duration-1000 group-hover/portrait:scale-110"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-stone-700">
                <i className="fas fa-meteor text-6xl mb-4 animate-bounce"></i>
                <p className="text-xs font-black uppercase tracking-[0.4em]">Summoning Character...</p>
              </div>
            )}
            
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
            
            <button 
              onClick={onGeneratePortrait} 
              disabled={isPortraitLoading}
              className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover/portrait:opacity-100 transition-all duration-300 z-20"
            >
              <div className="bg-amber-600 hover:bg-amber-500 p-6 rounded-full shadow-2xl transform scale-90 group-hover/portrait:scale-110 transition-transform">
                {isPortraitLoading ? <i className="fas fa-spinner fa-spin text-3xl text-white"></i> : <i className="fas fa-wand-magic-sparkles text-3xl text-white"></i>}
              </div>
            </button>
          </div>

          {/* Primary Stats Section: Health, Mana, Strength */}
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col items-center justify-center bg-red-950/30 border border-red-500/20 rounded-2xl py-3 shadow-inner">
               <span className="text-[8px] font-black uppercase text-red-400 tracking-widest mb-1">Health</span>
               <span className="text-2xl font-black text-white">{character.stats.health}</span>
            </div>
            <div className="flex flex-col items-center justify-center bg-blue-950/30 border border-blue-500/20 rounded-2xl py-3 shadow-inner">
               <span className="text-[8px] font-black uppercase text-blue-400 tracking-widest mb-1">Mana</span>
               <span className="text-2xl font-black text-white">{character.stats.mana}</span>
            </div>
            <div className="flex flex-col items-center justify-center bg-amber-950/30 border border-amber-500/20 rounded-2xl py-3 shadow-inner">
               <span className="text-[8px] font-black uppercase text-amber-400 tracking-widest mb-1">Strength</span>
               <span className="text-2xl font-black text-white">{character.stats.strength}</span>
            </div>
          </div>

          {/* Lore Scroll Section */}
          <div className="relative bg-[#dcc9a3] rounded-2xl p-4 border-l-[6px] border-[#8b5e3c] shadow-inner min-h-[90px] flex flex-col">
             <div className="flex items-center justify-between mb-2">
               <span className="text-[8px] font-black uppercase text-amber-900/40 tracking-[0.4em]">Ancient Lore</span>
               <button 
                onClick={onGenerateBackstory} 
                disabled={isBackstoryLoading}
                className="text-amber-900/30 hover:text-amber-900 transition-colors"
               >
                 <i className={`fas fa-pen-fancy text-[10px] ${isBackstoryLoading ? 'fa-beat' : ''}`}></i>
               </button>
             </div>
             <p className={`handwritten text-stone-900 text-[11px] leading-snug italic transition-all duration-500 flex-1 ${isBackstoryLoading ? 'opacity-20 blur-[2px]' : 'opacity-100'}`}>
                "{character.backstory}"
             </p>
          </div>
        </div>

        {/* Action Button: Save to Deck */}
        <div className="absolute bottom-6 right-6 z-30">
          <button 
            onClick={() => onSaveToDeck(character)}
            disabled={isSaved}
            className={`flex items-center gap-3 px-6 py-4 rounded-2xl transition-all duration-500 transform hover:scale-105 active:scale-95 shadow-2xl border-2 ${isSaved ? 'bg-emerald-800 border-emerald-500 opacity-80 cursor-default' : 'bg-red-900 border-red-600 hover:bg-red-800 hover:shadow-red-900/40'}`}
          >
            {isSaved ? (
              <>
                <i className="fas fa-check-double text-white text-lg"></i>
                <span className="text-xs font-black text-white uppercase tracking-widest">In Your Deck</span>
              </>
            ) : (
              <>
                <i className="fas fa-box-archive text-white text-lg"></i>
                <span className="text-xs font-black text-white uppercase tracking-widest">Save to Deck</span>
              </>
            )}
          </button>
        </div>
      </div>
      
      {/* Shadow Underneath */}
      <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-4/5 h-12 bg-black/60 blur-[60px] rounded-full -z-10"></div>
    </div>
  );
};

export default CharacterDisplay;
