const parseJson = (field) => {
  if (!field) return field;
  if (typeof field === "string") {
    try {
      return JSON.parse(field);
    } catch {
      return field;
    }
  }
  return field;
};

const parseProductFields = (product) => ({
  ...product,
  images: parseJson(product.images),
});

const parseCategoryFields = (category) => ({
  ...category,
  image: parseJson(category.image),
});

const parseOrderFields = (order) => ({
  ...order,
  order_items: parseJson(order?.order_items || "[]"),
  shipping_info: parseJson(order?.shipping_info || "{}"),
});

const parseUserFields = (user) => ({
  ...user,
  avatar: parseJson(user.avatar),
});

module.exports = {
  parseJson,
  parseProductFields,
  parseCategoryFields,
  parseOrderFields,
  parseUserFields,
};
