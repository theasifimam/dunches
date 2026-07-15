import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/eatables';

const CategorySchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    image: { type: String },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
    isActive: { type: Boolean, default: true },
});

const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    brand: { type: String, required: true, trim: true },
    sku: { type: String, required: true, unique: true, uppercase: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    type: { type: String, required: true },
    netWeight: { type: Number, required: true },
    ingredients: { type: [String], default: [] },
    shelfLife: { type: String, default: '6 Months' },
    flavorProfile: { type: String, enum: ['Classic', 'Savory', 'Spicy', 'Sweet', 'Assortments'], default: 'Classic' },
    nutritionalValues: {
        calories: Number,
        protein: Number,
        carbohydrates: Number,
        fat: Number,
        fiber: Number,
    },
    images: { type: [String], default: [] },
    price: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0, min: 0, max: 100 },
    stock: { type: Number, required: true, default: 0, min: 0 },
    tags: { type: [String], default: [] },
    isActive: { type: Boolean, default: true },
});

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

const seedProducts = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // Delete existing products
        await Product.deleteMany({});
        console.log('Cleared existing products');

        // Fetch categories to link by slug
        const categories = await Category.find({});
        const categoryMap = new Map(categories.map(c => [c.slug, c._id]));

        const makhanaProducts = [
            {
                name: 'Classic Himalayan Pink Salt Makhāna',
                slug: 'classic-himalayan-pink-salt-makhana',
                description: 'Slow-roasted to a delicate crunch, lightly tossed in hand-harvested pink Himalayan salt and premium cold-pressed olive oil.',
                brand: 'makhāna',
                sku: 'MKH-CPS-01',
                category: categoryMap.get('classic'),
                type: 'makhana',
                netWeight: 80,
                ingredients: ['Organic Makhana (Lotus Seeds)', 'Pink Himalayan Salt', 'Cold-Pressed Olive Oil', 'White Pepper'],
                shelfLife: '6 Months',
                flavorProfile: 'Classic',
                nutritionalValues: { calories: 350, protein: 9.7, carbohydrates: 77.0, fat: 0.1, fiber: 14.5 },
                images: ['https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?q=80&w=800'],
                price: 120,
                discount: 15,
                stock: 45,
                tags: ['makhana', 'pink salt', 'classic', 'roasted', 'healthy'],
                isActive: true
            },
            {
                name: 'Smoked Chili & Zesty Lime Makhāna',
                slug: 'smoked-chili-zesty-lime-makhana',
                description: 'A vibrant kick of fiery Kashmiri red chili flakes tempered by fresh tangy key lime zest. Bold and refreshing.',
                brand: 'makhāna',
                sku: 'MKH-SCL-02',
                category: categoryMap.get('spicy'),
                type: 'makhana',
                netWeight: 80,
                ingredients: ['Organic Makhana', 'Smoked Kashmiri Chili', 'Key Lime Zest', 'Dehydrated Lime Juice', 'Olive Oil'],
                shelfLife: '6 Months',
                flavorProfile: 'Spicy',
                nutritionalValues: { calories: 362, protein: 9.4, carbohydrates: 75.8, fat: 0.3, fiber: 14.0 },
                images: ['https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=800'],
                price: 135,
                discount: 15,
                stock: 28,
                tags: ['makhana', 'spicy', 'chili', 'lime', 'roasted'],
                isActive: true
            },
            {
                name: 'Toasted Sesame & Black Pepper Makhāna',
                slug: 'toasted-sesame-black-pepper-makhana',
                description: 'Coated in freshly ground Tellicherry black pepper and nutty toasted black and white sesame seeds. Comfortingly savory.',
                brand: 'makhāna',
                sku: 'MKH-TSB-03',
                category: categoryMap.get('savory'),
                type: 'makhana',
                netWeight: 80,
                ingredients: ['Organic Makhana', 'Tellicherry Black Pepper', 'Toasted White Sesame', 'Toasted Black Sesame', 'Sesame Oil'],
                shelfLife: '6 Months',
                flavorProfile: 'Savory',
                nutritionalValues: { calories: 358, protein: 9.8, carbohydrates: 76.2, fat: 0.5, fiber: 14.2 },
                images: ['https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=800'],
                price: 130,
                discount: 15,
                stock: 32,
                tags: ['makhana', 'savory', 'pepper', 'sesame', 'roasted'],
                isActive: true
            },
            {
                name: 'Organic Jaggery & Fennel Seed Makhāna',
                slug: 'organic-jaggery-fennel-seed-makhana',
                description: 'Slow-glazed with warm organic sugarcane jaggery (gud) and infused with crushed sweet green fennel seeds.',
                brand: 'makhāna',
                sku: 'MKH-OJF-04',
                category: categoryMap.get('sweet'),
                type: 'makhana',
                netWeight: 100,
                ingredients: ['Organic Makhana', 'Sugarcane Jaggery', 'Green Fennel Seeds', 'Dry Ginger Powder', 'Pure A2 Cow Ghee'],
                shelfLife: '6 Months',
                flavorProfile: 'Sweet',
                nutritionalValues: { calories: 385, protein: 8.5, carbohydrates: 84.0, fat: 1.2, fiber: 12.0 },
                images: ['https://images.unsplash.com/photo-1588165171080-c89acfa5ee83?q=80&w=800'],
                price: 150,
                discount: 15,
                stock: 15,
                tags: ['makhana', 'sweet', 'jaggery', 'gud', 'fennel'],
                isActive: true
            },
            {
                name: 'Cooling Mint & Mountain Herb Makhāna',
                slug: 'cooling-mint-mountain-herb-makhana',
                description: 'Infused with powdered wild mint leaves, earthy oregano, and a touch of tangy mango powder for a refreshing after-taste.',
                brand: 'makhāna',
                sku: 'MKH-CMM-05',
                category: categoryMap.get('savory'),
                type: 'makhana',
                netWeight: 80,
                ingredients: ['Organic Makhana', 'Dried Mint Leaves', 'Oregano', 'Dry Mango Powder (Amchur)', 'Olive Oil'],
                shelfLife: '6 Months',
                flavorProfile: 'Savory',
                nutritionalValues: { calories: 348, protein: 9.6, carbohydrates: 76.5, fat: 0.2, fiber: 14.6 },
                images: ['https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=800'],
                price: 130,
                discount: 15,
                stock: 40,
                tags: ['makhana', 'savory', 'mint', 'herb', 'roasted'],
                isActive: true
            },
            {
                name: 'Creamy Cheddar & Basil Dust Makhāna',
                slug: 'creamy-cheddar-basil-dust-makhana',
                description: 'Dusted with mature cheddar cheese powder and sweet Mediterranean sweet basil leaves. A rich cheese gourmet treat.',
                brand: 'makhāna',
                sku: 'MKH-CCB-06',
                category: categoryMap.get('savory'),
                type: 'makhana',
                netWeight: 80,
                ingredients: ['Organic Makhana', 'Cheddar Cheese Powder', 'Dried Sweet Basil', 'Garlic Powder', 'Coconut Oil'],
                shelfLife: '6 Months',
                flavorProfile: 'Savory',
                nutritionalValues: { calories: 370, protein: 10.2, carbohydrates: 73.0, fat: 2.1, fiber: 13.5 },
                images: ['https://images.unsplash.com/photo-1484723091739-30a097e8f929?q=80&w=800'],
                price: 145,
                discount: 15,
                stock: 12,
                tags: ['makhana', 'savory', 'cheese', 'cheddar', 'basil'],
                isActive: true
            },
            {
                name: 'Wellness Assortment Makhāna Box',
                slug: 'wellness-assortment-makhana-box',
                description: 'A premium, eco-friendly curation of our four signature flavors packed in beautiful airtight glass canisters. Ideal for gifting.',
                brand: 'makhāna',
                sku: 'MKH-WAB-07',
                category: categoryMap.get('assortments'),
                type: 'makhana',
                netWeight: 320,
                ingredients: ['Classic Salt Jar (80g)', 'Chili Lime Jar (80g)', 'Jaggery Fennel Jar (80g)', 'Mint Herb Jar (80g)'],
                shelfLife: '9 Months',
                flavorProfile: 'Assortments',
                nutritionalValues: { calories: 361, protein: 9.3, carbohydrates: 78.2, fat: 0.5, fiber: 13.8 },
                images: ['https://images.unsplash.com/photo-1607344645866-009c320c5ab8?q=80&w=800'],
                price: 499,
                discount: 15,
                stock: 25,
                tags: ['makhana', 'assortment', 'gift box', 'premium', 'wellness'],
                isActive: true
            }
        ];

        const created = await Product.insertMany(makhanaProducts);
        console.log(`Successfully seeded ${created.length} products`);

        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
        process.exit(0);

    } catch (error) {
        console.error('Error seeding products:', error);
        process.exit(1);
    }
};

seedProducts();
