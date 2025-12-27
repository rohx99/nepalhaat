const products = [
  {
    productName: "Round neck T-shirt",
    slug: "round-neck-t-shirt",
    categoryName: "Fashion",
    subCategoryName: "T-Shirt",
    gender: "Men",
    price: "299",
    discount: "10",
    description:
      "Soft, breathable, and perfect for everyday wear, this round neck T-shirt offers a classic fit and minimalistic design. Made with premium cotton, it provides comfort and style all day. Ideal for pairing with jeans or shorts, it’s a must-have in every man’s wardrobe for casual fashion statements.",
    productImage:
      "https://www.montecarlo.in/cdn/shop/files/224065952-2-38_1.jpg?v=1718963618",
    numberOfReviews: 5,
    starsCount: 21,
    seller: {
      sellerId: "SELL001",
      sellerName: "UrbanWear",
      sellerRating: 4.5,
    },
  },
  {
    productName: "Slim Fit Jeans",
    slug: "slim-fit-jeans",
    categoryName: "Fashion",
    subCategoryName: "Jeans",
    gender: "Women",
    price: "999",
    discount: "15",
    description:
      "Designed for a sleek silhouette, these slim-fit jeans for women offer both comfort and style. The stretchable denim ensures ease of movement, while the mid-rise waist and narrow leg cut add a trendy touch. Perfect for casual outings or semi-formal occasions, these jeans pair well with any top.",
    productImage:
      "https://www.only.in/cdn/shop/files/900742401_g0.jpg?v=1745910181",
    numberOfReviews: 5,
    starsCount: 24,
    seller: {
      sellerId: "SELL002",
      sellerName: "DenimHub",
      sellerRating: 4.7,
    },
  },
  {
    productName: "Bluetooth Headphones",
    slug: "bluetooth-headphones",
    categoryName: "Electronics",
    subCategoryName: "Audio",
    gender: "",
    price: "1499",
    discount: "20",
    description:
      "Experience high-quality wireless audio with these Bluetooth headphones. With deep bass, noise isolation, and long battery life, they’re perfect for music lovers and on-the-go professionals. Lightweight and foldable, they offer ultimate portability. Connect seamlessly with your smartphone, tablet, or laptop for a hassle-free audio experience anytime, anywhere.",
    productImage:
      "https://hammeronline.in/cdn/shop/files/Bash_2.0_Bluetooth_Headphones.webp?v=1726899059",
    numberOfReviews: 5,
    starsCount: 22,
    seller: {
      sellerId: "SELL003",
      sellerName: "TechZone",
      sellerRating: 4.3,
    },
  },
  {
    productName: "Running Shoes",
    slug: "running-shoes",
    categoryName: "Footwear",
    subCategoryName: "Sports Shoes",
    gender: "Men",
    price: "1999",
    discount: "25",
    description:
      "Engineered for performance and comfort, these men’s running shoes feature a cushioned sole and breathable mesh upper. Whether you’re jogging, hitting the gym, or running errands, they provide optimal support and grip. The sleek design and lightweight construction make them a stylish and functional choice for everyday wear.",
    productImage:
      "https://bersache.com/cdn/shop/files/WhatsAppImage2024-05-08at13.24.46.jpg?v=1746188942&width=1080",
    numberOfReviews: 5,
    starsCount: 20,
    seller: {
      sellerId: "SELL004",
      sellerName: "FitGear",
      sellerRating: 4.6,
    },
  },
  {
    productName: "Smartphone Case",
    slug: "smartphone-case",
    categoryName: "Accessories",
    subCategoryName: "Mobile Accessories",
    gender: "",
    price: "249",
    discount: "5",
    description:
      "Protect your phone in style with this durable and sleek smartphone case. Made with shock-absorbent materials, it safeguards your device from scratches, drops, and everyday wear. The slim profile maintains easy access to all buttons and ports. Available in various colors to match your personal style and device.",
    productImage:
      "https://brownliving.in/cdn/shop/products/biodegradable-eco-friendly-wheat-straw-phone-case-mobile-cover-pacific-blue-177-13090-agc-hk-13-008-tech-accessories-brown-living-555270.jpg?v=1682960778",
    numberOfReviews: 5,
    starsCount: 19,
    seller: {
      sellerId: "SELL005",
      sellerName: "MobileCraft",
      sellerRating: 4.2,
    },
  },
  {
    productName: "Cotton Saree",
    slug: "cotton-saree",
    categoryName: "Fashion",
    subCategoryName: "Saree",
    gender: "Women",
    price: "1299",
    discount: "30",
    description:
      "Elegantly crafted, this cotton saree features traditional prints and lightweight fabric, making it perfect for daily wear or festive occasions. The breathable material ensures comfort throughout the day, while the vibrant design adds charm to your look. Pair it with classic jewelry and a blouse for a complete outfit.",
    productImage: "https://dorabyphoenix.com/wp-content/uploads/2022/07/e6.jpg",
    numberOfReviews: 5,
    starsCount: 23,
    seller: {
      sellerId: "SELL006",
      sellerName: "SareeShine",
      sellerRating: 4.8,
    },
  },
  {
    productName: "Kids' Toy Car",
    slug: "kids-toy-car",
    categoryName: "Toys",
    subCategoryName: "Vehicles",
    gender: "Kids",
    price: "599",
    discount: "10",
    description:
      "This colorful and sturdy toy car is designed to keep kids entertained for hours. Made with non-toxic materials and rounded edges for safety, it’s perfect for imaginative play. The push-and-go mechanism encourages motor skills and hand-eye coordination. Ideal for children aged 3 and above, it’s a fun gift.",
    productImage:
      "https://staranddaisy.in/wp-content/uploads/2022/12/51RnmUGWpxL.jpg",
    numberOfReviews: 5,
    starsCount: 17,
    seller: {
      sellerId: "SELL007",
      sellerName: "ToyWorld",
      sellerRating: 4.4,
    },
  },
  {
    productName: "Laptop Backpack",
    slug: "laptop-backpack",
    categoryName: "Bags",
    subCategoryName: "Backpack",
    gender: "",
    price: "1199",
    discount: "18",
    description:
      "This laptop backpack combines functionality and style. With padded compartments for laptops up to 15.6 inches, it offers secure storage along with multiple organizer pockets for accessories. The ergonomic straps and water-resistant fabric ensure comfort and durability. Ideal for students, professionals, and travelers needing daily convenience and protection.",
    productImage:
      "https://www.thewalletstore.in/cdn/shop/files/01.1_e91bb37c-5a80-4b2a-bc3a-fc706a4cae54.jpg?v=1723025356",
    numberOfReviews: 5,
    starsCount: 25,
    seller: {
      sellerId: "SELL008",
      sellerName: "BagNPack",
      sellerRating: 4.9,
    },
  },
];
