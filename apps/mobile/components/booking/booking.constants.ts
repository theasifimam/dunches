export const TABLE_LAYOUT = [
  { id: "W1", row: 1, capacity: 2 },
  { id: "W2", row: 1, capacity: 2 },
  { id: "W3", row: 1, capacity: 2 },
  { id: "W4", row: 1, capacity: 2 },
  { id: "W5", row: 1, capacity: 2 },
  { id: "C1", row: 2, capacity: 4 },
  { id: "C2", row: 2, capacity: 4 },
  { id: "C3", row: 2, capacity: 4 },
  { id: "C4", row: 2, capacity: 4 },
  { id: "B1", row: 3, capacity: 6 },
  { id: "B2", row: 3, capacity: 6 },
  { id: "B3", row: 3, capacity: 6 },
];

export const TIME_SLOTS = [
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
  "7:00 PM",
  "8:00 PM",
  "9:00 PM",
];

export const VEHICLES = ["Car", "Motorcycle", "Bus", "None"];

export const MENU_ITEMS = [
  {
    id: "m1",
    name: "Mughl Biryani",
    price: 18.99,
    category: "Main",
    image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=300&auto=format&fit=crop",
  },
  {
    id: "m2",
    name: "Seekh Kebab Platter",
    price: 14.99,
    category: "Starter",
    image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=300&auto=format&fit=crop",
  },
  {
    id: "m3",
    name: "Butter Naan",
    price: 3.99,
    category: "Bread",
    image: "https://images.unsplash.com/photo-1626082895617-2c6b4122d41b?q=80&w=300&auto=format&fit=crop",
  },
  {
    id: "m4",
    name: "Plane Naan",
    price: 1.99,
    category: "Bread",
    image: "https://images.unsplash.com/photo-1626082895617-2c6b4122d41b?q=80&w=300&auto=format&fit=crop",
  },
  {
    id: "m11",
    name: "Dal Makhani",
    price: 9.99,
    category: "Main",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=300&auto=format&fit=crop"
  },
  {
    id: "m5",
    name: "Shahi Paneer",
    price: 12.99,
    category: "Main",
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc0?q=80&w=300&auto=format&fit=crop",
  },
  {
    id: "m6",
    name: "Masala Chai",
    price: 3.49,
    category: "Drink",
    image: "https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?q=80&w=300&auto=format&fit=crop",
  },
  {
    id: "m7",
    name: "Mango Lassi",
    price: 4.99,
    category: "Drink",
    image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?q=80&w=300&auto=format&fit=crop",
  },
  {
    id: "m8",
    name: "Gulab Jamun",
    price: 5.99,
    category: "Dessert",
    image: "https://images.unsplash.com/photo-1517244683847-7456b63c5969?q=80&w=300&auto=format&fit=crop",
  },
  {
    id: "m9",
    name: "Raita",
    price: 2.99,
    category: "Side",
    image: "https://images.unsplash.com/photo-1505253758473-96b7015fcd40?q=80&w=300&auto=format&fit=crop"
  },
  {
    id: "m10",
    name: "Tandoori Chicken",
    price: 16.99,
    category: "Starter",
    image: "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?q=80&w=300&auto=format&fit=crop",
  },
];

export const MENU_CATEGORIES = [
  "Starter",
  "Main",
  "Bread",
  "Side",
  "Drink",
  "Dessert",
];

export const STEP_LABELS = ["When", "Where", "Meals", "Payment"];
export const RESERVATION_FEE = 5.0;

export interface CartItem {
  id: string;
  qty: number;
}

export function makeDaysList() {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      date: d,
      dayName: days[d.getDay()],
      dayNum: d.getDate(),
      month: d.toLocaleString("en-US", { month: "short" }),
    };
  });
}

export function genRef(tableId: string, time: string) {
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `MG-${tableId}-${time.replace(/[\s:]/g, "")}-${rand}`;
}
