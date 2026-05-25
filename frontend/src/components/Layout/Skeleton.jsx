const Shimmer = ({ className }) => (
  <div className={`animate-pulse bg-secondary rounded-xl ${className}`} />
);

//  Skeleton carte produit
const ProductCardSkeleton = () => (
  <div className="card-base rounded-2xl overflow-hidden flex flex-col">
    <Shimmer className="aspect-square w-full rounded-none" />
    <div className="p-4 flex flex-col gap-3 flex-1">
      <Shimmer className="h-4 w-3/4" />
      <Shimmer className="h-4 w-1/2" />
      <div className="flex items-center justify-between mt-auto pt-2 border-t border-border">
        <Shimmer className="h-6 w-20" />
        <Shimmer className="h-9 w-9 rounded-xl" />
      </div>
    </div>
  </div>
);

//  Skeleton grille de produits
export const ProductGridSkeleton = () => (
  <section className="py-10">
    <div className="flex items-end justify-between mb-6">
      <div className="flex flex-col gap-2">
        <Shimmer className="h-3 w-16" />
        <Shimmer className="h-8 w-48" />
      </div>
      <Shimmer className="h-5 w-16 hidden sm:block" />
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  </section>
);

//  Skeleton strip catégories
export const CategoryStripSkeleton = () => (
  <section className="py-6 border-y border-border bg-secondary/30">
    <Shimmer className="h-3 w-24 mb-4" />
    <div className="flex gap-3 overflow-hidden pb-1">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="shrink-0 flex flex-col items-center gap-2">
          <Shimmer className="w-16 h-16 rounded-2xl" />
          <Shimmer className="h-3 w-14" />
        </div>
      ))}
    </div>
  </section>
);
