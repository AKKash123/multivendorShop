import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const category = await prisma.category.upsert({
    where: { slug: "lifestyle" },
    update: {},
    create: { name: "Lifestyle", slug: "lifestyle" }
  });
  const user = await prisma.user.upsert({
    where: { email: "demo-vendor@example.com" },
    update: {},
    create: { name: "Demo Vendor", email: "demo-vendor@example.com", role: "VENDOR" }
  });
  const vendor = await prisma.vendor.upsert({
    where: { userId: user.id },
    update: {},
    create: { userId: user.id, storeName: "North Studio", slug: "north-studio", status: "APPROVED" }
  });
  await prisma.product.upsert({
    where: { slug: "everyday-canvas-tote" },
    update: {},
    create: {
      vendorId: vendor.id, categoryId: category.id, name: "Everyday Canvas Tote",
      slug: "everyday-canvas-tote", description: "A minimal everyday carry-all.",
      pricePaise: 89900, stock: 25,
      imageUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=800",
      status: "APPROVED"
    }
  });
}

main().finally(async () => prisma.$disconnect());
