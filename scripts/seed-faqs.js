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
  mongodbUri = 'mongodb+srv://hutbuzzmart:ymRjwTMh8LzaUfsT@cluster0.37cirsi.mongodb.net/hutbuzzmart';
}

console.log('Connecting to MongoDB...');

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
    answer: 'Hut Buzz Mart specializes in trendy fashion dresses, premium wall & desk clocks, unique lifestyle gift items, and specially curated combo packages designed for every festive occasion, celebration, and everyday luxury.',
    order: 1,
    isActive: true,
  },
  {
    question: 'Can I customize gift items or create custom combo packages?',
    answer: 'Yes, absolutely! We offer personalized gift packaging, custom greeting cards, and tailor-made combo hampers. You can combine your chosen dresses, clocks, and special gift items into a single curated gift package. Simply add your instructions during checkout or reach out to our support team.',
    order: 2,
    isActive: true,
  },
  {
    question: 'How do I choose the right dress size, and can I exchange if it does not fit?',
    answer: 'Every dress listing includes a detailed size chart with accurate chest, waist, and length measurements in inches. If you receive a dress that does not fit perfectly, you can easily request a size exchange within 7 days of delivery, provided the item is unworn and original tags remain intact.',
    order: 3,
    isActive: true,
  },
  {
    question: 'How do you ensure clocks and delicate gift items arrive without damage?',
    answer: 'We take fragile packaging very seriously. All wall clocks, desk timepieces, and delicate gift decor are securely packed using multi-layer shock-absorbing bubble wrap, protective edge foam, and durable corrugated shipping boxes to guarantee 100% safe arrival at your doorstep.',
    order: 4,
    isActive: true,
  },
  {
    question: 'What are the delivery charges and delivery times across Bangladesh?',
    answer: 'We provide nationwide delivery across Bangladesh. Inside Dhaka, delivery takes 24 to 48 hours with a shipping fee of 60 BDT. For locations outside Dhaka, shipping is 120 BDT and takes 2 to 4 business days. Cash on Delivery (COD) and convenient online payments are available.',
    order: 5,
    isActive: true,
  },
];

async function seed() {
  try {
    await mongoose.connect(mongodbUri);
    console.log('Connected to MongoDB successfully.');

    // Clear existing FAQs
    const deleteResult = await FAQ.deleteMany({});
    console.log(`Cleared ${deleteResult.deletedCount} existing FAQs.`);

    // Insert new FAQs
    const insertResult = await FAQ.insertMany(faqs);
    console.log(`Seeded ${insertResult.length} FAQs successfully:`);
    insertResult.forEach((f, i) => {
      console.log(`[FAQ ${i + 1}] Question: "${f.question}"`);
    });

  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
    process.exit(0);
  }
}

seed();
