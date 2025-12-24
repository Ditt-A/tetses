import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Play, Volume2 } from 'lucide-react';
import { contentData } from './content';

export default function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  
  // Ganti '/song.mp3' sesuai nama file lagu di folder public
  const audioRef = useRef(new Audio('/cas.mp3')); 

  const handleStart = () => {
    setIsStarted(true);
    audioRef.current.currentTime = 45; // Contoh: Mulai di detik ke-45
    audioRef.current.loop = true;
    // Catch error kalau file lagu tidak ada
    audioRef.current.play().catch(e => console.log("Gagal play audio:", e));
  };

  const handleTap = (e) => {
    if (e.target.tagName === 'BUTTON') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    
    if (x < rect.width / 3) {
      if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
    } else {
      if (currentIndex < contentData.length - 1) setCurrentIndex(prev => prev + 1);
    }
  };

  useEffect(() => {
    if (!isStarted || currentIndex === contentData.length - 1) return;
    const timer = setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
    }, 9000);
    return () => clearTimeout(timer);
  }, [currentIndex, isStarted]);

  const handleYes = (phone) => {
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    setTimeout(() => {
      window.location.href = `https://wa.me/${phone}?text=Hai,%20aku%20mau%20coba%20lagi.`;
    }, 1500);
  };

  const currentSlide = contentData[currentIndex];

  return (
    <div className="w-full h-screen bg-[#121212] flex justify-center items-center overflow-hidden">
      <div 
        className="relative w-full max-w-[420px] h-full max-h-[900px] bg-black shadow-2xl overflow-hidden sm:rounded-[2rem] sm:h-[90vh] sm:border-[8px] sm:border-[#333]"
        style={{ 
          // Logic: Kalau ada bgImage pakai foto, kalau tidak pakai warna biasa
          backgroundImage: isStarted && currentSlide.bgImage ? `url(${currentSlide.bgImage})` : 'none',
          backgroundColor: isStarted ? currentSlide.color : '#000',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transition: 'background-image 0.5s ease-in-out, background-color 0.5s'
        }}
        onClick={isStarted ? handleTap : undefined}
      >
        
        {/* TAMBAHAN BARU: Overlay Gelap biar tulisan kebaca */}
        {isStarted && currentSlide.bgImage && (
          <div className="absolute inset-0 bg-black/60 z-0"></div>
        )}
        
        {/* HALAMAN PEMBUKA */}
        {!isStarted && (
          <div className="absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-50 bg-black">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center"
            >
              <div className="w-20 h-20 bg-[#1DB954] rounded-full flex items-center justify-center mb-6 animate-pulse">
                <Play fill="black" className="ml-1 text-black" size={32} />
              </div>
              <h1 className="text-3xl font-bold mb-2 text-white">Second Chance?</h1>
              <p className="text-gray-400 mb-8">For You</p>
              <button onClick={handleStart} className="bg-white text-black px-8 py-3 rounded-full font-bold text-lg hover:scale-105 transition">
                Start
              </button>
            </motion.div>
          </div>
        )}

        {/* KONTEN UTAMA */}
        {isStarted && (
          <>
            {/* Progress Bar */}
            <div className="absolute top-4 left-0 w-full px-4 flex gap-1 z-50">
              {contentData.map((_, idx) => (
                <div key={idx} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-white"
                    initial={{ width: "0%" }}
                    animate={{ width: idx < currentIndex ? "100%" : idx === currentIndex ? "100%" : "0%" }}
                    transition={{ duration: idx === currentIndex ? 10 : 0, ease: "linear" }}
                  />
                </div>
              ))}
            </div>

            {/* Music Indicator */}
            <div className="absolute top-8 left-4 flex items-center gap-2 opacity-70 z-40 text-white mt-2">
              <Volume2 size={14} className="animate-pulse" />
              <span className="text-xs font-bold uppercase">Playing You're All I Want - Cigarettes After Sex</span>
            </div>

            {/* Render Slide */}
            <AnimatePresence mode='wait'>
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="h-full w-full flex flex-col justify-center items-center p-8 text-center text-white"
              >
                {currentSlide.type === 'opening' && (
                  <>
                    <h1 className="text-4xl font-black mb-4">{currentSlide.text}</h1>
                    <p className="text-lg opacity-80">{currentSlide.subText}</p>
                  </>
                )}

                {currentSlide.type === 'stat' && (
                  <div className="w-full px-2"> {/* Tambah padding biar gak mepet layar */}
                  
                  {/* Icon (Opsional, kalau gak mau pake bisa dihapus baris ini) */}
                  <currentSlide.icon size={48} className="mb-6 text-white/80 mx-auto drop-shadow-md" />
                  
                  {/* Judul Atas (Misal: FOR SEVIRA...) */}
                  <h2 className="text-2xl font-black uppercase opacity-100 mb-6 tracking-wide drop-shadow-md">
                    {currentSlide.label}
                  </h2>
                  
                  {/* Angka Besar/Value (Bisa dikosongin di content.jsx kalau gak butuh) */}
                  {currentSlide.value && (
                    <h1 className="text-5xl font-black mb-6 text-white drop-shadow-lg">
                      {currentSlide.value}
                    </h1>
                  )}

                  {/* BAGIAN SURAT / DESKRIPSI (Ini yang diedit jadi Justify) */}
                  <p className="text-base text-justify leading-relaxed font-medium opacity-95 drop-shadow-sm px-2">
                    {currentSlide.description}
                  </p>

                </div>

                )}

                {currentSlide.type === 'music' && (
                  <>
                    <div className="w-56 h-56 bg-gray-800 rounded-lg shadow-2xl mb-6 overflow-hidden mx-auto rotate-1 border-2 border-white/20">
                      <img src={currentSlide.image} alt="Album" className="w-full h-full object-cover" />
                    </div>
                    <h2 className="text-2xl font-bold mb-1">{currentSlide.title}</h2>
                    <p className="opacity-70 mb-6">{currentSlide.artist}</p>
                    <p className="italic bg-white/10 p-3 rounded-lg">"{currentSlide.caption}"</p>
                  </>
                )}

                {currentSlide.type === 'final' && (
                  <>
                    <h1 className="text-4xl font-bold mb-6">{currentSlide.title}</h1>
                    <p className="text-lg mb-10">{currentSlide.text}</p>
                    <button 
                      onClick={() => handleYes(currentSlide.whatsappNumber)}
                      className="bg-[#1DB954] text-black font-bold py-4 px-10 rounded-full text-xl hover:scale-105 transition shadow-lg"
                    >
                      Yes, Let's Fix This
                    </button>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </>
        )}
      </div>
    </div>
  );
}