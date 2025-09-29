"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

interface CartItemProps {
  item: {
    id: number;
    name: string;
    price: number;
    quantity: number;
  };
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemove: (id: number) => void;
}

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-medium">{item.name}</h3>
            <p className="text-sm text-gray-600">฿{item.price} each</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-8 text-center font-medium">{item.quantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button
              variant="destructive"
              size="icon"
              className="h-8 w-8 ml-2"
              onClick={() => onRemove(item.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="mt-2 text-right font-medium">
          Total: ฿{item.price * item.quantity}
        </div>
      </CardContent>
    </Card>
  );
}
