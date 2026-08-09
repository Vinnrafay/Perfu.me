import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";

interface ProductCardProps {
  image?: string;
  gender?: string;
  name?: string;
  price?: number;
};

export default function ProductCard({ image, gender, name, price }: ProductCardProps) {
  return (
    <div className="space-y-3">
      <div className="w-full rounded-2xl overflow-hidden">
        <img src={image}
          alt="Product Image" className="bg-muted w-full aspect-square object-cover object-center" />
      </div>
      <div className="space-y-1">
        <div>
          <p className="text-sm text-muted-foreground">{gender}</p>
          <h3 className="text-xl font-semibold">{name}</h3>
        </div>
        <span className="text-base font-medium font-heading">Rp {price?.toLocaleString('id-ID')}</span>
      </div>
    </div>
  )
}
