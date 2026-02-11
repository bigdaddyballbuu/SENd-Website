# SENd Website (เว็บไซต์ SENd Service)

เว็บไซต์สำหรับบริการรับ-ส่งซักอบรีด **SENd Service** พัฒนาด้วย **React + TypeScript + Vite**

---

## 🛠️ เทคโนโลยีที่ใช้ (Tech Stack)

โปรเจคนี้พัฒนาโดยใช้เครื่องมือและไลบรารีที่ทันสมัย ดังนี้:

- **Core:** React 19, TypeScript, Vite
- **Styling:** TailwindCSS v4, Framer Motion (Animation)
- **State & Logic:** React Hook Form, Zod (Validation), i18next (Multi-language)
- **Database & Backend:** Supabase
- **Maps:** Leaflet, React Leaflet
- **Icons:** Lucide React

---

## 📋 สิ่งที่ต้องมีในเครื่อง (Prerequisites)

ก่อนเริ่มใช้งาน ต้องติดตั้งโปรแกรมเหล่านี้ก่อน:

1.  **Node.js** (แนะนำเวอร์ชัน 18 หรือใหม่กว่า) - [ดาวน์โหลดที่นี่](https://nodejs.org/)
2.  **Git** - [ดาวน์โหลดที่นี่](https://git-scm.com/)
3.  **VS Code** (Editor แนะนำ)

---

## 🚀 วิธีติดตั้งและรันโปรเจค (Installation & Usage)

### 1. ติดตั้ง Dependencies (ครั้งแรกเท่านั้น)

เปิด Terminal ในโฟลเดอร์โปรเจค แล้วพิมพ์คำสั่ง:

```bash
npm install
```

_(คำสั่งนี้จะโหลดไลบรารีที่จำเป็นทั้งหมดมาให้)_

### 2. รันเว็บในเครื่อง (โหมดพัฒนา)

สำหรับรันดูหน้าเว็บพร้อมแก้ไขโค้ดได้ทันที (Hot Reload):

```bash
npm run dev
```

แล้วกดเปิดลิงค์ `http://localhost:5173/` ใน Web Browser ได้เลย

---

## 📦 คำสั่งสำหรับนำไปใช้งานจริง (Production Build)

เมื่อพัฒนาเสร็จแล้ว และต้องการไฟล์สำหรับนำไปขึ้น Server (Hosting):

```bash
npm run build
```

ไฟล์ที่ได้จะอยู่ในโฟลเดอร์ `dist/` ซึ่งสามารถนำไปอัพโหลดขึ้น Hosting ได้เลย

---

## 📂 โครงสร้างโปรเจค (Project Structure)

- `src/` - โค้ดทั้งหมดของเว็บ
  - `components/` - ชิ้นส่วนย่อยๆ ของหน้าเว็บ (เช่น Navbar, ปุ่ม, การ์ด)
  - `pages/` - หน้าหลักแต่ละหน้า (Home, About, LaundryPage ฯลฯ)
  - `assets/` - รูปภาพและไฟล์อื่นๆ
  - `lib/` - ไฟล์ config ต่างๆ (เช่น supabase.ts)
  - `App.tsx` - จุดเริ่มต้นหลักของแอป
- `public/` - ไฟล์สาธารณะ (เช่น favicon)
