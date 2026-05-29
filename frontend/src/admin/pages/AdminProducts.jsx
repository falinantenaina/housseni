import {
  Eye,
  LoaderCircle,
  Pencil,
  Plus,
  Search,
  Star,
  Tag,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createAdminProduct,
  deleteAdminProduct,
  fetchAdminCategories,
  fetchAdminProducts,
  toggleAdminFeatured,
  toggleAdminSale,
  toggleCreateModal,
  toggleUpdateModal,
  toggleViewModal,
  updateAdminProduct,
} from "../../store/slices/adminSlice";
import AdminHeader from "../components/AdminHeader";
import AdminLayout from "../components/AdminLayout";

//  Create Modal
const CreateModal = ({ categories }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((s) => s.admin);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category_id: "",
    stock: "",
    featured: false,
    on_sale: false,
    images: [],
  });

  const [imagePreviews, setImagePreviews] = useState([]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setForm({ ...form, images: files });
    setImagePreviews(files.map((file) => URL.createObjectURL(file)));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.price) return;

    const data = new FormData();
    data.append("name", form.name);
    data.append("description", form.description || "");
    data.append("price", form.price);
    data.append("stock", form.stock);
    data.append("featured", form.featured);
    data.append("on_sale", form.on_sale);
    if (form.category_id) data.append("category_id", form.category_id);

    form.images.forEach((file) => data.append("images", file));

    dispatch(createAdminProduct(data));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="font-bold text-xl">Nouveau Produit</h2>
          <button
            onClick={() => dispatch(toggleCreateModal())}
            className="p-2 hover:bg-secondary rounded-xl"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Nom *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input-base w-full"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">
                Catégorie
              </label>
              <select
                value={form.category_id}
                onChange={(e) =>
                  setForm({ ...form, category_id: e.target.value })
                }
                className="input-base w-full"
              >
                <option value="">Sans catégorie</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">
                Prix (€) *
              </label>
              <input
                type="number"
                step="any"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="input-base w-full"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Stock</label>
              <input
                type="number"
                step="any"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                className="input-base w-full"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">
              Description
            </label>
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="input-base w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">
              Images du produit
            </label>
            <div className="border-2 border-dashed border-border rounded-2xl p-8 text-center hover:border-primary/50 transition-colors">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="product-images"
              />
              <label htmlFor="product-images" className="cursor-pointer block">
                <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                <p className="font-medium text-foreground">
                  Cliquez pour ajouter des images
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  PNG, JPG, WEBP - Plusieurs fichiers autorisés
                </p>
              </label>
            </div>

            {imagePreviews.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-4">
                {imagePreviews.map((src, i) => (
                  <div key={i} className="relative">
                    <img
                      src={src}
                      alt="preview"
                      className="h-24 w-24 object-cover rounded-xl border border-border"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              type="button"
              onClick={() => setForm({ ...form, featured: !form.featured })}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
                form.featured
                  ? "bg-yellow-500/10 border-yellow-500 text-yellow-600"
                  : "border-border hover:bg-yellow-500/5"
              }`}
            >
              <Star
                className={`w-4 h-4 ${form.featured ? "fill-yellow-500" : ""}`}
              />
              {form.featured ? "Produit mis en avant" : "Mettre en avant"}
            </button>

            <button
              type="button"
              onClick={() => setForm({ ...form, on_sale: !form.on_sale })}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
                form.on_sale
                  ? "bg-red-500/10 border-red-500 text-red-600"
                  : "border-border hover:bg-red-500/5"
              }`}
            >
              <Tag className="w-4 h-4" />
              {form.on_sale ? "En promotion" : "Mettre en promo"}
            </button>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => dispatch(toggleCreateModal())}
              className="btn-secondary flex-1 py-3"
            >
              ANNULER
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1 py-3 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <LoaderCircle className="w-5 h-5 animate-spin" />
                  Création en cours...
                </>
              ) : (
                "CRÉER LE PRODUIT"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

//  Update Modal
const UpdateModal = ({ product, categories }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((s) => s.admin);

  const [form, setForm] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || "",
    category_id: product?.category_id || product?.category?.id || "",
    stock: product?.stock ?? "",
    featured: product?.featured ?? false,
    on_sale: product?.on_sale ?? false,
  });

  const [imagePreviews, setImagePreviews] = useState(
    product?.images?.map((img) => img?.url || img) || [],
  );

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
    setForm({ ...form, newImages: files });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", form.name);
    data.append("description", form.description || "");
    data.append("price", form.price);
    data.append("stock", form.stock || 0);
    data.append("featured", form.featured);
    data.append("on_sale", form.on_sale);
    if (form.category_id) data.append("category_id", form.category_id);

    if (form.newImages?.length > 0) {
      form.newImages.forEach((file) => data.append("images", file));
    }

    dispatch(updateAdminProduct({ id: product.id, data }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="font-bold text-xl">Modifier le Produit</h2>
          <button
            onClick={() => dispatch(toggleUpdateModal(null))}
            className="p-2 hover:bg-secondary rounded-xl"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Nom</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input-base w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">
                Catégorie
              </label>
              <select
                value={form.category_id}
                onChange={(e) =>
                  setForm({ ...form, category_id: e.target.value })
                }
                className="input-base w-full"
              >
                <option value="">Sans catégorie</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">
                Prix (€)
              </label>
              <input
                type="number"
                step="any"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="input-base w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Stock</label>
              <input
                type="number"
                step="any"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                className="input-base w-full"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">
              Description
            </label>
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="input-base w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">
              Nouvelles Images
            </label>
            <div className="border-2 border-dashed border-border rounded-2xl p-8 text-center hover:border-primary/50 transition-colors">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="update-product-images"
              />
              <label
                htmlFor="update-product-images"
                className="cursor-pointer block"
              >
                <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                <p className="font-medium">Ajouter de nouvelles images</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Les anciennes images seront remplacées
                </p>
              </label>
            </div>

            {imagePreviews.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-4">
                {imagePreviews.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt="preview"
                    className="h-24 w-24 object-cover rounded-xl border border-border"
                  />
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              type="button"
              onClick={() => setForm({ ...form, featured: !form.featured })}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
                form.featured
                  ? "bg-yellow-500/10 border-yellow-500 text-yellow-600"
                  : "border-border hover:bg-yellow-500/5"
              }`}
            >
              <Star
                className={`w-4 h-4 ${form.featured ? "fill-yellow-500" : ""}`}
              />
              {form.featured ? "Produit mis en avant" : "Mettre en avant"}
            </button>

            <button
              type="button"
              onClick={() => setForm({ ...form, on_sale: !form.on_sale })}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
                form.on_sale
                  ? "bg-red-500/10 border-red-500 text-red-600"
                  : "border-border hover:bg-red-500/5"
              }`}
            >
              <Tag className="w-4 h-4" />
              {form.on_sale ? "En promotion" : "Mettre en promo"}
            </button>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => dispatch(toggleUpdateModal(null))}
              className="btn-secondary flex-1 py-3"
            >
              ANNULER
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1 py-3 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <LoaderCircle className="w-5 h-5 animate-spin" />
                  Mise à jour...
                </>
              ) : (
                "METTRE À JOUR"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

//  View Modal
const ViewModal = ({ product }) => {
  const dispatch = useDispatch();
  const [activeImg, setActiveImg] = useState(0);
  const images = product?.images || [];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="font-bold text-xl truncate">{product?.name}</h2>
          <button
            onClick={() => dispatch(toggleViewModal(null))}
            className="p-2 hover:bg-secondary rounded-xl"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="aspect-square bg-secondary rounded-2xl overflow-hidden border border-border mb-4 flex items-center justify-center">
              {images[activeImg] && (
                <img
                  src={images[activeImg]?.url || images[activeImg]}
                  alt={product.name}
                  className="max-h-full max-w-full object-contain p-4"
                />
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 ${
                      i === activeImg ? "border-primary" : "border-border"
                    }`}
                  >
                    <img
                      src={img?.url || img}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4">
            {[
              ["Prix", `${(product?.price || 0).toLocaleString("fr-MG")} €`],
              ["Stock", product?.stock ?? "—"],
              ["Catégorie", product?.category?.name || "—"],
              ["Mis en avant", product?.featured ? "⭐ Oui" : "Non"],
              ["En promotion", product?.on_sale ? "🏷️ Oui" : "Non"],
            ].map(([label, value]) => (
              <div
                key={label}
                className="flex justify-between py-2 border-b border-border"
              >
                <span className="text-muted-foreground">{label}</span>
                <span className="font-semibold">{value}</span>
              </div>
            ))}
            {product?.description && (
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
                  Description
                </p>
                <p className="text-foreground leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

//  Main Page
const AdminProducts = () => {
  const dispatch = useDispatch();
  const {
    products,
    loading,
    totalProducts,
    categories,
    isCreateModalOpen,
    isUpdateModalOpen,
    isViewModalOpen,
    selectedProduct,
  } = useSelector((s) => s.admin);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [featuredFilter, setFeaturedFilter] = useState("");
  const [page, setPage] = useState(1);
  const limit = 20;

  useEffect(() => {
    dispatch(fetchAdminCategories());
  }, [dispatch]);

  useEffect(() => {
    const params = {
      page,
      limit,
      ...(search && { search }),
      ...(categoryFilter && { category_id: categoryFilter }),
      ...(featuredFilter && { featured: featuredFilter }),
    };
    dispatch(fetchAdminProducts(params));
  }, [dispatch, page, search, categoryFilter, featuredFilter]);

  const handleDelete = (id, name) => {
    if (window.confirm(`Supprimer le produit "${name}" ?`)) {
      dispatch(deleteAdminProduct(id));
    }
  };

  const totalPages = Math.ceil(totalProducts / limit);

  return (
    <AdminLayout>
      <AdminHeader title="Produits" />

      <main className="flex-1 p-6">
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="input-base w-full pl-9"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setPage(1);
            }}
            className="input-base"
          >
            <option value="">Toutes les catégories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={featuredFilter}
            onChange={(e) => {
              setFeaturedFilter(e.target.value);
              setPage(1);
            }}
            className="input-base"
          >
            <option value="">Tous les produits</option>
            <option value="true">⭐ Mis en avant</option>
          </select>

          <button
            onClick={() => dispatch(toggleCreateModal())}
            className="btn-primary flex items-center gap-2 shrink-0"
          >
            <Plus className="w-4 h-4" /> NOUVEAU PRODUIT
          </button>
        </div>

        {/* Table */}
        <div className="card-base overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <LoaderCircle className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              Aucun produit trouvé
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-secondary/50">
                  <tr>
                    <th className="text-left px-4 py-3">Produit</th>
                    <th className="text-left px-4 py-3">Catégorie</th>
                    <th className="text-left px-4 py-3">Prix</th>
                    <th className="text-left px-4 py-3">Stock</th>
                    <th className="text-left px-4 py-3">En Avant</th>
                    <th className="text-left px-4 py-3">Promo</th>
                    <th className="text-left px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => {
                    const imgUrl = p.images?.[0]?.url || p.images?.[0];
                    return (
                      <tr
                        key={p.id}
                        className="border-t border-border hover:bg-secondary/30"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded border overflow-hidden bg-secondary">
                              {imgUrl && (
                                <img
                                  src={imgUrl}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                              )}
                            </div>
                            <span className="font-medium truncate max-w-[200px]">
                              {p.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="badge-outline text-xs">
                            {p.category?.name || "—"}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-bold text-primary">
                          {(p.price || 0).toLocaleString("fr-MG")} €
                        </td>
                        <td className="px-4 py-3 ">{p.stock || "-"}</td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => dispatch(toggleAdminFeatured(p.id))}
                            className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-colors ${
                              p.featured
                                ? "bg-yellow-500/10 text-yellow-600"
                                : "text-muted-foreground hover:text-yellow-500"
                            }`}
                          >
                            <Star
                              className={`w-4 h-4 ${p.featured ? "fill-yellow-500" : ""}`}
                            />
                            {p.featured ? "Oui" : "Non"}
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => dispatch(toggleAdminSale(p.id))}
                            className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-colors ${
                              p.on_sale
                                ? "bg-red-500/10 text-red-600"
                                : "text-muted-foreground hover:text-red-500"
                            }`}
                          >
                            <Tag className="w-4 h-4" />
                            {p.on_sale ? "Oui" : "Non"}
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            <button
                              onClick={() => dispatch(toggleViewModal(p))}
                              className="p-2 hover:bg-secondary rounded"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => dispatch(toggleUpdateModal(p))}
                              className="p-2 hover:bg-secondary rounded"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(p.id, p.name)}
                              className="p-2 hover:bg-destructive/10 text-destructive rounded"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="btn-secondary px-4 py-2 text-sm disabled:opacity-40"
            >
              Précédent
            </button>
            <span className="px-4 py-2 text-sm text-muted-foreground">
              {page} / {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="btn-secondary px-4 py-2 text-sm disabled:opacity-40"
            >
              Suivant
            </button>
          </div>
        )}
      </main>

      {isCreateModalOpen && <CreateModal categories={categories} />}
      {isUpdateModalOpen && selectedProduct && (
        <UpdateModal product={selectedProduct} categories={categories} />
      )}
      {isViewModalOpen && selectedProduct && (
        <ViewModal product={selectedProduct} />
      )}
    </AdminLayout>
  );
};

export default AdminProducts;
