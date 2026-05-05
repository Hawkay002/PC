import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Clock, ArrowRight, PenSquare } from 'lucide-react';

export default function Dashboard() {
  const [postcards, setPostcards] = useState([]);

  useEffect(() => {
    // Retrieve the auth-free dashboard data
    const saved = JSON.parse(localStorage.getItem('my_postcards') || '[]');
    // Sort newest first
    setPostcards(saved.sort((a, b) => new Date(b.date) - new Date(a.date)));
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6 lg:p-12 min-h-screen flex flex-col">
      <header className="flex items-center justify-between mb-12">
        <div>
          <h1 className="font-serif text-4xl font-bold text-ink">Your Outbox</h1>
          <p className="text-ink/60 mt-2 font-sans">Postcards saved locally on this device.</p>
        </div>
        <Link to="/" className="bg-ink text-white px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2 hover:bg-ink/90 transition-colors">
          <PenSquare className="w-4 h-4" />
          Draft New
        </Link>
      </header>

      {postcards.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center bg-white/50 rounded-2xl border border-ink/5 p-12 text-center">
          <Mail className="w-12 h-12 text-ink/20 mb-4" />
          <h2 className="font-serif text-2xl text-ink mb-2">It's quiet here</h2>
          <p className="text-ink/60 mb-6">You haven't sent any digital postcards yet.</p>
          <Link to="/" className="text-ink underline font-medium">Send your first card</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {postcards.map((card) => (
            <div key={card.id} className="bg-white p-5 rounded-xl border border-ink/5 shadow-sm flex items-center justify-between group hover:border-pastel-blue transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-pastel-pink/30 rounded-full flex items-center justify-center text-xl">
                  💌
                </div>
                <div>
                  <h3 className="font-semibold text-ink">To: {card.to}</h3>
                  <div className="flex items-center gap-1 text-xs text-ink/50 mt-1">
                    <Clock className="w-3 h-3" />
                    {new Date(card.date).toLocaleDateString()}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/card/${card.id}`);
                    alert('Link copied to clipboard!');
                  }}
                  className="text-sm font-semibold text-ink/60 hover:text-ink transition-colors px-3 py-1.5 bg-ink/5 rounded-md"
                >
                  Copy Link
                </button>
                <Link to={`/card/${card.id}`} className="w-10 h-10 flex items-center justify-center bg-pastel-blue/20 text-ink rounded-full group-hover:bg-pastel-blue group-hover:text-white transition-all">
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
