const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

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
  mongodbUri = 'mongodb+srv://hutbuzzmart:ymRjwTMh8LzaUfsT@cluster0.37cirsi.mongodb.net/hutbuzzmart';
}

const FAQSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const FAQ = mongoose.models.FAQ || mongoose.model('FAQ', FAQSchema);

const faqs = [
  {
    question: 'What types of products does Hut Buzz Mart offer?',
    answer: 'Hut Buzz Mart offers a curated collection of luxury wall and table clocks, contemporary fashion dresses, personalized gift items, special combo packages, and modern lifestyle decor accessories.',
    order: 1,
    isActive: true,
  },
  {
    question: 'Are the clocks, dresses, and gift items authentic and high quality?',
    answer: 'Yes, absolutely. All clocks feature precision sweep silent movements, our dresses are crafted from premium fabrics with quality stitching, and gift items are carefully inspected and packed before dispatch.',
    order: 2,
    isActive: true,
  },
  {
    question: 'What are the delivery charges and delivery times across Bangladesh?',
    answer: 'Inside Dhaka city, delivery takes 24 to 48 hours with a delivery fee of 60 BDT. Outside Dhaka, delivery takes 2 to 5 business days with a shipping charge of 120 BDT. Free delivery is available on qualifying promotional orders.',
    order: 3,
    isActive: true,
  },
  {
    question: 'Can I return or exchange a product if there is a defect or size issue?',
    answer: 'Yes! We offer a hassle-free 7-day return and exchange policy. If you receive a damaged clock or require a different dress size, contact our support team with your order number and photos for immediate assistance.',
    order: 4,
    isActive: true,
  },
  {
    question: 'Do you offer customized gift packaging or special combo gift boxes?',
    answer: 'Yes! We provide special gift packaging options and curated combo packages suitable for birthdays, anniversaries, weddings, and corporate occasions. You can also add personalized greeting cards to your orders.',
    order: 5,
    isActive: true,
  },
];

async function seed() {
  try {
    await mongoose.connect(mongodbUri);
    console.log('Connected to MongoDB successfully.');

    const deleteResult = await FAQ.deleteMany({});
    console.log(`Cleared ${deleteResult.deletedCount} existing FAQs.`);

    const insertResult = await FAQ.insertMany(faqs);
    console.log(`Seeded ${insertResult.length} relevant FAQs successfully!`);

    // Also update GlobalSettings meta & marquee if exists
    const db = mongoose.connection.db;
    const settingsCol = db.collection('globalsettings');
    const updateRes = await settingsCol.updateOne(
      {},
      {
        $set: {
          marqueeText: 'Welcome to Hut Buzz Mart! Discover premium clocks, trendy fashion dresses, curated gift items & exclusive combo packages.',
          metaTitle: 'Hut Buzz Mart - Premium Clocks, Fashion Dresses & Gift Items in Bangladesh',
          metaDescription: 'Shop luxury wall clocks, elegant fashion dresses, curated gift items, and exclusive combo packages online at Hut Buzz Mart. Fast delivery all across Bangladesh.',
        }
      }
    );
    console.log('Updated GlobalSettings in MongoDB:', updateRes.modifiedCount);

    await mongoose.disconnect();
    console.log('Database connection closed.');
  } catch (error) {
    console.error('Error seeding FAQs:', error);
    process.exit(1);
  }
}

seed();
