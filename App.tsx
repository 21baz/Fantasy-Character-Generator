import React, { useState, useCallback, useEffect } from 'react';
import { Character, AppStatus } from './types';
import { generateCharacter, generatePortrait, generateNewBackstory } from './services/geminiService';
import CharacterDisplay from './components/CharacterDisplay';

const App: React.FC = () => {
  const [character, setCharacter] = useState<Character | null>(null);
  const [deck, setDeck] = useState<Character[]>([]);
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [isPortraitLoading, setIsPortraitLoading] = useState(false);
  const [isBackstoryLoading, setIsBackstoryLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'forge' | 'deck'>('forge');

  // Load deck from storage on boot
  useEffect(() => {
    const saved = localStorage.getItem('hero_deck');
    if (saved) {
      try {
        setDeck(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse deck", e);
      }
    }
  }, []);

  const saveDeck = (newDeck: Character[]) => {
    setDeck(newDeck);
    localStorage.setItem('hero_deck', JSON.stringify(newDeck));
  };

  const handleGenerate = useCallback(async () => {
    setStatus(AppStatus.LOADING);
    setError(null);
    setActiveTab('forge');
    try {
      const newCharacter = await generateCharacter();
      setCharacter(newCharacter);
      setStatus(AppStatus.SUCCESS);
    } catch (err) {
      console.error(err);
      setError('The astral seal broke. The forge is cooling. Please try again.');
      setStatus(AppStatus.ERROR);
    }
  }, []);

  const handleGeneratePortrait = useCallback(async () => {
    if (!character) return;
    setIsPortraitLoading(true);
    setError(null);
    try {
      const portraitUrl = await generatePortrait(character);
      const updated = { ...character, portraitUrl };
      setCharacter(updated);
      // Update in deck if already saved
      if (deck.find(c => c.id === character.id)) {
        saveDeck(deck.map(c => c.id === character.id ? updated : c));
      }
    } catch (err) {
      console.error(err);
      setError('The visual potion failed to brew.');
    } finally {
      setIsPortraitLoading(false);
    }
  }, [character, deck]);

  const handleGenerateBackstory = useCallback(async () => {
    if (!character) return;
    setIsBackstoryLoading(true);
    setError(null);
    try {
      const newBackstory = await generateNewBackstory(character);
      const updated = { ...character, backstory: newBackstory };
      setCharacter(updated);
      if (deck.find(c => c.id === character.id)) {
        saveDeck(deck.map(c => c.id === character.id ? updated : c));
      }
    } catch (err) {
      console.error(err);
      setError('The quill snapped.');
    } finally {
      setIsBackstoryLoading(false);
    }
  }, [character, deck]);

  const handleSaveToDeck = (char: Character) => {
    if (deck.find(c => c.id === char.id)) return;
    const charToSave = { ...char, savedAt: Date.now() };
    saveDeck([charToSave, ...deck]);
  };

  const removeFromDeck = (id: string) => {
    saveDeck(deck.filter(c => c.id !== id));
  };

  const selectFromDeck = (char: Character) => {
    setCharacter(char);
    setActiveTab('forge');
  };

  const isSaved = !!(character && deck.find(c => c.id === character.id));

  return (
    <div className="min-h-screen flex flex-col py-12 px-4 md:px-12 relative overflow-hidden bg-[#0c0a09]">
      
      {/* Mystical Atmosphere */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-20 left-10 text-amber-500/5 text-[12rem] rune-float"><i className="fas fa-hat-wizard"></i></div>
        <div className="absolute top-[-10%] left-[-10%] w-full h-full bg-gradient-to-br from-amber-900/10 via-stone-900/80 to-stone-950"></div>
      </div>

      <header className="text-center mb-16 z-20">
        <h1 className="text-5xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-amber-500 to-amber-900 mb-6 alchemist-glow">
          THE ARTIFICER'S FORGE
        </h1>
        
        {/* Navigation Tabs */}
        <div className="flex justify-center gap-6 mt-10">
          <button 
            onClick={() => setActiveTab('forge')}
            className={`flex items-center gap-3 px-10 py-4 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] transition-all border-2 ${activeTab === 'forge' ? 'bg-amber-600 text-white border-amber-500 shadow-[0_0_30px_rgba(217,119,6,0.5)]' : 'bg-stone-900/40 text-stone-500 border-stone-800 hover:border-stone-600 hover:text-stone-300'}`}
          >
            <i className="fas fa-hammer"></i> Forge
          </button>
          <button 
            onClick={() => setActiveTab('deck')}
            className={`flex items-center gap-3 px-10 py-4 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] transition-all border-2 ${activeTab === 'deck' ? 'bg-amber-600 text-white border-amber-500 shadow-[0_0_30px_rgba(217,119,6,0.5)]' : 'bg-stone-900/40 text-stone-500 border-stone-800 hover:border-stone-600 hover:text-stone-300'}`}
          >
            <i className="fas fa-box-archive"></i> My Deck ({deck.length})
          </button>
        </div>
      </header>

      <main className="flex-1 w-full max-w-6xl mx-auto z-10">
        {activeTab === 'forge' ? (
          <div className="flex flex-col items-center gap-20">
            {/* Generate Button Area */}
            <div className="relative group">
              <div className="absolute -inset-8 bg-amber-500/10 rounded-full blur-3xl group-hover:bg-amber-500/20 transition-all duration-1000"></div>
              <button
                onClick={handleGenerate}
                disabled={status === AppStatus.LOADING}
                className="relative px-20 py-8 bg-[#1a1612] border-4 border-amber-900/60 rounded-[2.5rem] flex items-center gap-10 group-hover:border-amber-400 group-hover:shadow-[0_0_50px_rgba(217,119,6,0.4)] transition-all active:scale-95 disabled:opacity-50"
              >
                <div className="bg-amber-950/60 p-5 rounded-full shadow-inner border border-amber-800/30">
                  <i className={`fas ${status === AppStatus.LOADING ? 'fa-circle-notch fa-spin' : 'fa-wand-sparkles'} text-4xl text-amber-500`}></i>
                </div>
                <div className="flex flex-col items-start text-left">
                  <span className="text-amber-100 text-3xl font-black fantasy-font tracking-[0.2em] leading-none uppercase">
                    {status === AppStatus.LOADING ? 'Transmuting...' : 'Summon Hero'}
                  </span>
                  <span className="text-amber-700 text-[11px] font-black tracking-[0.5em] uppercase mt-2">
                    Expend 1 Astral Soul
                  </span>
                </div>
              </button>
            </div>

            {error && (
              <div className="bg-red-950/20 border-2 border-red-900/40 px-8 py-5 rounded-2xl text-red-200 text-sm font-bold animate-in slide-in-from-top-4 flex items-center gap-4">
                <i className="fas fa-skull text-red-600 text-xl"></i> {error}
              </div>
            )}

            <div className="w-full flex justify-center min-h-[600px]">
              {status === AppStatus.LOADING ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="transmutation-circle mb-10 scale-125 border-amber-500/50"></div>
                  <p className="text-amber-500/40 font-black uppercase tracking-[0.8em] text-xs animate-pulse">Piercing the Veil...</p>
                </div>
              ) : character ? (
                <CharacterDisplay 
                  character={character} 
                  onGeneratePortrait={handleGeneratePortrait}
                  isPortraitLoading={isPortraitLoading}
                  onGenerateBackstory={handleGenerateBackstory}
                  isBackstoryLoading={isBackstoryLoading}
                  onSaveToDeck={handleSaveToDeck}
                  isSaved={isSaved}
                />
              ) : (
                <div className="text-center p-32 bg-stone-950/30 border-2 border-dashed border-stone-800/40 rounded-[4rem] opacity-30 flex flex-col items-center group">
                  <i className="fas fa-scroll-old text-8xl text-stone-800 mb-10 block group-hover:scale-110 transition-transform"></i>
                  <h3 className="text-3xl font-black fantasy-font text-stone-700 uppercase tracking-[0.2em]">Forge Empty</h3>
                  <p className="text-sm text-stone-800 uppercase tracking-[0.4em] mt-3">Ready to channel astral energy</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="w-full animate-in fade-in duration-1000">
            <div className="flex justify-between items-center mb-12 border-b border-stone-800/60 pb-6 px-4">
              <h2 className="text-3xl font-black fantasy-font text-stone-500 uppercase tracking-widest">Saved Collection</h2>
              <span className="text-stone-700 font-black uppercase text-[10px] tracking-[0.4em]">{deck.length} Legendary Souls Found</span>
            </div>
            
            {deck.length === 0 ? (
              <div className="text-center py-60 opacity-10">
                <i className="fas fa-box-open text-9xl mb-12"></i>
                <h2 className="text-4xl font-black fantasy-font uppercase tracking-[0.3em]">No Legends Saved</h2>
                <p className="text-sm uppercase tracking-[0.5em] mt-4">The deck is empty, Artisan</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-10 gap-y-16">
                {deck.map(char => (
                  <div key={char.id} className="relative group/deck-item">
                    <div 
                      onClick={() => selectFromDeck(char)}
                      className="cursor-pointer transition-all duration-700 transform group-hover/deck-item:-translate-y-4 group-hover/deck-item:scale-105"
                    >
                      {/* Grid Mini Card View */}
                      <div className={`bg-[#1a1612] rounded-[2rem] p-3 border-4 ${char.rarity === 'Legendary' ? 'border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.2)]' : 'border-stone-800'} overflow-hidden aspect-[3/4] relative`}>
                        <div className="relative h-full w-full rounded-[1.4rem] overflow-hidden">
                          {char.portraitUrl ? (
                            <img src={char.portraitUrl} alt={char.name} className="w-full h-full object-cover rounded-xl" />
                          ) : (
                            <div className="w-full h-full bg-stone-950 flex items-center justify-center text-stone-900 text-6xl"><i className="fas fa-mask"></i></div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"></div>
                          
                          {/* Mini Stats Tag */}
                          <div className="absolute top-2 right-2 flex gap-1">
                             <div className="w-5 h-5 rounded-full bg-red-900/80 flex items-center justify-center border border-red-500/30">
                                <span className="text-[7px] text-white font-black">{char.stats.health}</span>
                             </div>
                             <div className="w-5 h-5 rounded-full bg-blue-900/80 flex items-center justify-center border border-blue-500/30">
                                <span className="text-[7px] text-white font-black">{char.stats.mana}</span>
                             </div>
                          </div>

                          <div className="absolute inset-x-0 bottom-0 p-4">
                             <h3 className="text-white text-lg font-black fantasy-font truncate leading-tight drop-shadow-md">{char.name}</h3>
                             <div className="flex justify-between items-center mt-1.5">
                               <p className="text-amber-500/80 text-[9px] uppercase font-black tracking-widest">{char.class}</p>
                               <span className="text-stone-500 text-[8px] font-black uppercase tracking-tighter">LVL 01</span>
                             </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Discard Action - Only visible on hover */}
                    <button 
                      onClick={(e) => { e.stopPropagation(); removeFromDeck(char.id); }}
                      className="absolute -top-4 -right-4 w-12 h-12 bg-red-950/90 backdrop-blur-md border-2 border-red-500/40 text-red-400 rounded-full opacity-0 group-hover/deck-item:opacity-100 transition-all flex items-center justify-center hover:bg-red-700 hover:text-white shadow-2xl z-40 transform hover:scale-110"
                      title="Discard Soul"
                    >
                      <i className="fas fa-trash-can text-sm"></i>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="mt-32 py-16 text-center text-stone-800 text-[11px] font-black uppercase tracking-[0.6em] opacity-40 flex items-center justify-center gap-10">
        <div className="h-px w-32 bg-stone-900"></div>
        <span>&bull; COLLECTIBLE HERO ENGINE v1.5 &bull;</span>
        <div className="h-px w-32 bg-stone-900"></div>
      </footer>
    </div>
  );
};

export default App;