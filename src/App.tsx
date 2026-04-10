import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Music, VolumeX, Send, Sparkles, Heart } from 'lucide-react';

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

// --- Scratch Card Component ---
const ScratchCard = ({ text }: { text: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScratched, setIsScratched] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#d4af37');
    gradient.addColorStop(1, '#8b6508');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('✨ Scratch Here to Reveal ✨', canvas.width / 2, canvas.height / 2);

    let isDrawing = false;

    const getMousePos = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      return { x: clientX - rect.left, y: clientY - rect.top };
    };

    const scratch = (e: MouseEvent | TouchEvent) => {
      if (!isDrawing) return;
      e.preventDefault();
      const pos = getMousePos(e);
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 25, 0, 2 * Math.PI);
      ctx.fill();
      checkScratch();
    };

    const checkScratch = () => {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let clearPixels = 0;
      for (let i = 3; i < imgData.length; i += 4) {
        if (imgData[i] === 0) clearPixels++;
      }
      if ((clearPixels / (imgData.length / 4)) > 0.4) {
        setIsScratched(true);
      }
    };

    const start = (e: MouseEvent | TouchEvent) => { isDrawing = true; scratch(e); };
    const stop = () => { isDrawing = false; };

    canvas.addEventListener('mousedown', start);
    canvas.addEventListener('mousemove', scratch);
    window.addEventListener('mouseup', stop);
    canvas.addEventListener('touchstart', start);
    canvas.addEventListener('touchmove', scratch, { passive: false });
    window.addEventListener('touchend', stop);

    return () => {
      window.removeEventListener('mouseup', stop);
      window.removeEventListener('touchend', stop);
    };
  }, []);

  return (
    <div className="relative w-full max-w-2xl mx-auto h-64 md:h-72 rounded-2xl overflow-hidden shadow-2xl border-2 border-luxury-gold mt-12">
      <div className="absolute inset-0 bg-slate-800/90 flex items-center justify-center p-8 text-center backdrop-blur-sm">
        <motion.p 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: isScratched ? 1 : 0.8, opacity: isScratched ? 1 : 0 }}
          transition={{ duration: 0.8 }}
          className="text-xl md:text-3xl text-luxury-gold font-serif leading-relaxed"
        >
          {text}
        </motion.p>
      </div>
      <canvas
        ref={canvasRef}
        style={{ touchAction: 'none' }}
        className={`absolute inset-0 w-full h-full cursor-crosshair transition-opacity duration-1000 ${isScratched ? 'opacity-0 pointer-events-none' : ''}`}
      />
    </div>
  );
};

// --- Floating Particles Background ---
const BackgroundParticles = () => (
  <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
    {[...Array(20)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-1.5 h-1.5 bg-luxury-gold rounded-full opacity-30 shadow-[0_0_8px_#d4af37]"
        animate={{
          y: ['100vh', '-10vh'],
          x: [Math.random() * 100 - 50, Math.random() * 100 - 50],
          opacity: [0, 0.6, 0]
        }}
        transition={{
          duration: Math.random() * 10 + 10,
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

  const titleText = "Happy 21st Birthday!".split("");

  // Music Toggle function
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
    
    // Play music automatically when the card is opened
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

    setTimeout(() => setStep(2), 3500);
  };

  const handleAddWish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newMessage.trim()) return;

    const newWish: Wish = { id: Date.now(), name: newName, message: newMessage };
    setWishes([newWish, ...wishes]);
    setNewName('');
    setNewMessage('');
    
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.9 }, colors: ['#b76e79', '#d4af37'] });
  };

  return (
    <div className="min-h-screen bg-luxury-dark font-sans flex flex-col items-center justify-center relative">
      <BackgroundParticles />
      
      {/* Hidden Audio Element */}
      <audio ref={audioRef} src="/music.mp3" loop />

      {/* Music Toggle Button */}
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
          // --- ADVANCED LUXURY ENVELOPE / INVITATION ---
          <motion.div
            key="card-container"
            exit={{ opacity: 0, scale: 1.2, filter: 'blur(10px)' }}
            transition={{ duration: 1 }}
            className="relative w-[320px] md:w-[400px] h-[450px] cursor-pointer group"
            style={{ perspective: 2000 }}
            onClick={handleOpenCard}
          >
            {/* Glowing Aura Behind Card */}
            <div className="absolute inset-0 bg-luxury-gold/20 blur-[50px] rounded-full group-hover:bg-luxury-gold/40 transition-colors duration-700"></div>

            {/* Inside Content (Visible when flaps open) */}
            <div className="absolute inset-2 bg-gradient-to-b from-slate-900 to-black border-2 border-luxury-gold rounded-xl shadow-2xl flex flex-col items-center justify-center z-0 overflow-hidden">
              <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
              <motion.div 
                animate={step === 1 ? { scale: [0.8, 1.2, 1], opacity: [0, 1] } : { opacity: 0 }}
                transition={{ duration: 1, delay: 0.8 }}
                className="text-center z-10"
              >
                <Heart className="w-12 h-12 text-rose-gold mx-auto mb-4" fill="#b76e79" />
                <h2 className="text-3xl text-luxury-gold font-serif tracking-widest uppercase">For You</h2>
              </motion.div>
            </div>

            {/* Left Flap */}
            <motion.div
              initial={{ rotateY: 0 }}
              animate={{ rotateY: step === 1 ? -140 : 0 }}
              transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
              style={{ transformOrigin: "left" }}
              className="absolute top-0 left-0 w-1/2 h-full z-10 shadow-[5px_0_20px_rgba(0,0,0,0.7)] rounded-l-xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-slate-800 to-slate-700 border-y border-l border-luxury-gold"></div>
              {/* Inner Gold Pattern */}
              <div className="absolute top-4 bottom-4 left-4 right-0 border-y border-l border-luxury-gold/30"></div>
            </motion.div>

            {/* Right Flap */}
            <motion.div
              initial={{ rotateY: 0 }}
              animate={{ rotateY: step === 1 ? 140 : 0 }}
              transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
              style={{ transformOrigin: "right" }}
              className="absolute top-0 right-0 w-1/2 h-full z-10 shadow-[-5px_0_20px_rgba(0,0,0,0.7)] rounded-r-xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-l from-slate-800 to-slate-700 border-y border-r border-luxury-gold"></div>
              {/* Inner Gold Pattern */}
              <div className="absolute top-4 bottom-4 right-4 left-0 border-y border-r border-luxury-gold/30"></div>
            </motion.div>

            {/* Middle Wax Seal */}
            <motion.div
              animate={step === 1 ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
            >
              <div className="relative w-20 h-20 bg-gradient-to-br from-yellow-500 via-luxury-gold to-yellow-700 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.6)] group-hover:shadow-[0_0_30px_rgba(212,175,55,1)] transition-shadow duration-500 border-2 border-yellow-300">
                <div className="w-16 h-16 rounded-full border border-yellow-800/30 flex items-center justify-center">
                  <span className="font-serif text-2xl text-yellow-900 font-bold">21</span>
                </div>
              </div>
            </motion.div>

            {/* Tap to open text */}
            {step === 0 && (
              <motion.div 
                animate={{ y: [0, -10, 0] }} 
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute -bottom-16 w-full text-center text-luxury-gold tracking-[0.2em] uppercase z-20 font-bold text-sm md:text-base flex justify-center items-center gap-2"
              >
                <Sparkles size={16} /> Tap to Unlock <Sparkles size={16} />
              </motion.div>
            )}
          </motion.div>
        ) : (
          // --- Main Site Section ---
          <motion.div
            key="main-site"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="w-full max-w-6xl mx-auto px-6 py-16 z-10"
          >
            {/* Animated Title */}
            <div className="text-center mb-16 relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] md:w-[60%] h-[150%] bg-luxury-gold/20 blur-[80px] rounded-full z-0 pointer-events-none"
              />
              
              <h1 className="relative z-10 text-5xl md:text-7xl lg:text-8xl font-serif mb-2 flex flex-wrap justify-center font-bold" style={{ perspective: "1000px" }}>
                {titleText.map((char, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, y: 60, rotateX: -90, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)' }}
                    transition={{ duration: 0.8, delay: index * 0.08, type: 'spring', damping: 12, stiffness: 100 }}
                    whileHover={{ scale: 1.2, filter: "brightness(1.5) drop-shadow(0px 0px 15px rgba(212,175,55,0.8))" }}
                    className={`${char === " " ? "w-4 md:w-8" : ""} bg-gradient-to-br from-white via-luxury-gold to-rose-gold text-transparent bg-clip-text cursor-default`}
                    style={{ display: "inline-block", paddingBottom: "10px" }}
                  >
                    {char}
                  </motion.span>
                ))}
              </h1>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2, duration: 1 }}
                className="relative z-10 flex items-center justify-center gap-3 text-luxury-gold tracking-[0.3em] uppercase text-xs md:text-sm font-semibold mt-4"
              >
                <Sparkles size={16} className="text-rose-gold" />
                <span>Welcome to your golden era</span>
                <Sparkles size={16} className="text-rose-gold" />
              </motion.div>
            </div>

            {/* Scratch Card */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 2.5 }}
              className="mb-20"
            >
              <ScratchCard text="Happy 21st birthday! 🎉 May your days shine with joy, your dreams take flight, and your heart stay fearless. This beautiful new chapter is yours—live it boldly, laugh endlessly, and glow always 💖✨" />
            </motion.div>

            {/* Photo Gallery Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[280px]">
              {photos.map((src, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, zIndex: 10 }}
                  className={`relative overflow-hidden rounded-2xl shadow-lg border border-luxury-gold/30 ${
                    index === 0 || index === 5 ? 'md:col-span-2 md:row-span-2' : ''
                  }`}
                >
                  <img 
                    src={src} alt={`Memory ${index + 1}`} 
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                    onError={(e) => { (e.target as HTMLImageElement).src = `https://via.placeholder.com/600x800/1e293b/d4af37?text=Memory+${index + 1}` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                    <span className="text-luxury-gold font-serif text-lg tracking-widest border-b border-luxury-gold pb-1">Memory {index + 1}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Wish Form & Guestbook */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="mt-32 max-w-4xl mx-auto"
            >
              <div className="text-center mb-10">
                <h2 className="text-3xl md:text-5xl font-serif text-luxury-gold flex items-center justify-center gap-3">
                  <Sparkles className="text-rose-gold" />
                  Leave a Wish
                  <Sparkles className="text-rose-gold" />
                </h2>
                <p className="text-gray-400 mt-3">Add your message to the birthday guestbook!</p>
              </div>

              <form onSubmit={handleAddWish} className="bg-slate-800/50 backdrop-blur-md p-6 md:p-8 rounded-2xl border border-luxury-gold/40 shadow-xl mb-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-luxury-gold/10 rounded-bl-full pointer-events-none"></div>
                <div className="flex flex-col md:flex-row gap-4 mb-4 relative z-10">
                  <input 
                    type="text" 
                    placeholder="Your Name" 
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="flex-1 bg-slate-900/80 text-white border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:border-luxury-gold transition-colors shadow-inner"
                    required
                  />
                </div>
                <textarea 
                  placeholder="Write your beautiful birthday wish here..." 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  rows={4}
                  className="w-full bg-slate-900/80 text-white border border-slate-700 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:border-luxury-gold transition-colors resize-none shadow-inner relative z-10"
                  required
                />
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-luxury-gold to-yellow-600 text-slate-900 font-bold rounded-lg flex items-center justify-center gap-2 hover:shadow-[0_0_20px_#d4af37] transition-shadow ml-auto relative z-10"
                >
                  <Send size={18} />
                  Send Wish
                </motion.button>
              </form>

              <div className="space-y-6">
                <AnimatePresence>
                  {wishes.map((wish) => (
                    <motion.div 
                      key={wish.id}
                      initial={{ opacity: 0, x: -50, scale: 0.9 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ type: 'spring', stiffness: 100, damping: 15 }}
                      className="bg-slate-800/40 backdrop-blur-sm border-l-4 border-rose-gold p-6 rounded-r-2xl shadow-lg relative overflow-hidden group hover:bg-slate-800/60 transition-colors"
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-rose-gold/5 rounded-bl-full pointer-events-none group-hover:bg-rose-gold/10 transition-colors"></div>
                      <h3 className="text-xl font-serif text-luxury-gold mb-2">{wish.name}</h3>
                      <p className="text-gray-300 leading-relaxed italic">"{wish.message}"</p>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>

            <div className="mt-24 text-center text-sm text-gray-500 uppercase tracking-widest pb-10">
              Made with ❤️ for your special day
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}