import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Clock, ArrowRight, PenSquare, Trash2, Copy, Check, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { deletePostcard } from '../lib/supabase'; 

export default function Dashboard() {
  const [postcards, setPostcards] = useState([]);
  const [copiedId, setCopiedId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(null); // Tracks which card is currently being deleted

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('my_postcards') || '[]');
    setPostcards(saved.sort((a, b) => new Date(b.date) - new Date(a.date)));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this postcard? This will permanently remove it from the database and break the shared link.")) return;
    
    setIsDeleting(id);
    try {
      // 1. Permanently delete from Supabase Database
      await deletePostcard(id);

      // 2. Remove from Local Storage & State
      const updated = postcards.filter(card => card.id !== id);
      setPostcards(updated);
      localStorage.setItem('my_postcards', JSON.stringify(updated));
    } catch (error) {
      console.error("Failed to delete from database:", error);
      alert("Could not delete the postcard. Please try again.");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleCopyLink = (id) => {
    navigator.clipboard.writeText(`${window.location.origin}/card/${id}`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Animation variants for the staggered grid
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 60, damping: 15 } }
  };

  return (
    <div className="bg-[#FDFBF7] min-h-[100dvh] p-6 lg:p-12 font-sans text-ink selection:bg-pastel-blue/30">
      <div className="max-w-7xl mx-auto">
        
        {/* --- HEADER --- */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-6 border-b border-ink/5 pb-8">
          <div>
            <h1 className="font-serif text-4xl lg:text-5xl font-bold text-ink tracking-tight">Your Outbox</h1>
            <p className="text-ink/60 mt-3 text-sm lg:text-base max-w-md">
              A collection of the digital memories and postcards you have sealed and sent into the world.
            </p>
          </div>
          <Link 
            to="/" 
            className="bg-ink text-white px-6 py-3.5 rounded-xl font-semibold flex items-center gap-2 hover:bg-ink/90 transition-all shadow-sm shrink-0 group"
          >
            <PenSquare className="w-5 h-5 group-hover:-rotate-12 transition-transform" />
            Draft New Card
          </Link>
        </header>

        {/* --- CONTENT --- */}
        {postcards.length === 0 ? (
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className="w-full max-w-2xl mx-auto bg-white/50 backdrop-blur-sm rounded-3xl border border-ink/5 p-12 text-center shadow-sm mt-12"
          >
            <div className="w-20 h-20 bg-pastel-blue/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail className="w-10 h-10 text-pastel-blue" />
            </div>
            <h2 className="font-serif text-3xl text-ink mb-3">It's quiet here</h2>
            <p className="text-ink/60 mb-8 max-w-sm mx-auto">
              Your outbox is empty. Craft a beautiful postcard, seal it with wax, and share a memory with someone special.
            </p>
            <Link to="/" className="inline-flex items-center gap-2 bg-pastel-blue/10 text-ink font-semibold px-6 py-3 rounded-lg hover:bg-pastel-blue/20 transition-colors">
              <Send className="w-4 h-4" /> Send your first card
            </Link>
          </motion.div>

        ) : (

          <motion.div 
            variants={containerVariants} 
            initial="hidden" 
            animate="show" 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {postcards.map((card) => (
              <motion.div 
                key={card.id} 
                variants={itemVariants}
                className="bg-white rounded-2xl p-6 border border-ink/5 shadow-sm group hover:shadow-md hover:border-pastel-blue/40 transition-all flex flex-col relative overflow-hidden"
              >
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pastel-blue/5 to-transparent rounded-bl-[100px] -z-10 transition-transform group-hover:scale-110" />

                <div className="flex items-start justify-between mb-6 z-10">
                  <div className="w-12 h-12 bg-pastel-pink/20 rounded-full flex items-center justify-center text-2xl shadow-inner">
                    💌
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-ink/40 bg-gray-50 px-3 py-1.5 rounded-full border border-ink/5">
                    <Clock className="w-3.5 h-3.5" />
                    {new Date(card.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>
                
                <div className="flex-1 z-10">
                  <p className="text-xs font-bold tracking-widest uppercase text-ink/40 mb-1">Delivered To</p>
                  <h3 className="font-serif text-2xl text-ink line-clamp-1">{card.to || 'Unknown Recipient'}</h3>
                </div>
                
                <div className="mt-8 pt-5 border-t border-ink/5 flex items-center justify-between z-10">
                  
                  {/* Delete Button */}
                  <button 
                    onClick={() => handleDelete(card.id)}
                    disabled={isDeleting === card.id}
                    className="w-10 h-10 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50"
                    title="Delete permanently"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-2">
                    {/* Copy Link Button */}
                    <button 
                      onClick={() => handleCopyLink(card.id)}
                      className="text-sm font-semibold text-ink/60 hover:text-ink transition-colors px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg flex items-center gap-1.5 border border-transparent hover:border-ink/10"
                    >
                      {copiedId === card.id ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                      {copiedId === card.id ? 'Copied' : 'Link'}
                    </button>

                    {/* View Live Card Button */}
                    <Link 
                      to={`/card/${card.id}`} 
                      className="w-10 h-10 flex items-center justify-center bg-pastel-blue/10 text-ink rounded-lg hover:bg-pastel-blue hover:text-white transition-all shadow-sm"
                      title="View live postcard"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
