import {
  LoaderCircle,
  Pencil,
  Plus,
  Search,
  Tag,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  closeCategoryModal,
  createAdminCategory,
  deleteAdminCategory,
  fetchAdminCategories,
  toggleCategoryModal,
  toggleUpdateCategoryModal,
  updateAdminCategory,
} from "../../store/slices/adminSlice";
import AdminHeader from "../components/AdminHeader";
import AdminLayout from "../components/AdminLayout";

// ── Create Category Modal ─────────────────────────────────────────────────────
const CreateCategoryModal = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((s) => s.admin);

  const [form, setForm] = useState({
    name: "",
    description: "",
    imageFile: null,
    imagePreview: null,
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({
        ...form,
        imageFile: file,
        imagePreview: URL.createObjectURL(file),
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    const formData = new FormData();
    formData.append("name", form.name.trim());
    if (form.description) formData.append("description", form.description);
    if (form.imageFile) formData.append("image", form.imageFile);

    dispatch(createAdminCategory(formData));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-2xl w-full max-w-lg">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="font-bold text-xl">Nouvelle Catégorie</h2>
          <button
            onClick={() => dispatch(closeCategoryModal())}
            className="p-2 hover:bg-secondary rounded-xl"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
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
              Description
            </label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="input-base w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Image</label>
            <div className="border-2 border-dashed border-border rounded-xl p-6 text-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="cat-image"
              />
              <label htmlFor="cat-image" className="cursor-pointer block">
                {form.imagePreview ? (
                  <img
                    src={form.imagePreview}
                    alt="preview"
                    className="mx-auto max-h-48 rounded-lg"
                  />
                ) : (
                  <div>
                    <Tag className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Cliquez pour choisir une image
                    </p>
                  </div>
                )}
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => dispatch(closeCategoryModal())}
              className="btn-secondary flex-1 py-3"
            >
              ANNULER
            </button>
            <button
              type="submit"
              disabled={loading || !form.name.trim()}
              className="btn-primary flex-1 py-3"
            >
              {loading ? "Création en cours..." : "CRÉER LA CATÉGORIE"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ── Update Category Modal ─────────────────────────────────────────────────────
const UpdateCategoryModal = ({ category }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((s) => s.admin);

  const [form, setForm] = useState({
    name: category?.name || "",
    description: category?.description || "",
    imageFile: null,
    imagePreview: category?.image?.url || category?.image || null,
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({
        ...form,
        imageFile: file,
        imagePreview: URL.createObjectURL(file),
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    const formData = new FormData();
    formData.append("name", form.name.trim());
    if (form.description) formData.append("description", form.description);
    if (form.imageFile) formData.append("image", form.imageFile);

    dispatch(
      updateAdminCategory({
        id: category.id,
        formData,
      }),
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-2xl w-full max-w-lg">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="font-bold text-xl">Modifier la Catégorie</h2>
          <button
            onClick={() => dispatch(toggleUpdateCategoryModal(null))}
            className="p-2 hover:bg-secondary rounded-xl"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
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
              Description
            </label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="input-base w-full resize-y"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Image de la catégorie
            </label>
            <div className="border-2 border-dashed border-border rounded-xl p-6 text-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="update-category-image"
              />
              <label
                htmlFor="update-category-image"
                className="cursor-pointer block"
              >
                {form.imagePreview ? (
                  <img
                    src={form.imagePreview}
                    alt="Preview"
                    className="mx-auto max-h-48 object-cover rounded-lg"
                  />
                ) : (
                  <div className="py-8">
                    <Tag className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Changer l'image
                    </p>
                  </div>
                )}
              </label>
            </div>
            {category?.image?.url && !form.imageFile && (
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Image actuelle sera conservée si aucune nouvelle n'est
                sélectionnée
              </p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => dispatch(toggleUpdateCategoryModal(null))}
              className="btn-secondary flex-1 py-3"
            >
              ANNULER
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1 py-3 flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <LoaderCircle className="w-4 h-4 animate-spin" />
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

// ── Main Page ──────────────────────────────────────────────────────────────────
const AdminCategories = () => {
  const dispatch = useDispatch();
  const {
    categories,
    loading,
    isCategoryModalOpen,
    isUpdateCategoryModalOpen,
    selectedCategory,
  } = useSelector((s) => s.admin);
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchAdminCategories());
  }, [dispatch]);

  const handleDelete = (id, name) => {
    if (
      window.confirm(
        `Supprimer la catégorie "${name}" ? Les produits associés seront dissociés.`,
      )
    ) {
      dispatch(deleteAdminCategory(id));
    }
  };

  const filtered = categories.filter(
    (c) => !search || c.name?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <AdminLayout>
      <AdminHeader title="Catégories" />
      <main className="flex-1 p-6">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher une catégorie..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-base w-full pl-9 text-sm py-2"
            />
          </div>
          <button
            onClick={() => dispatch(toggleCategoryModal())}
            className="btn-primary flex items-center gap-2 shrink-0"
          >
            <Plus className="w-4 h-4" /> NOUVELLE CATÉGORIE
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="card-base p-4 text-center">
            <div className="font-display text-primary text-3xl">
              {categories.length}
            </div>
            <div className="font-ui text-xs text-muted-foreground tracking-widest uppercase mt-0.5">
              Catégories
            </div>
          </div>
          <div className="card-base p-4 text-center">
            <div className="font-display text-emerald-500 text-3xl">
              {categories.filter((c) => c.image).length}
            </div>
            <div className="font-ui text-xs text-muted-foreground tracking-widest uppercase mt-0.5">
              Avec image
            </div>
          </div>
          <div className="card-base p-4 text-center">
            <div className="font-display text-yellow-500 text-3xl">
              {categories.filter((c) => c.description).length}
            </div>
            <div className="font-ui text-xs text-muted-foreground tracking-widest uppercase mt-0.5">
              Avec description
            </div>
          </div>
          <div className="card-base p-4 text-center">
            <div className="font-display text-blue-500 text-3xl">
              {filtered.length}
            </div>
            <div className="font-ui text-xs text-muted-foreground tracking-widest uppercase mt-0.5">
              Résultats
            </div>
          </div>
        </div>

        {/* Grid view */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <LoaderCircle className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <Tag className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
            <p className="font-ui text-muted-foreground text-lg">
              Aucune catégorie{search ? " trouvée" : ""}
            </p>
            {!search && (
              <button
                onClick={() => dispatch(toggleCategoryModal())}
                className="btn-primary mt-4 flex items-center gap-2 mx-auto"
              >
                <Plus className="w-4 h-4" /> Créer la première catégorie
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((cat) => (
              <div
                key={cat.id}
                className="card-base overflow-hidden hover:border-primary/40 transition-colors group"
              >
                {/* Image */}
                <div className="h-32 bg-secondary overflow-hidden relative">
                  {cat.image?.url ? (
                    <img
                      src={cat.image.url}
                      alt={cat.name}
                      className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Tag className="w-10 h-10 text-muted-foreground/30" />
                    </div>
                  )}
                  {/* Actions overlay */}
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => dispatch(toggleUpdateCategoryModal(cat))}
                      className="p-1.5 bg-card/90 rounded-md text-muted-foreground hover:text-primary transition-colors shadow-sm"
                      title="Modifier"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id, cat.name)}
                      className="p-1.5 bg-card/90 rounded-md text-muted-foreground hover:text-destructive transition-colors shadow-sm"
                      title="Supprimer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                {/* Info */}
                <div className="p-3">
                  <h3 className="font-ui font-bold text-foreground tracking-wide text-sm truncate">
                    {cat.name}
                  </h3>
                  {cat.description ? (
                    <p className="text-muted-foreground text-xs mt-1 line-clamp-2 leading-relaxed">
                      {cat.description}
                    </p>
                  ) : (
                    <p className="text-muted-foreground/50 text-xs mt-1 italic">
                      Pas de description
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-border">
                    <span className="font-ui text-xs text-muted-foreground">
                      {cat.created_at
                        ? new Date(cat.created_at).toLocaleDateString("fr-FR")
                        : "—"}
                    </span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => dispatch(toggleUpdateCategoryModal(cat))}
                        className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-primary transition-colors"
                        title="Modifier"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id, cat.name)}
                        className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {isCategoryModalOpen && <CreateCategoryModal />}
      {isUpdateCategoryModalOpen && selectedCategory && (
        <UpdateCategoryModal category={selectedCategory} />
      )}
    </AdminLayout>
  );
};

export default AdminCategories;
