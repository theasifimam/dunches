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

const seedCategories = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // Delete existing categories
        await Category.deleteMany({});
        console.log('Cleared existing categories');

        const categoriesToCreate = [
            { name: "Classic", slug: "classic", image: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?q=80&w=800" },
            { name: "Savory", slug: "savory", image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=800" },
            { name: "Spicy", slug: "spicy", image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=800" },
            { name: "Sweet", slug: "sweet", image: "https://images.unsplash.com/photo-1588165171080-c89acfa5ee83?q=80&w=800" },
            { name: "Assortments", slug: "assortments", image: "https://images.unsplash.com/photo-1607344645866-009c320c5ab8?q=80&w=800" }
        ];

        const created = await Category.insertMany(categoriesToCreate);
        console.log(`Successfully seeded ${created.length} snack categories`);

        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
        process.exit(0);

    } catch (error) {
        console.error('Error seeding categories:', error);
        process.exit(1);
    }
};

seedCategories();
