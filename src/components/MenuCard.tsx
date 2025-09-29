"use client";

import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Badge } from "./ui/badge";
import { formatPrice } from "@/lib/utils";

interface MenuItem {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
}

interface MenuCardProps {
  item: MenuItem;
  onAddToCart?: () => void;
}

export function MenuCard({ item, onAddToCart }: MenuCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
      <div className="relative h-48">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover"
          priority
        />
        <Badge className="absolute top-2 right-2 bg-white/90 text-gray-800 hover:bg-white/90">
          {item.category}
        </Badge>
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg">{item.name}</h3>
          <span className="font-medium text-green-600">
            {formatPrice(item.price)}
          </span>
        </div>
        <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          onClick={onAddToCart}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
