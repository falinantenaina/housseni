import { Link } from "react-router-dom";
import { Home, ArrowLeft, Wrench } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center">
        <div className="mb-6">
          <div className="font-display text-primary text-[10rem] leading-none opacity-20 select-none">404</div>
          <div className="relative -mt-8">
            <Wrench className="w-14 h-14 text-primary mx-auto mb-4" />
          </div>
        </div>
        <h2 className="font-ui font-bold text-foreground text-3xl tracking-widest mb-3">PAGE INTROUVABLE</h2>
        <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
          Cette page n'existe pas ou a été déplacée.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/" className="btn-primary flex items-center justify-center gap-2">
            <Home className="w-4 h-4" /> ACCUEIL
          </Link>
          <button onClick={() => window.history.back()} className="btn-secondary flex items-center justify-center gap-2">
            <ArrowLeft className="w-4 h-4" /> RETOUR
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
