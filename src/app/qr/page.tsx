// app/qr/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { setActiveTable } from "@/lib/table-session";

export default function QRLanding() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    // รองรับหลายชื่อพารามิเตอร์: ?tableId= / ?table= / ?t=
    const tableId =
      params.get("tableId") || params.get("table") || params.get("t") || "";
    // optional: ชื่อโต๊ะที่ฝังมาใน QR: ?name=T2
    const tableName = params.get("name") || undefined;

    if (tableId) {
      setActiveTable({ id: tableId, name: tableName });
      // ส่งต่อไปหน้าเมนูพร้อม query เดิม เพื่อ guest เข้าเมนูได้
      router.replace(`/menu?tableId=${encodeURIComponent(tableId)}`);
    } else {
      // ถ้าไม่มี tableId ให้กลับเมนูปกติ (หรือแสดง error)
      router.replace("/menu");
    }
  }, [params, router]);

  return (
    <div className="min-h-[60vh] grid place-items-center text-center text-muted-foreground">
      กำลังเตรียมโต๊ะของคุณ…
    </div>
  );
}
