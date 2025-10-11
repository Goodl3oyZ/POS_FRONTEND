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
  name: string;
  quantity: number;
  price: number;
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

export interface BillItem {
  name: string;
  qty: number;
  price: number;
}

export interface Bill {
  id: string;
  time: string;
  total: number;
  method: "Cash" | "QR";
  serviceCharge: number;
  vat: number;
  subTotal: number;
  items: BillItem[];
  tableId: string;
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
    currentOrder: {
      id: "ORD001",
      tableId: "T02",
      items: [
        { name: "Pad Thai", quantity: 2, price: 120 },
        { name: "Green Curry", quantity: 1, price: 150 },
      ],
      status: "Preparing",
      total: 390,
      createdAt: "2025-09-29T10:30:00",
    },
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
    currentOrder: {
      id: "ORD002",
      tableId: "G02",
      items: [
        { name: "Tom Yum Goong", quantity: 1, price: 180 },
        { name: "Som Tam", quantity: 2, price: 90 },
      ],
      status: "Done",
      total: 360,
      createdAt: "2025-09-29T11:15:00",
    },
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
    currentOrder: {
      id: "ORD003",
      tableId: "V01",
      items: [
        { name: "Green Curry", quantity: 2, price: 150 },
        { name: "Mango Sticky Rice", quantity: 2, price: 100 },
      ],
      status: "Preparing",
      total: 500,
      createdAt: "2025-09-29T12:00:00",
    },
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

// ------------------ ORDERS ------------------
export const orders: Order[] = [
  {
    id: "ORD001",
    tableId: "T02",
    items: [
      { name: "Pad Thai", quantity: 2, price: 120 },
      { name: "Green Curry", quantity: 1, price: 150 },
    ],
    status: "Preparing",
    total: 390,
    createdAt: "2025-09-29T10:30:00",
  },
  {
    id: "ORD002",
    tableId: "G02",
    items: [
      { name: "Tom Yum Goong", quantity: 1, price: 180 },
      { name: "Som Tam", quantity: 2, price: 90 },
    ],
    status: "Done",
    total: 360,
    createdAt: "2025-09-29T11:15:00",
  },
  {
    id: "ORD003",
    tableId: "V01",
    items: [
      { name: "Green Curry", quantity: 2, price: 150 },
      { name: "Mango Sticky Rice", quantity: 2, price: 100 },
    ],
    status: "Preparing",
    total: 500,
    createdAt: "2025-09-29T12:00:00",
  },
];

// ------------------ BILLS ------------------
export const bills: Bill[] = [
  {
    id: "B001",
    time: "2025-09-25T12:30:00",
    total: 749,
    subTotal: 640,
    serviceCharge: 64,
    vat: 45,
    method: "Cash",
    tableId: "T02",
    items: [
      { name: "Pad Thai", qty: 2, price: 120 },
      { name: "Green Curry", qty: 2, price: 150 },
      { name: "Thai Ice Tea", qty: 2, price: 50 },
    ],
  },
  {
    id: "B002",
    time: "2025-09-26T18:10:00",
    total: 374.5,
    subTotal: 320,
    serviceCharge: 32,
    vat: 22.5,
    method: "QR",
    tableId: "T03",
    items: [
      { name: "Mango Sticky Rice", qty: 2, price: 100 },
      { name: "Thai Coffee", qty: 2, price: 60 },
    ],
  },
  {
    id: "B003",
    time: "2025-09-27T19:45:00",
    total: 995.11,
    subTotal: 850,
    serviceCharge: 85,
    vat: 60.11,
    method: "Cash",
    tableId: "T06",
    items: [
      { name: "Tom Yum Goong", qty: 2, price: 180 },
      { name: "Som Tam", qty: 2, price: 90 },
      { name: "Grilled Fish", qty: 1, price: 310 },
    ],
  },
];

// ------------------ CURRENT BILL ------------------
export const currentBill: Bill = {
  id: "B004",
  time: new Date().toISOString(),
  subTotal: 740,
  serviceCharge: 74,
  vat: 51.8,
  total: 865.8,
  method: "Cash",
  tableId: "T04",
  items: [
    { name: "Pad Thai", qty: 2, price: 120 },
    { name: "Tom Yum Goong", qty: 1, price: 180 },
    { name: "Som Tam", qty: 2, price: 90 },
    { name: "Thai Ice Tea", qty: 4, price: 50 },
  ],
};
