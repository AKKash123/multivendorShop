
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

import {
  ArrowRight,
  ShieldCheck,
  Store,
  Truck,
  MapPin,
  Search,
  ShoppingBag,
  Headphones,
  Sparkles,
  ChevronRight,
  PackageCheck,
  BadgeCheck,
  Heart,
} from "lucide-react";

import { prisma } from "@/lib/prisma";
import { formatINR } from "@/lib/money";

export const metadata: Metadata = {
  title: "Shopezzy | Discover Independent Brands",
  description:
    "Discover unique products from independent sellers. Shop thoughtfully selected lifestyle, home, beauty and accessory products on Shopezzy.",
  openGraph: {
    title: "Shopezzy | Shop Differently",
    description:
      "Discover something special. Shop independent brands and support small businesses.",
    type: "website",
    siteName: "Shopezzy",
  },
};

type ProductCardData = {
  id: string;
  name: string;
  description: string | null;
  pricePaise: number;
  imageUrl: string | null;
  vendor: {
    storeName: string;
  };
  category: {
    name: string;
  } | null;
};

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800";

const fallbackProducts: ProductCardData[] = [
  {
    id: "p1",
    name: "Everyday Canvas Tote",
    description: "Minimal carry-all for everyday essentials.",
    pricePaise: 89900,
    imageUrl:
      "https://images.unsplash.com/photo-1544816155-12df9643f363?w=800",
    vendor: { storeName: "North Studio" },
    category: { name: "Lifestyle" },
  },
  {
    id: "p2",
    name: "Ceramic Coffee Set",
    description: "Hand-finished ceramic cups for slow mornings.",
    pricePaise: 129900,
    imageUrl:
      "https://images.unsplash.com/photo-1514228742587-6b1558f4f8b5?w=800",
    vendor: { storeName: "Clay & Co." },
    category: { name: "Home" },
  },
  {
    id: "p3",
    name: "Classic Analog Watch",
    description: "A clean everyday design with a timeless finish.",
    pricePaise: 249900,
    imageUrl:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",
    vendor: { storeName: "Time Works" },
    category: { name: "Accessories" },
  },
  {
    id: "p4",
    name: "Natural Skincare Kit",
    description: "A simple daily care collection.",
    pricePaise: 159900,
    imageUrl:
      "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800",
    vendor: { storeName: "Botanical Lab" },
    category: { name: "Beauty" },
  },
];

const benefits = [
  {
    icon: Store,
    title: "Independent sellers",
    description: "Discover unique local brands",
  },
  {
    icon: ShieldCheck,
    title: "Secure shopping",
    description: "A safer checkout experience",
  },
  {
    icon: Truck,
    title: "Order tracking",
    description: "Follow your delivery journey",
  },
  {
    icon: MapPin,
    title: "Location aware",
    description: "Map-based delivery addresses",
  },
];

function safeImageUrl(url: string | null | undefined): string {
  if (!url) return FALLBACK_IMAGE;

  try {
    const parsed = new URL(url);

    if (
      parsed.protocol === "https:" &&
      parsed.hostname === "images.unsplash.com"
    ) {
      return url;
    }

    // Allow locally hosted product images.
    if (url.startsWith("/") && !url.startsWith("//")) {
      return url;
    }
  } catch {
    return FALLBACK_IMAGE;
  }

  return FALLBACK_IMAGE;
}

async function getFeaturedProducts(): Promise<ProductCardData[]> {
  try {
    const products = await prisma.product.findMany({
      where: {
        status: "APPROVED",
        vendor: {
          status: "APPROVED",
        },
      },
      select: {
        id: true,
        name: true,
        description: true,
        pricePaise: true,
        imageUrl: true,
        vendor: {
          select: {
            storeName: true,
          },
        },
        category: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 8,
    });

    if (products.length > 0) {
      return products;
    }
  } catch (error) {
    console.error("Featured products database error:", error);
  }

  return fallbackProducts;
}

export default async function HomePage() {
  const products = await getFeaturedProducts();

  return (
    <main className="marketplace">

      {/* Announcement */}
      <div className="announcement">
        <Sparkles size={14} aria-hidden="true" />

        <span>
          Discover independent brands and products you will love.
        </span>

        <Link href="/products">
          Explore now <ArrowRight size={13} />
        </Link>
      </div>

      {/* Header */}
      <header className="market-header">
        <div className="market-container header-inner">

          <Link href="/" className="brand-logo" aria-label="Shopezzy homepage">
            <span className="brand-icon">
              <ShoppingBag size={21} />
            </span>

            <span>
              shopezzy<span className="brand-dot">.</span>
              <small>SHOP DIFFERENTLY</small>
            </span>
          </Link>

          <nav className="desktop-nav" aria-label="Main navigation">
            <Link href="/">Home</Link>
            <Link href="/products">Shop</Link>
            <Link href="/vendor/register">Become a seller</Link>
            <Link href="/orders">My orders</Link>
            <Link href="/login">login</Link>
          </nav>

          <div className="header-actions">
            <Link
              href="/products"
              className="header-search"
              aria-label="Search products"
            >
              <Search size={19} />
            </Link>

            <Link href="/cart" className="header-cart">
              <ShoppingBag size={19} />
              <span>Cart</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="hero-section">
        <div className="market-container hero-grid">

          <div className="hero-content">

            <div className="hero-label">
              <Sparkles size={15} />
              YOUR MARKETPLACE, REIMAGINED
            </div>

            <h1>
              Find things
              <br />
              that make life
              <br />
              <span>more beautiful.</span>
            </h1>

            <p className="hero-description">
              Explore thoughtfully selected products from independent
              sellers. Discover something special, support small
              businesses, and shop with confidence.
            </p>

            <div className="hero-buttons">
              <Link href="/products" className="primary-button">
                Explore collection <ArrowRight size={18} />
              </Link>

              <Link href="/vendor/register" className="outline-button">
                Start selling
              </Link>
            </div>

            <div className="hero-social-proof">
              <div className="proof-icon">
                <BadgeCheck size={19} />
              </div>

              <div>
                <strong>Discover independent stores</strong>
                <span>One marketplace. Many possibilities.</span>
              </div>
            </div>

          </div>

          <div className="hero-visual">

            <div className="hero-image-main">
              <Image
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200"
                alt="Beautiful curated shopping store"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="hero-image"
              />

              <div className="image-overlay" />
            </div>

            <div className="hero-floating-card floating-top">
              <div className="floating-icon">
                <ShieldCheck size={21} />
              </div>

              <div>
                <strong>Shop with confidence</strong>
                <span>Seller applications reviewed</span>
              </div>
            </div>

            <div className="hero-floating-card floating-bottom">
              <div className="floating-icon mint">
                <Truck size={21} />
              </div>

              <div>
                <strong>Delivery visibility</strong>
                <span>Track your order journey</span>
              </div>
            </div>

            <div className="hero-image-caption">
              <span>CURATED FINDS</span>
              <strong>Made to be discovered.</strong>
            </div>

          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="benefits-section">
        <div className="market-container benefits-grid">

          {benefits.map(({ icon: Icon, title, description }) => (
            <div className="benefit-item" key={title}>
              <div className="benefit-icon">
                <Icon size={22} aria-hidden="true" />
              </div>

              <div>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
            </div>
          ))}

        </div>
      </section>

      {/* Featured Products */}
      <section id="products" className="products-section">
        <div className="market-container">

          <div className="section-heading">
            <div>
              <span className="section-eyebrow">
                HANDPICKED FOR YOU
              </span>

              <h2>Discover something special.</h2>

              <p>
                Explore our latest finds from independent marketplace sellers.
              </p>
            </div>

            <Link href="/products" className="view-all-link">
              View all products <ArrowRight size={17} />
            </Link>
          </div>

          {products.length > 0 ? (
            <div className="product-grid">

              {products.map((product) => (
                <article className="product-card" key={product.id}>

                  <Link
                    href={`/products/${product.id}`}
                    className="product-image-wrap"
                    aria-label={`View ${product.name}`}
                  >
                    <Image
                      src={safeImageUrl(product.imageUrl)}
                      alt={product.name}
                      fill
                      sizes="(max-width: 600px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="product-image"
                    />

                    <span className="product-category">
                      {product.category?.name || "Marketplace"}
                    </span>

                    <span className="product-heart" aria-hidden="true">
                      <Heart size={17} />
                    </span>
                  </Link>

                  <div className="product-info">

                    <span className="product-vendor">
                      <Store size={13} aria-hidden="true" />
                      {product.vendor?.storeName || "Featured seller"}
                    </span>

                    <Link href={`/products/${product.id}`}>
                      <h3>{product.name}</h3>
                    </Link>

                    <p className="product-description">
                      {product.description || "Discover this special find."}
                    </p>

                    <div className="product-bottom">
                      <strong>
                        {formatINR(product.pricePaise)}
                      </strong>

                      <Link
                        href={`/products/${product.id}`}
                        className="product-details"
                      >
                        View details <ChevronRight size={15} />
                      </Link>
                    </div>

                  </div>
                </article>
              ))}

            </div>
          ) : (
            <div className="empty-products">
              <ShoppingBag size={35} />
              <h3>Products coming soon</h3>
              <p>Our sellers are preparing something special for you.</p>
              <Link href="/products" className="primary-button">
                Explore marketplace
              </Link>
            </div>
          )}

          <div className="products-mobile-link">
            <Link href="/products" className="primary-button">
              Explore all products <ArrowRight size={17} />
            </Link>
          </div>

        </div>
      </section>

      {/* Seller CTA */}
      <section className="seller-section">
        <div className="market-container seller-banner">

          <div className="seller-content">

            <span className="seller-eyebrow">
              <Store size={15} /> FOR INDEPENDENT BUSINESSES
            </span>

            <h2>
              Have something
              <br />
              worth sharing?
            </h2>

            <p>
              Bring your products to a wider audience. Create your
              store and grow your business with Shopezzy.
            </p>

            <Link href="/vendor/register" className="seller-button">
              Become a seller <ArrowRight size={17} />
            </Link>

          </div>

          <div className="seller-art">
            <div className="seller-art-circle" />

            <Image
              src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=900"
              alt="Independent business owner preparing an order"
              fill
              sizes="(max-width: 768px) 100vw, 45vw"
              className="seller-image"
            />

            <div className="seller-art-tag">
              <PackageCheck size={19} />
              <span>Grow with confidence</span>
            </div>
          </div>

        </div>
      </section>

      {/* Service Strip */}
      <section className="service-section">
        <div className="market-container service-grid">

          <div>
            <ShieldCheck size={25} />
            <div>
              <strong>Shopping made simpler</strong>
              <span>A smooth marketplace experience</span>
            </div>
          </div>

          <div>
            <Headphones size={25} />
            <div>
              <strong>Here to help</strong>
              <span>Support for your shopping journey</span>
            </div>
          </div>

          <div>
            <Truck size={25} />
            <div>
              <strong>Stay informed</strong>
              <span>Order and delivery updates</span>
            </div>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="market-footer">
        <div className="market-container">

          <div className="footer-main">

            <div className="footer-brand">
              <Link href="/" className="brand-logo footer-logo">
                <span className="brand-icon">
                  <ShoppingBag size={21} />
                </span>

                <span>
                  shopezzy<span className="brand-dot">.</span>
                  <small>SHOP DIFFERENTLY</small>
                </span>
              </Link>

              <p>
                A marketplace connecting shoppers with independent
                sellers and thoughtfully selected products.
              </p>
            </div>

            <div className="footer-links">
              <h4>Explore</h4>
              <Link href="/products">All products</Link>
              <Link href="/cart">Shopping cart</Link>
              <Link href="/orders">My orders</Link>
              <Link href="/login">login</Link>
            </div>

            <div className="footer-links">
              <h4>Sell with us</h4>
              <Link href="/vendor/register">Become a seller</Link>
              <Link href="/vendor/dashboard">Vendor dashboard</Link>
            </div>

            <div className="footer-links">
              <h4>Account</h4>
              <Link href="/orders">Order history</Link>
              <Link href="/admin/dashboard">Administration</Link>
            </div>

          </div>

          <div className="footer-bottom">
            <span>
              © {new Date().getFullYear()} Shopezzy. All rights reserved.
            </span>

            <span>
              Discover. Shop. Support independent businesses.
            </span>
          </div>

        </div>
      </footer>

    </main>
  );
}
