import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Music, VolumeX, Send, Sparkles, Heart, Calendar, Clock, Star } from 'lucide-react';
import Tilt from 'react-parallax-tilt';

// --- පින්තූර ලැයිස්තුව ---
const photos = [
  '/photos/1.png', '/photos/2.png', '/photos/3.png', '/photos/4.png', '/photos/5.png',
  '/photos/6.png', '/photos/7.png', '/photos/8.png', '/photos/9.png', '/photos/10.png'
];

// --- සුබ පැතුම් සඳහා Type එක ---
interface Wish {
  id: number;
  name: string;
  message: string;
}

const initialWishes: Wish[] = [
  { id: 1, name: "Bestie ❤️", message: "Happy 21st Birthday! I hope your day is as amazing as you are. Let's celebrate soon! 🎉" },
  { id: 2, name: "Amma & Thaththa", message: "We are so proud of the beautiful person you have become. May all your dreams come true! 💖" }
];

// --- MAGIC CURSOR TRAIL ---
const CursorTrail = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 border-2 border-luxury-gold rounded-full pointer-events-none z-[9999] hidden md:flex items-center justify-center shadow-[0_0_15px_#d4af37]"
      animate={{ x: mousePosition.x - 16, y: mousePosition.y - 16 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200, mass: 0.5 }}
    >
      <div className="w-1 h-1 bg-luxury-gold rounded-full shadow-[0_0_10px_#d4af37]"></div>
    </motion.div>
  );
};

// --- LIFE IN NUMBERS ---
const LifeInNumbers = () => {
  const stats = [
    { label: "Days of Magic", value: "7,670+", icon: <Calendar size={28} className="text-luxury-gold" /> },
    { label: "Hours of Joy", value: "184,080+", icon: <Clock size={28} className="text-luxury-gold" /> },
    { label: "Heart of Gold", value: "1", icon: <Heart size={28} className="text-luxury-gold" fill="#d4af37" /> }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-24 w-full max-w-4xl mx-auto">
      {stats.map((stat, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.2, duration: 0.8 }}
          className="bg-slate-800/40 backdrop-blur-md p-8 rounded-3xl border border-luxury-gold/30 text-center group hover:bg-slate-800/70 transition-all duration-500 shadow-xl hover:shadow-[0_0_25px_rgba(212,175,55,0.2)]"
        >
          <div className="flex justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
            {stat.icon}
          </div>
          <div className="text-4xl font-bold text-white mb-2 font-serif tracking-wider">
            {stat.value}
          </div>
          <div className="text-luxury-gold uppercase text-xs tracking-[0.2em] font-semibold">
            {stat.label}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// --- ADVANCED & RESPONSIVE SCRATCH CARD ---
const ScratchCard = ({ text }: { text: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScratched, setIsScratched] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;

    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#d4af37');
    gradient.addColorStop(0.5, '#f5d76e');
    gradient.addColorStop(1, '#8b6508');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const fontSize = canvas.width < 500 ? '18px' : '24px';
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${fontSize} serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = "rgba(0,0,0,0.5)";
    ctx.shadowBlur = 4;
    ctx.fillText('✨ Scratch to Reveal Magic ✨', canvas.width / 2, canvas.height / 2);

    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

    const getMousePos = (e: any) => {
      const rect = canvas.getBoundingClientRect();
      let clientX, clientY;

      if (e.touches && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if (e.changedTouches && e.changedTouches.length > 0) {
        clientX = e.changedTouches[0].clientX;
        clientY = e.changedTouches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }
      return { x: clientX - rect.left, y: clientY - rect.top };
    };

    const start = (e: any) => {
      isDrawing = true;
      const pos = getMousePos(e);
      lastX = pos.x;
      lastY = pos.y;
      
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(lastX, lastY, 30, 0, Math.PI * 2);
      ctx.fill();
    };

    const scratch = (e: any) => {
      if (!isDrawing) return;
      if (e.cancelable) e.preventDefault(); 
      
      const pos = getMousePos(e);

      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = 60; 
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();

      lastX = pos.x;
      lastY = pos.y;
    };

    const checkScratch = () => {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let clearPixels = 0;
      const totalPixels = canvas.width * canvas.height;

      for (let i = 3; i < imgData.length; i += 16) {
        if (imgData[i] < 128) clearPixels++;
      }

      if (clearPixels > (totalPixels / 4) * 0.35) { 
        setIsScratched(true);
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 }, colors: ['#d4af37', '#ffffff'] });
      }
    };

    const stop = () => {
      if (!isDrawing) return;
      isDrawing = false;
      checkScratch();
    };

    canvas.addEventListener('mousedown', start);
    canvas.addEventListener('mousemove', scratch);
    window.addEventListener('mouseup', stop);
    
    canvas.addEventListener('touchstart', start, { passive: false });
    canvas.addEventListener('touchmove', scratch, { passive: false });
    canvas.addEventListener('touchend', stop);

    return () => {
      canvas.removeEventListener('mousedown', start);
      canvas.removeEventListener('mousemove', scratch);
      window.removeEventListener('mouseup', stop);
      canvas.removeEventListener('touchstart', start);
      canvas.removeEventListener('touchmove', scratch);
      canvas.removeEventListener('touchend', stop);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl mx-auto min-h-[250px] sm:min-h-[300px] flex items-center justify-center rounded-3xl overflow-hidden shadow-2xl border border-luxury-gold/50 mt-12 group">
      <div className="absolute inset-0 bg-slate-900 flex items-center justify-center p-6 sm:p-10 text-center">
        <div className="absolute inset-0 bg-luxury-gold/5 blur-[50px] rounded-full"></div>
        <motion.p 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: isScratched ? 1 : 0.8, opacity: isScratched ? 1 : 0 }}
          transition={{ duration: 1, type: "spring" }}
          className="relative z-0 text-base sm:text-xl md:text-2xl lg:text-3xl text-luxury-gold font-serif leading-relaxed italic"
        >
          "{text}"
        </motion.p>
      </div>
      <canvas
        ref={canvasRef}
        style={{ touchAction: 'none' }}
        className={`absolute inset-0 w-full h-full cursor-crosshair z-10 transition-opacity duration-[1500ms] ${isScratched ? 'opacity-0 pointer-events-none' : ''}`}
      />
    </div>
  );
};

// --- Floating Particles Background ---
const BackgroundParticles = () => (
  <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
    {[...Array(25)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-1.5 h-1.5 bg-luxury-gold rounded-full opacity-30 shadow-[0_0_10px_#d4af37]"
        animate={{
          y: ['100vh', '-10vh'],
          x: [Math.random() * 100 - 50, Math.random() * 100 - 50],
          opacity: [0, 0.7, 0]
        }}
        transition={{
          duration: Math.random() * 12 + 10,
          repeat: Infinity,
          ease: 'linear',
          delay: Math.random() * 10
        }}
        style={{ left: `${Math.random() * 100}%` }}
      />
    ))}
  </div>
);

export default function App() {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const [wishes, setWishes] = useState<Wish[]>(initialWishes);
  const [newName, setNewName] = useState('');
  const [newMessage, setNewMessage] = useState('');

  // --- TOUR GUIDE STATE ---
  const [tourStep, setTourStep] = useState(0);

  // Check LocalStorage on First Load
  useEffect(() => {
    const hasVisited = localStorage.getItem('nextgen_visited');
    if (!hasVisited) {
      setTourStep(1); // Start guide for first-timers
      localStorage.setItem('nextgen_visited', 'true');
    }
  }, []);

  const titleWords = "Happy 21st Birthday!".split(" ");

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleOpenCard = () => {
    if (step !== 0) return;
    setStep(1);
    
    if (audioRef.current) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => console.log("Audio play prevented:", err));
    }
    
    setTimeout(() => {
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({ particleCount: 8, angle: 60, spread: 70, origin: { x: 0, y: 0.8 }, colors: ['#d4af37', '#b76e79', '#ffffff', '#ffd700'] });
        confetti({ particleCount: 8, angle: 120, spread: 70, origin: { x: 1, y: 0.8 }, colors: ['#d4af37', '#b76e79', '#ffffff', '#ffd700'] });
        if (Date.now() < end) requestAnimationFrame(frame);
      };
      frame();
    }, 500);

    setTimeout(() => {
      setStep(2);
      // Advance to next tour step (Music Button) safely after site loads
      setTourStep(prev => (prev === 1 ? 2 : prev));
    }, 3500);
  };

  const handleAddWish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newMessage.trim()) return;

    const newWish: Wish = { id: Date.now(), name: newName, message: newMessage };
    setWishes([newWish, ...wishes]);
    setNewName('');
    setNewMessage('');
    
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.9 }, colors: ['#b76e79', '#d4af37'] });
  };

  return (
    <div className="min-h-screen bg-luxury-dark font-sans flex flex-col items-center justify-center relative overflow-hidden">
      <CursorTrail />
      <BackgroundParticles />
      
      <audio ref={audioRef} src="/music.mp3" loop />

      {/* --- TOUR GUIDE OVERLAYS --- */}
      <AnimatePresence>
        {/* Step 1: Envelope Guide */}
        {tourStep === 1 && step === 0 && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-none"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute top-[65%] md:top-[70%] text-center px-4"
            >
              <div className="w-1 h-12 bg-gradient-to-t from-transparent to-luxury-gold mx-auto mb-4 rounded-full"></div>
              <h3 className="text-2xl font-serif text-luxury-gold mb-2">Welcome!</h3>
              <p className="text-gray-300 text-sm tracking-widest uppercase font-semibold">Tap the envelope to unlock</p>
            </motion.div>
          </motion.div>
        )}

        {/* Step 2: Music Guide */}
        {tourStep === 2 && step === 2 && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-[2px]"
          >
            <div className="absolute top-24 right-4 md:right-10 w-64 bg-slate-900 border border-luxury-gold rounded-2xl p-5 shadow-[0_0_30px_rgba(212,175,55,0.4)] pointer-events-auto">
              <div className="absolute -top-3 right-5 w-4 h-4 bg-slate-900 border-t border-l border-luxury-gold transform rotate-45"></div>
              <h4 className="text-luxury-gold font-serif text-lg mb-2">Set the Mood 🎵</h4>
              <p className="text-gray-400 text-sm mb-4 leading-relaxed">Tap here anytime to play or pause the background music.</p>
              <div className="flex justify-between items-center">
                <button onClick={() => setTourStep(0)} className="text-xs text-gray-500 hover:text-white transition">Skip Tour</button>
                <button onClick={() => setTourStep(3)} className="bg-gradient-to-r from-luxury-gold to-yellow-600 text-slate-900 text-xs font-bold px-4 py-2 rounded-lg shadow-lg hover:shadow-[0_0_15px_#d4af37] transition">Next</button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 3: Scratch Card Guide */}
        {tourStep === 3 && step === 2 && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-[2px] flex items-center justify-center px-4"
          >
            <div className="w-full max-w-[300px] bg-slate-900 border border-luxury-gold rounded-2xl p-6 shadow-[0_0_30px_rgba(212,175,55,0.4)] text-center mt-[-100px] pointer-events-auto">
              <h4 className="text-luxury-gold font-serif text-lg mb-2">Hidden Magic ✨</h4>
              <p className="text-gray-400 text-sm mb-6 leading-relaxed">Scroll down and scratch the golden card to reveal a special hidden message!</p>
              <button onClick={() => setTourStep(0)} className="w-full bg-gradient-to-r from-luxury-gold to-yellow-600 text-slate-900 text-sm font-bold px-4 py-3 rounded-lg shadow-lg hover:shadow-[0_0_15px_#d4af37] transition">Got it, Thanks!</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed top-6 right-6 z-50">
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleMusic}
          className={`p-3 border rounded-full transition-all duration-300 backdrop-blur-md shadow-[0_0_15px_rgba(212,175,55,0.3)] ${
            isPlaying ? 'bg-luxury-gold text-slate-900 border-luxury-gold' : 'bg-slate-800/80 text-luxury-gold border-luxury-gold/50'
          }`}
        >
          {isPlaying ? <Music size={24} /> : <VolumeX size={24} />}
        </motion.button>
      </div>

      <AnimatePresence mode="wait">
        {step < 2 ? (
          <motion.div
            key="card-container"
            exit={{ opacity: 0, scale: 1.2, filter: 'blur(10px)' }}
            transition={{ duration: 1 }}
            className="relative w-[300px] md:w-[400px] h-[400px] md:h-[450px] cursor-pointer group"
            style={{ perspective: 2000 }}
            onClick={handleOpenCard}
          >
            <div className="absolute inset-0 bg-luxury-gold/20 blur-[50px] rounded-full group-hover:bg-luxury-gold/40 transition-colors duration-700"></div>

            <div className="absolute inset-2 bg-gradient-to-b from-slate-900 to-black border-2 border-luxury-gold rounded-xl shadow-2xl flex flex-col items-center justify-center z-0 overflow-hidden">
              <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
              <motion.div 
                animate={step === 1 ? { scale: [0.8, 1.2, 1], opacity: [0, 1] } : { opacity: 0 }}
                transition={{ duration: 1, delay: 0.8 }}
                className="text-center z-10"
              >
                <Heart className="w-10 h-10 md:w-12 md:h-12 text-rose-gold mx-auto mb-4" fill="#b76e79" />
                <h2 className="text-2xl md:text-3xl text-luxury-gold font-serif tracking-widest uppercase">For You</h2>
              </motion.div>
            </div>

            <motion.div
              initial={{ rotateY: 0 }}
              animate={{ rotateY: step === 1 ? -140 : 0 }}
              transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
              style={{ transformOrigin: "left" }}
              className="absolute top-0 left-0 w-1/2 h-full z-10 shadow-[5px_0_20px_rgba(0,0,0,0.7)] rounded-l-xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-slate-800 to-slate-700 border-y border-l border-luxury-gold"></div>
              <div className="absolute top-4 bottom-4 left-4 right-0 border-y border-l border-luxury-gold/30"></div>
            </motion.div>

            <motion.div
              initial={{ rotateY: 0 }}
              animate={{ rotateY: step === 1 ? 140 : 0 }}
              transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
              style={{ transformOrigin: "right" }}
              className="absolute top-0 right-0 w-1/2 h-full z-10 shadow-[-5px_0_20px_rgba(0,0,0,0.7)] rounded-r-xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-l from-slate-800 to-slate-700 border-y border-r border-luxury-gold"></div>
              <div className="absolute top-4 bottom-4 right-4 left-0 border-y border-r border-luxury-gold/30"></div>
            </motion.div>

            <motion.div
              animate={step === 1 ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
            >
              <div className="relative w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-yellow-500 via-luxury-gold to-yellow-700 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.6)] group-hover:shadow-[0_0_30px_rgba(212,175,55,1)] transition-shadow duration-500 border-2 border-yellow-300">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full border border-yellow-800/30 flex items-center justify-center">
                  <span className="font-serif text-xl md:text-2xl text-yellow-900 font-bold">21</span>
                </div>
              </div>
            </motion.div>

            {step === 0 && (
              <motion.div 
                animate={{ y: [0, -10, 0] }} 
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute -bottom-16 w-full text-center text-luxury-gold tracking-[0.2em] uppercase z-20 font-bold text-xs md:text-sm flex justify-center items-center gap-2"
              >
                <Sparkles size={14} /> Tap to Unlock <Sparkles size={14} />
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="main-site"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="w-full flex flex-col items-center"
          >
            {/* Main Content Container */}
            <div className="w-full max-w-6xl mx-auto px-4 md:px-6 pt-10 md:pt-16 z-10 flex-grow pb-24">
              
              {/* Fully Responsive Animated Title */}
              <div className="text-center mb-12 md:mb-16 relative">
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] md:w-[60%] h-[150%] bg-luxury-gold/20 blur-[80px] rounded-full z-0 pointer-events-none"
                />
                
                <h1 className="relative z-10 text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-serif mb-2 flex flex-wrap justify-center font-bold leading-tight gap-x-2 sm:gap-x-4 md:gap-x-6" style={{ perspective: "1000px" }}>
                  {titleWords.map((word, wordIndex) => {
                    const baseIndex = titleWords.slice(0, wordIndex).join("").length;
                    return (
                      <span key={wordIndex} className="inline-block whitespace-nowrap">
                        {word.split("").map((char, charIndex) => {
                          const index = baseIndex + charIndex;
                          return (
                            <motion.span
                              key={index}
                              initial={{ opacity: 0, y: 60, rotateX: -90, filter: 'blur(10px)' }}
                              animate={{ opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)' }}
                              transition={{ duration: 0.8, delay: index * 0.08, type: 'spring', damping: 12, stiffness: 100 }}
                              whileHover={{ scale: 1.2, filter: "brightness(1.5) drop-shadow(0px 0px 15px rgba(212,175,55,0.8))" }}
                              className="bg-gradient-to-br from-white via-luxury-gold to-rose-gold text-transparent bg-clip-text cursor-default inline-block"
                              style={{ paddingBottom: "10px" }}
                            >
                              {char}
                            </motion.span>
                          );
                        })}
                      </span>
                    );
                  })}
                </h1>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2, duration: 1 }}
                  className="relative z-10 flex items-center justify-center gap-2 md:gap-3 text-luxury-gold tracking-[0.2em] md:tracking-[0.3em] uppercase text-[10px] sm:text-xs md:text-sm font-semibold mt-4"
                >
                  <Sparkles size={14} className="text-rose-gold hidden sm:block" />
                  <span>Welcome to your golden era</span>
                  <Sparkles size={14} className="text-rose-gold hidden sm:block" />
                </motion.div>
              </div>

              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 2.5 }}
                className="mb-10 w-full"
              >
                <ScratchCard text="Happy 21st birthday! 🎉 May your days shine with joy, your dreams take flight, and your heart stay fearless. This beautiful new chapter is yours—live it boldly, laugh endlessly, and glow always 💖✨" />
              </motion.div>

              <LifeInNumbers />

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-[250px] md:auto-rows-[280px]">
                {photos.map((src, index) => (
                  <Tilt 
                    key={index}
                    tiltMaxAngleX={15} 
                    tiltMaxAngleY={15} 
                    perspective={1000} 
                    transitionSpeed={1500} 
                    scale={1.05} 
                    glareEnable={true} 
                    glareMaxOpacity={0.3} 
                    glareColor="#d4af37" 
                    glarePosition="all"
                    className={`relative overflow-hidden rounded-2xl shadow-lg border border-luxury-gold/30 ${
                      index === 0 || index === 5 ? 'md:col-span-2 md:row-span-2' : ''
                    }`}
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="w-full h-full"
                    >
                      <img 
                        src={src} alt={`Memory ${index + 1}`} 
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).src = `https://via.placeholder.com/600x800/1e293b/d4af37?text=Memory+${index + 1}` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                        <span className="text-luxury-gold font-serif text-sm md:text-lg tracking-widest border-b border-luxury-gold pb-1">Memory {index + 1}</span>
                      </div>
                    </motion.div>
                  </Tilt>
                ))}
              </div>

              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="mt-24 md:mt-32 max-w-4xl mx-auto"
              >
                <div className="text-center mb-8 md:mb-10">
                  <h2 className="text-2xl sm:text-3xl md:text-5xl font-serif text-luxury-gold flex items-center justify-center gap-2 md:gap-3">
                    <Star className="text-rose-gold fill-rose-gold w-5 h-5 md:w-8 md:h-8" />
                    Leave a Wish
                    <Star className="text-rose-gold fill-rose-gold w-5 h-5 md:w-8 md:h-8" />
                  </h2>
                  <p className="text-gray-400 mt-2 md:mt-3 text-sm md:text-base">Add your message to the birthday guestbook!</p>
                </div>

                <form onSubmit={handleAddWish} className="bg-slate-800/50 backdrop-blur-md p-5 sm:p-6 md:p-8 rounded-3xl border border-luxury-gold/40 shadow-xl mb-12 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-luxury-gold/10 rounded-bl-full pointer-events-none"></div>
                  <div className="flex flex-col md:flex-row gap-4 mb-4 relative z-10">
                    <input 
                      type="text" 
                      placeholder="Your Name" 
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="flex-1 bg-slate-900/80 text-white border border-slate-700 rounded-xl px-4 py-3 md:py-4 focus:outline-none focus:border-luxury-gold transition-colors shadow-inner text-sm md:text-base"
                      required
                    />
                  </div>
                  <textarea 
                    placeholder="Write your beautiful birthday wish here..." 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    rows={4}
                    className="w-full bg-slate-900/80 text-white border border-slate-700 rounded-xl px-4 py-3 md:py-4 mb-4 focus:outline-none focus:border-luxury-gold transition-colors resize-none shadow-inner relative z-10 text-sm md:text-base"
                    required
                  />
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full md:w-auto px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-luxury-gold to-yellow-600 text-slate-900 font-bold rounded-xl flex items-center justify-center gap-2 hover:shadow-[0_0_25px_#d4af37] transition-shadow ml-auto relative z-10 uppercase tracking-widest text-xs md:text-sm"
                  >
                    <Send size={16} className="md:w-[18px] md:h-[18px]" />
                    Send Wish
                  </motion.button>
                </form>

                <div className="space-y-4 md:space-y-6">
                  <AnimatePresence>
                    {wishes.map((wish) => (
                      <motion.div 
                        key={wish.id}
                        initial={{ opacity: 0, x: -50, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ type: 'spring', stiffness: 100, damping: 15 }}
                        className="bg-slate-800/40 backdrop-blur-sm border-l-4 border-rose-gold p-5 md:p-6 rounded-r-2xl shadow-lg relative overflow-hidden group hover:bg-slate-800/70 transition-colors"
                      >
                        <div className="absolute top-0 right-0 w-16 h-16 md:w-24 md:h-24 bg-rose-gold/5 rounded-bl-full pointer-events-none group-hover:bg-rose-gold/15 transition-colors"></div>
                        <h3 className="text-lg md:text-xl font-serif text-luxury-gold mb-1 md:mb-2">{wish.name}</h3>
                        <p className="text-gray-300 leading-relaxed italic text-sm md:text-base">"{wish.message}"</p>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>

            {/* --- NEXTGEN INVITES FOOTER --- */}
            <footer className="relative z-20 w-full bg-slate-900/95 backdrop-blur-md mt-10 py-12 border-t border-luxury-gold/20 text-center shadow-[0_-10px_30px_rgba(0,0,0,0.8)]">
              <div className="max-w-7xl mx-auto px-4 flex flex-col items-center">
                
                <img src="/logo.png" alt="NextGen Invites Logo" className="w-12 h-12 rounded-full border border-luxury-gold/50 mb-6 shadow-[0_0_15px_rgba(212,175,55,0.3)] object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}/>
                
                <div className="flex gap-6 mb-8">
                  {/* Facebook Link & Proper Icon */}
                  <a href="https://www.facebook.com/profile.php?id=61570786974436" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-luxury-gold hover:bg-white/10 transition-all border border-white/10 hover:border-luxury-gold shadow-lg hover:shadow-[0_0_15px_rgba(212,175,55,0.4)]">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                  
                  {/* TikTok Link & Icon */}
                  <a href="https://www.tiktok.com/@nextgeninvites?_r=1&_t=ZS-95eB1FmYICK" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-luxury-gold hover:bg-white/10 transition-all border border-white/10 hover:border-luxury-gold shadow-lg hover:shadow-[0_0_15px_rgba(212,175,55,0.4)]">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.12-3.44-3.17-3.67-5.46-.22-2.14.49-4.33 1.97-5.91 1.35-1.47 3.32-2.39 5.36-2.47v4.06c-1.2.03-2.38.64-3.09 1.63-.5.71-.7 1.6-.57 2.47.16 1.05.86 1.96 1.77 2.42 1.25.63 2.87.53 3.98-.38.64-.54 1.05-1.33 1.13-2.17.03-1.63.01-3.26.02-4.89V.02z"/>
                    </svg>
                  </a>

                  {/* Instagram Link & Icon */}
                  <a href="https://www.instagram.com/tharushikahasini4?utm_source=qr&igsh=dXRoZ3o5Y2N2OWsy" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-luxury-gold hover:bg-white/10 transition-all border border-white/10 hover:border-luxury-gold shadow-lg hover:shadow-[0_0_15px_rgba(212,175,55,0.4)]">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                    </svg>
                  </a>
                </div>

                <h2 className="text-xl font-bold tracking-[0.2em] text-white mb-2 font-serif">NEXTGEN <span className="text-luxury-gold">INVITES</span></h2>
                <p className="text-gray-400 text-sm font-light leading-relaxed">
                  © {new Date().getFullYear()} NextGen Invites. All rights reserved. <br/>
                  <span className="italic text-gray-500 mt-1 block">Digital Solutions • Events • Celebrations</span>
                </p>
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}