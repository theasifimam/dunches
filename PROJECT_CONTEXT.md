# Project Overview & Context: Dunches Spicy Snacks Store

Welcome to the **Dunches** project, a premium monorepo workspace dedicated to bringing bold, fiery crunch through organic snacks. Dunches stands for Dusk Munches (D for Dusk and unches for Munches). Currently, the store specializes in premium organic roasted lotus seeds (makhana) infused with spicy chilies, savory sesame, and sweet jaggery glazes, with structural support for other healthy, spicy snacks.

---

## 1. Directory Architecture

The workspace is managed as a monorepo containing front-end interfaces, administration hubs, and a database layer:

*   **`apps/web/`**: Next.js customer-facing storefront. Features a beautiful, distraction-free purchasing interface.
*   **`apps/admin/`**: Next.js administrative console. Monitors sales metrics, inventory levels, banner campaigns, and subscribers.
*   **`backend/`**: Node.js Express server handling MongoDB connection, user validation, orders, categories, and analytics.

---

## 2. Design System & Aesthetics (Spicy Snacking)

Both web and admin applications share a curated, high-end bold brand identity designed to feel spicy, energetic, and premium:

*   **Core Palette**:
    *   `--background`: `#FAF7F2` (Creamy soft canvas) / `#161210` (Warm dark chili charcoal)
    *   `--foreground`: `#2E2E2E` / `#F4EAE6` (Contrast text)
    *   `--primary`: `#C83E2D` / `--primary-hover`: `#A52E20` (Fiery crimson red)
    *   `--accent`: `#DD6B20` / `#F6AD55` (Fiery sunset orange)
    *   `--border`: `#E8E2D5` / `#352825` (Soft warm borders)
*   **Design Accents**:
    *   **Icons**: Replacing standard botanical icons with `Flame` logos representing hot, crisp spices.
    *   **Border Radius**: Aggressively rounded pill corners (`--radius: 2rem` / `rounded-4xl`) for elements, inputs, and modals.
    *   **Texture**: Subtle visual noise overlay (`.bg-grain`) mimicking organic texture.
    *   **Shading**: Backdrop-blur glassmorphism panels (`.glass`) and modern low-contrast shadows (`.modern-shadow`).
*   **Typography**:
    *   *Body*: **Plus Jakarta Sans** (clean, modern geometric sans-serif)
    *   *Accents*: **Lora** (premium serif elegance)
    *   *Headers*: **Syne** (artistic, expressive bold headings)

---

## 3. Simplified Customer Purchase Flow

Buying snacks is designed to be **as frictionless and simple as possible**:

1.  **Selection**: The user browses flavor categories (Classic, Savory, Spicy, Sweet, Assortments) and adds items to the cart in 1-click.
2.  **Cart Summary**: Review order invoice values. Logistic fees are completely complimentary (free delivery).
3.  **Authentication Draw**: Clicking *Checkout* slide-triggers a smooth sliding drawer `AuthModal`.
4.  **OTP Login**: Authentication requires a 10-digit mobile number. Enter code to immediately verify. No passwords or heavy signup fields are required.
5.  **Immediate Checkout**: Upon verification, checkout completes instantly. Order is placed, and the user is redirected to their profile.

---

## 4. Admin Console Capabilities

Customized explicitly for healthy snacks management:

*   **Sales Hub**: Monitor total revenue performance, customer acquisition growth rates, and active shipments.
*   **Categories**: Custom categories correspond to the snack flavor profiles (Classic, Savory, Spicy, Sweet, Assortments).
*   **Product Blueprints**: Every item is cataloged with snack parameters:
    *   *General*: Category, Title, URL Slug, SKU, Brand
    *   *Specs*: Archetype type (e.g. makhana, chips, nuts), Net weight (grams), Shelf life, Flavor Profile classification, and Ingredients.
    *   *Nutrition*: Serving-size calibration including Calories, Protein, Carbs, Fats, and Dietary Fiber.
*   **Marketing & Engagement**: Manage hero promotional slider campaigns (Banners) and mailing list subscribers.

---

## 5. Local Setup & Seeding

### Backend Database (MongoDB)
Unifies database parameters onto `/eatables` database. To seed the database with the core premium lotus seed flavors:
```bash
cd backend
npm install
node seed-categories.js
node seed-products.js
```

### Running Applications
1.  **API Backend**:
    ```bash
    cd backend
    npm run dev  # Starts on http://localhost:5000
    ```
2.  **Web Storefront**:
    ```bash
    cd apps/web
    npm run dev  # Starts on http://localhost:3000
    ```
3.  **Admin Console**:
    ```bash
    cd apps/admin
    npm run dev  # Starts on http://localhost:3001
    ```
