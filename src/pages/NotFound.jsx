import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-paper bg-paper-texture">
      <div className="w-20 h-20 bg-pastel-pink/30 rounded-full flex items-center justify-center text-4xl mb-6 shadow-sm border border-ink/5">
        📭
      </div>
      <h1 className="font-serif text-4xl text-ink font-bold mb-4">
        Lost in the mail
      </h1>
      <p className="text-ink/60 mb-8 max-w-md font-sans">
        We couldn't find the postcard you're looking for. The link might be broken, or it may have been returned to the sender.
      </p>
      <Link 
        to="/" 
        className="bg-ink text-white px-8 py-3 rounded-lg font-semibold hover:bg-ink/90 transition-colors shadow-sm"
      >
        Return to Dashboard
      </Link>
    </div>
  );
}
