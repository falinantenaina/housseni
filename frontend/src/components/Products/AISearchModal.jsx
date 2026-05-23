import { Loader, Search, Sparkles, X } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeAIModal } from "../../store/slices/popupSlice";
import { aiSearch } from "../../store/slices/productSlice";

const AISearchModal = () => {
  const dispatch = useDispatch();
  const { isAIPopupOpen } = useSelector((state) => state.popup);
  const { aiSearching } = useSelector((state) => state.product);
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    dispatch(aiSearch(query)).then(() => {
      dispatch(closeAIModal());
    });
  };

  const suggestions = [
    "Je cherche des outils pour percer du béton",
    "Produits pour installation plomberie salle de bain",
    "Peinture extérieure résistante aux intempéries",
    "Visserie inox pour construction métallique",
  ];

  if (!isAIPopupOpen) return null;

  return (
    <>
      <div className="overlay" onClick={() => dispatch(closeAIModal())} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-card border border-border rounded-md w-full max-w-lg animate-fade-up">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-border">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-primary/10 rounded-md flex items-center justify-center">
                <Sparkles className="w-4.5 h-4.5 text-primary" />
              </div>
              <div>
                <h2 className="font-ui font-bold text-foreground tracking-wide">
                  RECHERCHE INTELLIGENTE
                </h2>
                <p className="text-xs text-muted-foreground">
                  Décrivez ce que vous cherchez
                </p>
              </div>
            </div>
            <button
              onClick={() => dispatch(closeAIModal())}
              className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <div className="p-5">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="relative">
                <textarea
                  placeholder="Ex: Je cherche une perceuse pour bricolage à domicile..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  rows={3}
                  className="input-base w-full resize-none pt-3"
                  autoFocus
                />
              </div>

              <button
                type="submit"
                disabled={aiSearching || !query.trim()}
                className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {aiSearching ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Recherche en cours...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    RECHERCHER
                  </>
                )}
              </button>
            </form>

            <div className="mt-5">
              <p className="font-ui text-xs text-muted-foreground tracking-widest uppercase mb-3">
                Suggestions
              </p>
              <div className="space-y-2">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => setQuery(s)}
                    className="w-full text-left px-3 py-2 rounded-md bg-secondary hover:bg-primary/10 hover:text-primary text-sm text-muted-foreground transition-colors font-body"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AISearchModal;
