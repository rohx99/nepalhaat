import { fetchAllProducts } from "@/utils/products";

export default async function sitemap() {
  const products = await fetchAllProducts();

  const productEntries = products.map(({ slug }) => ({
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/products/${slug}`,
  }));

  return [
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}`,
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/sign-up`,
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/products`,
    },
    ...productEntries,
  ];
}
