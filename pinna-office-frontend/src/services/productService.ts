import products from "@/data/products";

const productService = {
  async getAll(params?: { search?: string; category?: string }) {
    const keyword = params?.search?.toLowerCase() ?? "";
    const category = params?.category?.toLowerCase() ?? "";

    return products.filter((product) => {
      const matchesSearch =
        !keyword ||
        product.name.toLowerCase().includes(keyword) ||
        product.description.toLowerCase().includes(keyword) ||
        product.category.toLowerCase().includes(keyword);

      const matchesCategory =
        !category || product.category.toLowerCase() === category;

      return matchesSearch && matchesCategory;
    });
  },

  async getFeatured(limit = 8) {
    return products.slice(0, limit);
  },

  getById(id: string) {
    return products.find((product) => product.id === id);
  },

  getByCategory(category: string) {
    return products.filter((product) => product.category === category);
  },

  search(query: string) {
    const keyword = query.toLowerCase();

    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(keyword) ||
        product.description.toLowerCase().includes(keyword) ||
        product.category.toLowerCase().includes(keyword)
    );
  },
};

export default productService;