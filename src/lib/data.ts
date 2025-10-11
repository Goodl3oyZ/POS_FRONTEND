// ------------------ TYPES ------------------
export interface MenuItem {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  options?: MenuOption[];
  extras?: ExtraItem[]; // เพิ่มตรงนี้
}

export interface MenuOption {
  name: string;
  choices: { label: string; price: number }[];
}

export interface ExtraItem {
  label: string;
  price: number;
}

export interface OrderItem {
  menuItem: MenuItem;
  quantity: number;
  selectedOptions?: Record<string, string>;
  selectedExtras?: ExtraItem[];
}

export interface Order {
  id: string;
  tableId: string;
  items: OrderItem[];
  status: "Preparing" | "Done" | "Cancelled";
  total: number;
  createdAt: string;
}

export interface Table {
  id: string;
  zone: string;
  status: "Available" | "Occupied" | "Billing" | "Paid";
  capacity: number;
  currentOrder?: Order;
}

export interface Bill {
  id: string;
  time: string;
  total: number;
  method: "Cash" | "QR";
  serviceCharge: number;
  vat: number;
  subTotal: number;
  items: BillMenuItem[]; // แทน menu[] ด้วย type ที่มี quantity + extras
  tableId: string;
}

export interface BillMenuItem {
  menuItem: MenuItem;
  quantity: number;
  selectedOptions?: Record<string, string>;
  selectedExtras?: ExtraItem[];
}

// ------------------ MENU ITEMS ------------------
export const menuItems: MenuItem[] = [
  {
    id: 1,
    name: "Pad Thai",
    price: 120,
    description:
      "Authentic Thai stir-fried rice noodles with shrimp, tofu, and peanuts",
    image: "/images/foodImageHolder.jpg",
    category: "Main",
    options: [
      {
        name: "Protein",
        choices: [
          { label: "Shrimp", price: 0 },
          { label: "Chicken", price: -10 },
          { label: "Tofu", price: -20 },
        ],
      },
      {
        name: "Spiciness",
        choices: [
          { label: "Mild", price: 0 },
          { label: "Medium", price: 0 },
          { label: "Hot", price: 0 },
        ],
      },
    ],
    extras: [
      { label: "Cheese", price: 10 },
      { label: "Egg", price: 15 },
      { label: "Bacon", price: 25 },
    ],
  },
  {
    id: 2,
    name: "Green Curry",
    price: 130,
    description: "Thai green curry with vegetables and your choice of protein",
    image: "/images/foodImageHolder.jpg",
    category: "Main",
    options: [
      {
        name: "Protein",
        choices: [
          { label: "Chicken", price: 0 },
          { label: "Tofu", price: -10 },
        ],
      },
      {
        name: "Spiciness",
        choices: [
          { label: "Mild", price: 0 },
          { label: "Medium", price: 0 },
          { label: "Hot", price: 0 },
        ],
      },
    ],
    extras: [
      { label: "Basil", price: 5 },
      { label: "Extra Coconut Milk", price: 20 },
    ],
  },
  {
    id: 3,
    name: "Tom Yum Goong",
    price: 180,
    description: "Spicy and sour soup with prawns, mushrooms, and lemongrass",
    image: "/images/foodImageHolder.jpg",
    category: "Soup",
    options: [
      {
        name: "Spiciness",
        choices: [
          { label: "Mild", price: 0 },
          { label: "Medium", price: 0 },
          { label: "Extra Hot", price: 10 },
        ],
      },
      {
        name: "Add-ons",
        choices: [
          { label: "Extra Shrimp", price: 30 },
          { label: "Mushrooms", price: 10 },
        ],
      },
    ],
    extras: [
      { label: "Lime", price: 5 },
      { label: "Cilantro", price: 5 },
    ],
  },
  {
    id: 4,
    name: "Som Tam",
    price: 90,
    description: "Spicy green papaya salad with peanuts and dried shrimp",
    image: "/images/foodImageHolder.jpg",
    category: "Appetizer",
  },
  {
    id: 5,
    name: "Mango Sticky Rice",
    price: 100,
    description: "Sweet ripe mango with coconut sticky rice and coconut cream",
    image: "/images/foodImageHolder.jpg",
    category: "Dessert",
  },
  {
    id: 6,
    name: "Thai Ice Tea",
    price: 50,
    description: "Refreshing Thai iced tea with milk and sugar",
    image: "/images/foodImageHolder.jpg",
    category: "Drink",
  },
  {
    id: 7,
    name: "Thai Coffee",
    price: 60,
    description: "Strong Thai-style coffee served over ice or hot",
    image: "/images/foodImageHolder.jpg",
    category: "Drink",
  },
  {
    id: 8,
    name: "Grilled Fish",
    price: 310,
    description: "Whole grilled fish seasoned with Thai herbs and chili sauce",
    image: "/images/foodImageHolder.jpg",
    category: "Main",
  },
];

export const orders: Order[] = [
  {
    id: "ORD001",
    tableId: "T02",
    items: [
      {
        menuItem: menuItems.find((m) => m.name === "Pad Thai")!,
        quantity: 2,
        selectedOptions: { Protein: "Shrimp", Spiciness: "Medium" },
        selectedExtras: [{ label: "Cheese", price: 10 }],
      },
      {
        menuItem: menuItems.find((m) => m.name === "Green Curry")!,
        quantity: 1,
        selectedOptions: { Protein: "Chicken", Spiciness: "Mild" },
      },
    ],
    status: "Preparing",
    total: 390,
    createdAt: "2025-09-29T10:30:00",
  },
  {
    id: "ORD002",
    tableId: "G02",
    items: [
      {
        menuItem: menuItems.find((m) => m.name === "Tom Yum Goong")!,
        quantity: 1,
        selectedOptions: { Spiciness: "Extra Hot" },
        selectedExtras: [{ label: "Lime", price: 5 }],
      },
      {
        menuItem: menuItems.find((m) => m.name === "Som Tam")!,
        quantity: 2,
      },
    ],
    status: "Done",
    total: 360,
    createdAt: "2025-09-29T11:15:00",
  },
];

// ------------------ TABLES ------------------
export const tables: Table[] = [
  {
    id: "T01",
    zone: "Indoor",
    status: "Available",
    capacity: 2,
  },
  {
    id: "T02",
    zone: "Indoor",
    status: "Occupied",
    capacity: 2,
    currentOrder: orders.find((o) => o.id === "ORD001"),
  },
  {
    id: "T03",
    zone: "Indoor",
    status: "Available",
    capacity: 4,
  },
  {
    id: "T04",
    zone: "Indoor",
    status: "Occupied",
    capacity: 4,
  },
  {
    id: "T05",
    zone: "Indoor",
    status: "Available",
    capacity: 4,
  },
  {
    id: "T06",
    zone: "Indoor",
    status: "Billing",
    capacity: 6,
  },
  {
    id: "T07",
    zone: "Indoor",
    status: "Paid",
    capacity: 6,
  },
  {
    id: "T08",
    zone: "Indoor",
    status: "Available",
    capacity: 8,
  },

  // Garden Zone
  {
    id: "G01",
    zone: "Garden",
    status: "Available",
    capacity: 2,
  },
  {
    id: "G02",
    zone: "Garden",
    status: "Occupied",
    capacity: 4,
    currentOrder: orders.find((o) => o.id === "ORD002"),
  },
  {
    id: "G03",
    zone: "Garden",
    status: "Available",
    capacity: 4,
  },
  {
    id: "G04",
    zone: "Garden",
    status: "Available",
    capacity: 6,
  },

  // VIP Zone
  {
    id: "V01",
    zone: "VIP",
    status: "Occupied",
    capacity: 8,
    currentOrder: orders.find((o) => o.id === "ORD003"), // ถ้ามี Order ที่ 3
  },
  {
    id: "V02",
    zone: "VIP",
    status: "Available",
    capacity: 8,
  },
  {
    id: "V03",
    zone: "VIP",
    status: "Available",
    capacity: 10,
  },

  // Bar Zone
  {
    id: "B01",
    zone: "Bar",
    status: "Occupied",
    capacity: 2,
  },
  {
    id: "B02",
    zone: "Bar",
    status: "Available",
    capacity: 2,
  },
  {
    id: "B03",
    zone: "Bar",
    status: "Occupied",
    capacity: 2,
  },
  {
    id: "B04",
    zone: "Bar",
    status: "Available",
    capacity: 2,
  },
  {
    id: "B05",
    zone: "Bar",
    status: "Paid",
    capacity: 2,
  },
];

// ฟังก์ชันช่วยหา menuItem จากชื่อ
const findMenuItem = (name: string) => menuItems.find((m) => m.name === name)!;

// ตัวอย่าง selectedOptions / extras
const sampleOptions = {
  "Pad Thai": { Protein: "Shrimp", Spiciness: "Medium" },
  "Green Curry": { Protein: "Chicken", Spiciness: "Hot" },
  "Tom Yum Goong": { Spiciness: "Extra Hot", "Add-ons": "Extra Shrimp" },
};

const sampleExtras = {
  "Pad Thai": [{ label: "Cheese", price: 10 }],
  "Green Curry": [{ label: "Extra Coconut Milk", price: 20 }],
  "Tom Yum Goong": [{ label: "Lime", price: 5 }],
};

export const bills: Bill[] = [
  {
    id: "B001",
    time: "2025-09-25T12:30:00",
    tableId: "T02",
    method: "Cash",
    items: [
      {
        menuItem: findMenuItem("Pad Thai"),
        quantity: 2,
        selectedOptions: sampleOptions["Pad Thai"],
        selectedExtras: sampleExtras["Pad Thai"],
      },
      {
        menuItem: findMenuItem("Green Curry"),
        quantity: 2,
        selectedOptions: sampleOptions["Green Curry"],
        selectedExtras: sampleExtras["Green Curry"],
      },
      {
        menuItem: findMenuItem("Thai Ice Tea"),
        quantity: 2,
      },
    ],
    subTotal: 640,
    serviceCharge: 64,
    vat: 45,
    total: 749,
  },
  {
    id: "B002",
    time: "2025-09-26T18:10:00",
    tableId: "T03",
    method: "QR",
    items: [
      {
        menuItem: findMenuItem("Mango Sticky Rice"),
        quantity: 2,
      },
      {
        menuItem: findMenuItem("Thai Coffee"),
        quantity: 2,
      },
    ],
    subTotal: 320,
    serviceCharge: 32,
    vat: 22.5,
    total: 374.5,
  },
  {
    id: "B003",
    time: "2025-09-27T19:45:00",
    tableId: "T06",
    method: "Cash",
    items: [
      {
        menuItem: findMenuItem("Tom Yum Goong"),
        quantity: 2,
        selectedOptions: sampleOptions["Tom Yum Goong"],
        selectedExtras: sampleExtras["Tom Yum Goong"],
      },
      {
        menuItem: findMenuItem("Som Tam"),
        quantity: 2,
      },
      {
        menuItem: findMenuItem("Grilled Fish"),
        quantity: 1,
      },
    ],
    subTotal: 850,
    serviceCharge: 85,
    vat: 60.11,
    total: 995.11,
  },
];

// ------------------ CURRENT BILL ------------------
export const currentBill: Bill = {
  id: "B004",
  time: new Date().toISOString(),
  tableId: "T04",
  method: "Cash",
  items: [
    {
      menuItem: findMenuItem("Pad Thai"),
      quantity: 2,
      selectedOptions: sampleOptions["Pad Thai"],
      selectedExtras: sampleExtras["Pad Thai"],
    },
    {
      menuItem: findMenuItem("Tom Yum Goong"),
      quantity: 1,
      selectedOptions: sampleOptions["Tom Yum Goong"],
      selectedExtras: sampleExtras["Tom Yum Goong"],
    },
    {
      menuItem: findMenuItem("Som Tam"),
      quantity: 2,
    },
    {
      menuItem: findMenuItem("Thai Ice Tea"),
      quantity: 4,
    },
  ],
  subTotal: 740,
  serviceCharge: 74,
  vat: 51.8,
  total: 865.8,
};
