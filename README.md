# 🍽️ POS Frontend - Restaurant Point of Sale System

## 📋 Project Overview

ระบบ **Point of Sale (POS) Frontend** สำหรับร้านอาหารที่ออกแบบมาเพื่อจัดการออเดอร์ โต๊ะ เมนู การชำระเงิน และการจัดการพนักงาน ผ่านเว็บอินเทอร์เฟซที่ใช้งานง่าย

### 🎯 ฟีเจอร์หลัก

- **📱 Responsive Design** - ใช้งานได้บน Desktop, Tablet และ Mobile
- **🛒 Shopping Cart** - เพิ่ม/ลบสินค้า ปรับจำนวน
- **📊 Order Management** - ติดตามออเดอร์ ดูประวัติการสั่งซื้อ
- **🍽️ Table Management** - จัดการโต๊ะและที่นั่ง
- **👥 Staff Management** - บทบาทและสิทธิ์ผู้ใช้
- **📈 Analytics** - รายงานยอดขายและสถิติเมนู
- **💳 Payment Processing** - วิธีการชำระเงินหลากหลาย
- **🔐 Authentication** - ระบบล็อกอินและจัดการผู้ใช้

---

## 👥 Team Members(CPE CMU_261497 SEC003)

- **Phanudet Sueaphueak 650610797** - Frontend Developer
- **Pubest Ruengkum 650610798** - Backend Developer
- **Korarit Punnopasri 650610744** - Frontend Developer

---

## 🛠️ Technology Stack

### Frontend

- **Framework**: Next.js 14.0.0 (React 18.2.0)
- **Language**: TypeScript 5.2.2
- **Styling**: Tailwind CSS 3.3.3
- **UI Components**: Radix UI, Headless UI
- **State Management**: React Context API
- **HTTP Client**: Axios 1.12.2
- **Charts**: Recharts 3.2.1
- **Animations**: Framer Motion 12.23.24
- **Icons**: Lucide React 0.284.0

### Backend Integration

- **API**: RESTful API (Node.js/Express backend)
- **Authentication**: JWT Token-based
- **HTTP Client**: Axios with interceptors
- **Base URL**: Configurable via environment variables

### Development Tools

- **Package Manager**: pnpm (preferred) / npm
- **Linting**: ESLint 8.51.0
- **Build Tool**: Next.js built-in
- **Containerization**: Docker & Docker Compose

### Database

- **Backend Database**: [Backend team to specify - likely PostgreSQL/MySQL]
- **API Endpoints**: RESTful endpoints for all CRUD operations

---

## 🚀 Quick Start Guide

### Prerequisites

- **Node.js** 18.x or higher
- **pnpm** (recommended) or **npm**
- **Docker** (for containerized deployment)
- **Git**

### 1. Clone the Repository

```bash
git clone <repository-url>
cd pos-frontend
```

### 2. Install Dependencies

```bash
# Using pnpm (recommended)
pnpm install

# Or using npm
npm install
```

### 3. Environment Setup

Create a `.env.local` file in the project root:

```bash
# Development Environment
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_DEFAULT_TABLE_ID=TAKEAWAY
```

### 4. Start Development Server

```bash
# Using pnpm
pnpm dev

# Or using npm
npm run dev
```

### 5. Access the Application

- **Main Application**: http://localhost:3000
- **Menu Page**: http://localhost:3000/menu
- **Login Page**: http://localhost:3000/login
- **Cart**: http://localhost:3000/cart
- **Orders**: http://localhost:3000/orders
- **Tables**: http://localhost:3000/tables

---

## 🐳 Docker Deployment

### Quick Start with Docker

1. **Create Environment File**:

```bash
cat > .env << EOF
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_DEFAULT_TABLE_ID=TAKEAWAY
EOF
```

2. **Build and Run**:

```bash
# Build and start the container
docker-compose up --build

# Or run in background
docker-compose up -d --build

# View logs
docker-compose logs -f pos-frontend

# Stop containers
docker-compose down
```

---

## 📊 Database Seeding

### Initial Data Setup

ระบบต้องการข้อมูลเริ่มต้นสำหรับ:

1. **User Roles & Permissions** - บทบาทและสิทธิ์ผู้ใช้
2. **Menu Categories** - หมวดหมู่เมนู
3. **Sample Menu Items** - ตัวอย่างรายการเมนู
4. **Table Configuration** - การตั้งค่าโต๊ะ
5. **Payment Methods** - วิธีการชำระเงิน
6. **Store Settings** - การตั้งค่าร้าน

---

## 🔧 Development Commands

```bash
# Development
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run ESLint

# Docker
docker-compose up --build    # Build and run with Docker
docker-compose down          # Stop containers
docker-compose logs -f       # View logs
```

---

## 🌐 Environment Variables

| Variable                       | Required | Default                 | Description              |
| ------------------------------ | -------- | ----------------------- | ------------------------ |
| `NEXT_PUBLIC_API_URL`          | ✅ Yes   | `http://localhost:8080` | Backend API base URL     |
| `NEXT_PUBLIC_DEFAULT_TABLE_ID` | ⚠️ Rec   | `TAKEAWAY`              | Default table for orders |
| `PORT`                         | ❌ No    | `3000`                  | Container port           |
| `NODE_ENV`                     | ❌ Auto  | `production`            | Node environment         |

---
