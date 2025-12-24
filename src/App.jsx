// ... (Import tetap sama seperti sebelumnya)
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Play, Volume2 } from 'lucide-react';
import { contentData } from './content';

export default function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const audioRef = useRef(new Audio('/song.mp3'));

  const handleStart = () => {
    setIsStarted(true);
    audioRef.current.loop = true;
    audioRef.current.play().catch(e => console.log("Audio play error:", e));
  };

  const handleTap = (e) => {
    if (e.target.tagName === 'BUTTON') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left; // Hitung posisi tap relatif terhadap container HP
    
    if (x < rect.width / 3) {
      if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
    } else {
      if (currentIndex < contentData.length - 1) setCurrentIndex(prev => prev + 1);
    }
  };

  // Logic Autoplay Slide
  useEffect(() => {
    if (!isStarted || currentIndex === contentData.length - 1) return;
    const timer = setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
    }, 6000);
    return () => clearTimeout(timer);
  }, [currentIndex, isStarted]);

  const handleYes = (phone) => {
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#1DB954', '#ffffff'] });
    setTimeout(() => {
      window.location.href = `https://wa.me/${phone}?text=Hai,%20aku%20udah%20liat%20websitenya...`;
    }, 1500);
  };

  const currentSlide = contentData[currentIndex];

  // --- RENDERING ---
  return (
    // CONTAINER UTAMA (Wrapper biar di tengah layar laptop)
    <div className="w-full h-screen bg-[#121212] flex justify-center items-center">
      
      {/* CONTAINER HP (Membatasi lebar max 430px biar kayak iPhone Max) */}
      <div 
        className="relative w-full max-w-[430px] h-full max-h-[932px] bg-black overflow-hidden shadow-2xl sm:rounded-[3rem] sm:h-[95vh] sm:border-8 sm:border-[#2a2a2a]"
        style={{ backgroundColor: isStarted ? currentSlide.color : '#000' }}
        onClick={isStarted ? handleTap : undefined}
      >

        {/* --- SCREEN 1: TOMBOL START --- */}
        {!isStarted && (
          <div className="absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-900/40 to-black z-0"></div>
            
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="z-10 flex flex-col items-center"
            >
              <div className="w-24 h-24 bg-[#1DB954] rounded-full flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(29,185,84,0.6)] animate-pulse">
                <Play fill="black" className="ml-2 text-black" size={40} />
              </div>
              
              <h1 className="text-4xl font-black mb-2 tracking-tighter">2024 Wrapped</h1>
              <p className="text-gray-400 mb-12 text-lg">Special Edition for You</p>
              
              <button 
                onClick={handleStart}
                className="bg-white text-black px-10 py-4 rounded-full font-bold text-xl hover:scale-105 active:scale-95 transition-all shadow-xl"
              >
                Buka Sekarang
              </button>
            </motion.div>
            
            <p className="absolute bottom-10 text-xs text-gray-600">Powered by Kenangan</p>
          </div>
        )}

        {/* --- SCREEN 2: CONTENT SLIDES --- */}
        {isStarted && (
          <>
            {/* Background Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/80 z-0 pointer-events-none"></div>

            {/* Progress Bar */}
            <div className="absolute top-6 left-0 w-full px-4 flex gap-1 z-50 pt-2 sm:pt-4">
              {contentData.map((_, idx) => (
                <div key={idx} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-white shadow-[0_0_10px_white]"
                    initial={{ width: "0%" }}
                    animate={{ width: idx < currentIndex ? "100%" : idx === currentIndex ? "100%" : "0%" }}
                    transition={{ duration: idx === currentIndex ? 6 : 0, ease: "linear" }}
                  />
                </div>
              ))}
            </div>

            {/* Header Music */}
            <div className="absolute top-10 left-5 flex items-center gap-2 opacity-80 z-40 text-xs font-bold uppercase tracking-widest mt-2 sm:mt-4">
              <Volume2 size={14} className="animate-pulse text-[#1DB954]" />
              <span className="drop-shadow-md">Playing: Our Memories</span>
            </div>

            {/* Main Content */}
            <AnimatePresence mode='wait'>
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="h-full w-full flex flex-col justify-center items-center p-6 text-center z-10 relative"
              >
                
                {/* LOGIC TAMPILAN PER TIPE (Sama seperti sebelumnya, tapi CSS dirapikan) */}
                {currentSlide.type === 'opening' && (
                  <>
                    <h1 className="text-5xl font-black mb-6 leading-tight tracking-tighter text-shadow">{currentSlide.text}</h1>
                    <p className="text-xl font-medium opacity-90 leading-relaxed">{currentSlide.subText}</p>
                  </>
                )}

                {currentSlide.type === 'stat' && (
                  <div className="scale-110">
                    <div className="mb-8 p-6 bg-white/10 rounded-full backdrop-blur-sm inline-block">
                      <currentSlide.icon size={56} className="text-[#1DB954]" />
                    </div>
                    <h2 className="text-xl font-bold mb-2 uppercase tracking-widest opacity-70">{currentSlide.label}</h2>
                    <h1 className="text-6xl font-black mb-6 text-shadow text-[#1DB954]">{currentSlide.value}</h1>
                    <p className="text-lg opacity-90 max-w-[250px] mx-auto leading-relaxed">{currentSlide.description}</p>
                  </div>
                )}

                {currentSlide.type === 'music' && (
                  <div className="w-full max-w-xs">
                    <div className="relative w-64 h-64 mx-auto mb-10 group">
                      <div className="absolute inset-0 bg-[#1DB954] rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                      <div className="relative w-full h-full rounded-full bg-black border-[6px] border-[#1a1a1a] shadow-2xl animate-spin-slow flex items-center justify-center overflow-hidden">
                        <img src={currentSlide.image} className="w-full h-full object-cover opacity-90" />
                        <div className="absolute w-4 h-4 bg-[#121212] rounded-full z-10 border border-white/20"></div>
                      </div>
                    </div>
                    <h2 className="text-3xl font-bold mb-2 truncate">{currentSlide.title}</h2>
                    <p className="text-lg opacity-70 mb-6">{currentSlide.artist}</p>
                    <div className="bg-white/10 p-4 rounded-xl backdrop-blur-md border border-white/5">
                      <p className="italic font-medium">"{currentSlide.caption}"</p>
                    </div>
                  </div>
                )}

                {currentSlide.type === 'photo' && (
                  <div className="w-full h-full flex flex-col justify-center py-10">
                    <div 
                      className="w-full aspect-[4/5] bg-cover bg-center rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] mb-8 rotate-2 border-4 border-white/90"
                      style={{ backgroundImage: `url(${currentSlide.image})` }}
                    ></div>
                    <p className="text-xl font-bold text-shadow px-4">"{currentSlide.caption}"</p>
                  </div>
                )}

                {currentSlide.type === 'final' && (
                  <div className="w-full max-w-xs">
                    <h1 className="text-4xl font-black mb-6 leading-tight">{currentSlide.title}</h1>
                    <p className="text-lg mb-12 opacity-90 leading-relaxed">{currentSlide.text}</p>
                    
                    <div className="flex flex-col gap-4">
                      <button 
                        onClick={() => handleYes(currentSlide.whatsappNumber)}
                        className="bg-[#1DB954] text-black font-extrabold py-4 px-8 rounded-full text-lg hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(29,185,84,0.4)]"
                      >
                        Yes, Let's do it! ❤️
                      </button>
                      <button 
                         onClick={(e) => { e.stopPropagation(); alert("It's okay :)"); }}
                        className="border-2 border-white/20 text-white font-bold py-3 px-8 rounded-full text-sm hover:bg-white/10 transition-colors"
                      >
                        Maybe next time
                      </button>
                    </div>
                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          </>
        )}
      </div>
    </div>
  );
}