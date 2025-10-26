"use client";
import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw } from "lucide-react";
import { getPaymentById } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import { transformImageUrl } from "@/lib/utils/image-url";

export default function PaymentStatusPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [payment, setPayment] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [polling, setPolling] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const refresh = async () => {
    if (!id) return;
    try {
      setPolling(true);
      const res = await getPaymentById(String(id));
      setPayment(res.data ?? null);
      setError(null);
    } catch (e) {
      console.error(e);
      setError("ไม่สามารถโหลดสถานะการชำระเงินได้");
    } finally {
      setPolling(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      try {
        setLoading(true);
        await refresh();
      } finally {
        if (mounted) setLoading(false);
      }
    };
    run();
    // Poll every 5s until terminal state
    timerRef.current = setInterval(() => {
      const status = (payment?.status ?? "").toLowerCase();
      if (["paid", "succeeded", "failed"].includes(status)) {
        if (timerRef.current) clearInterval(timerRef.current);
      } else {
        refresh();
      }
    }, 5000);
    return () => {
      mounted = false;
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const status = (payment?.status ?? "").toLowerCase();
  const isPaid = status === "paid" || status === "succeeded";
  const isFailed = status === "failed";

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px] text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading payment...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center min-h-[300px] flex items-center justify-center">
        <div className="space-y-3">
          <p className="text-red-600">{error}</p>
          <Button variant="outline" onClick={() => router.back()}>
            กลับ
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Payment #{String(id)}</h2>
        <div className="text-sm text-muted-foreground">
          Status: {payment?.status ?? "—"}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span>Order</span>
            <span>#{payment?.order_id ?? payment?.orderId ?? "—"}</span>
          </div>
          <div className="flex justify-between">
            <span>Amount</span>
            <span>{formatPrice(Number(payment?.amount ?? 0))}</span>
          </div>
          <div className="flex justify-between">
            <span>Method</span>
            <span>{payment?.method ?? "—"}</span>
          </div>
        </CardContent>
      </Card>

      {payment?.qr_image_url ? (
        <Card>
          <CardHeader>
            <CardTitle>Scan QR to Pay</CardTitle>
          </CardHeader>
          <CardContent>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={transformImageUrl(payment.qr_image_url) || ""}
              alt="Payment QR"
              className="mx-auto max-w-xs"
            />
          </CardContent>
        </Card>
      ) : null}

      <div className="flex gap-2">
        <Button onClick={refresh} variant="outline" disabled={polling}>
          <RefreshCw className="h-4 w-4 mr-2" />{" "}
          {polling ? "Refreshing..." : "Refresh"}
        </Button>
        {isPaid ? (
          <Button
            className="bg-green-600 hover:bg-green-700"
            onClick={() => router.push("/orders")}
          >
            เสร็จสิ้น
          </Button>
        ) : isFailed ? (
          <Button
            variant="destructive"
            onClick={() =>
              router.push(
                "/payment?orderId=" +
                  (payment?.order_id ?? payment?.orderId ?? "")
              )
            }
          >
            ลองอีกครั้ง
          </Button>
        ) : null}
      </div>
    </div>
  );
}
