const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Read .env.local file to get MONGODB_URI
const envPath = path.join(__dirname, '../.env.local');
let mongodbUri = '';

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const match = envContent.match(/^MONGODB_URI=(.*)$/m);
  if (match && match[1]) {
    mongodbUri = match[1].trim().replace(/['"]/g, '');
  }
}

if (!mongodbUri) {
  console.error('ERROR: MONGODB_URI not found in .env.local');
  process.exit(1);
}

console.log('Connecting to MongoDB...');

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true },
    image: { type: String },
    parentCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);

const categories = [
  {
    name: 'Wall & Table Clocks',
    slug: 'clocks',
    image: '/assets/images/cagetory/clocks.webp',
    isActive: true,
  },
  {
    name: 'Fashion Dresses & Apparel',
    slug: 'fashion-dresses',
    image: '/assets/images/cagetory/fashion_dresses.webp',
    isActive: true,
  },
  {
    name: 'Gift Items & Keepsakes',
    slug: 'gift-items',
    image: '/assets/images/cagetory/gift_items.webp',
    isActive: true,
  },
  {
    name: 'Special Combo Packages',
    slug: 'combo-packages',
    image: '/assets/images/cagetory/combo_packages.webp',
    isActive: true,
  },
  {
    name: 'Lifestyle Accessories & Decor',
    slug: 'accessories-decor',
    image: '/assets/images/cagetory/accessories_decor.webp',
    isActive: true,
  },
];

async function seed() {
  try {
    await mongoose.connect(mongodbUri);
    console.log('Connected to MongoDB successfully.');

    // Clear existing categories or upsert
    console.log('Seeding Hut Buzz Mart 5 main categories...');
    for (const cat of categories) {
      const result = await Category.findOneAndUpdate(
        { slug: cat.slug },
        { $set: cat },
        { upsert: true, new: true }
      );
      console.log(`[SAVED] "${result.name}" -> ${result.image}`);
    }

    console.log('\nAll 5 categories seeded successfully!');
  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
    process.exit(0);
  }
}

seed();
