import axios from "axios";

const fetchAllProducts = async () => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/products`,
      {
        headers: {
          "Cache-Control": "no-cache",
        },
      }
    );

    return response.data.products || [];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

const fetchProductBySlug = async (slug) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/products/slug/${slug}`,
      {
        headers: {
          "Cache-Control": "no-cache",
        },
      }
    );
    return response.data.product || {};
  } catch (error) {
    console.log(error);
    return {};
  }
};

const products = await fetchAllProducts();

export { products, fetchAllProducts, fetchProductBySlug };
