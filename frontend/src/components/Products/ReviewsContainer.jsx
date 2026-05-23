import { MessageSquare, Send, Star, Trash2 } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { openAuthPopup } from "../../store/slices/popupSlice";
import { deleteReview, postReview } from "../../store/slices/productSlice";

const ReviewsContainer = ({ product, productReviews }) => {
  const dispatch = useDispatch();
  const { authUser } = useSelector((state) => state.auth);
  const { isPostingReview, isReviewDeleting } = useSelector(
    (state) => state.product,
  );
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!authUser) {
      dispatch(openAuthPopup());
      return;
    }
    dispatch(postReview({ id: product.id, data: { rating, comment } })).then(
      () => {
        setComment("");
        setRating(5);
        setShowForm(false);
      },
    );
  };

  const avgRating = productReviews.length
    ? productReviews.reduce((a, r) => a + r.rating, 0) / productReviews.length
    : 0;

  return (
    <div>
      {/* Summary */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="section-label">Témoignages</span>
          <h2 className="section-title">AVIS CLIENTS</h2>
          <span className="accent-line" />
        </div>
        {productReviews.length > 0 && (
          <div className="text-right">
            <div className="flex items-center gap-2 justify-end mb-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`w-4 h-4 ${s <= Math.round(avgRating) ? "text-yellow-400 fill-yellow-400" : "text-border"}`}
                />
              ))}
            </div>
            <p className="font-ui font-bold text-foreground text-lg">
              {avgRating.toFixed(1)}/5
            </p>
            <p className="text-muted-foreground text-sm">
              {productReviews.length} avis
            </p>
          </div>
        )}
      </div>

      {/* Write review button */}
      <div className="mb-6">
        <button
          onClick={() => {
            if (!authUser) dispatch(openAuthPopup());
            else setShowForm(!showForm);
          }}
          className="btn-outline flex items-center gap-2"
        >
          <MessageSquare className="w-4 h-4" />
          {showForm ? "Annuler" : "Écrire un avis"}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="card-base p-5 mb-6 animate-fade-up">
          <h3 className="font-ui font-bold text-foreground tracking-wide mb-4">
            VOTRE AVIS
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Star rating */}
            <div>
              <label className="font-ui text-xs text-muted-foreground tracking-widest uppercase block mb-2">
                Note
              </label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setRating(s)}
                    onMouseEnter={() => setHover(s)}
                    onMouseLeave={() => setHover(0)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-6 h-6 ${s <= (hover || rating) ? "text-yellow-400 fill-yellow-400" : "text-border"}`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="font-ui text-xs text-muted-foreground tracking-widest uppercase block mb-2">
                Commentaire
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                placeholder="Partagez votre expérience avec ce produit..."
                className="input-base w-full resize-none"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isPostingReview}
              className="btn-primary flex items-center gap-2 disabled:opacity-60"
            >
              {isPostingReview ? (
                "Publication..."
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  PUBLIER
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* Reviews list */}
      {productReviews.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">
          <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-20" />
          <p className="font-ui">Aucun avis pour ce produit.</p>
          <p className="text-sm mt-1">Soyez le premier à donner votre avis !</p>
        </div>
      ) : (
        <div className="space-y-4">
          {productReviews.map((review) => (
            <div key={review.id} className="card-base p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="font-ui font-bold text-primary text-sm">
                      {review.name?.[0]?.toUpperCase() || "?"}
                    </span>
                  </div>
                  <div>
                    <p className="font-ui font-semibold text-foreground text-sm tracking-wide">
                      {review.name}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3 h-3 ${s <= review.rating ? "text-yellow-400 fill-yellow-400" : "text-border"}`}
                          />
                        ))}
                      </div>
                      <span className="text-muted-foreground text-xs">
                        {new Date(review.createdAt).toLocaleDateString("fr-FR")}
                      </span>
                    </div>
                  </div>
                </div>
                {authUser &&
                  (authUser.id === review.user ||
                    authUser.role === "admin") && (
                    <button
                      onClick={() =>
                        dispatch(
                          deleteReview({
                            productId: product.id,
                            reviewId: review.id,
                          }),
                        )
                      }
                      disabled={isReviewDeleting}
                      className="p-1.5 text-muted-foreground hover:text-destructive transition-colors disabled:opacity-40"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
              </div>
              <p className="text-foreground text-sm mt-3 leading-relaxed">
                {review.comment}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewsContainer;
