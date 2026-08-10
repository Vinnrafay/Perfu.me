import React, { useState } from 'react';
import { Filter, Search, RotateCcw } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

// Tipe data disesuaikan dengan response Controller
interface Product {
  id: number;
  nama: string;
  kategori: string;
  gender: string;
  Varian: string;
  Harga: number;
  Ukuran: number;
  Deskripsi: string;
  Foto: string | null;
  'Best Seller': string;
}

interface Props {
  products: Product[];
}

export default function Catalog({ products = [] }: Props) {
  // State Filter
  const [priceRange, setPriceRange] = useState<number>(500000);
  const [selectedGenders, setSelectedGenders] = useState<string[]>([]);

  // Toggle Checkbox
  const handleCheckbox = (
    value: string,
    isChecked: boolean | string,
    state: string[],
    setState: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (isChecked) {
      setState([...state, value]);
    } else {
      setState(state.filter((item) => item !== value));
    }
  };

  // Reset Filter
  const isFiltered = selectedGenders.length > 0 || priceRange < 500000;
  const resetFilter = () => {
    setSelectedGenders([]);
    setPriceRange(500000);
  };

  // Eksekusi filter data
  const filteredProducts = products.filter((product) => {
    const matchGender = selectedGenders.length === 0 || selectedGenders.includes(product.gender);
    const matchPrice = product.Harga <= priceRange;

    return matchGender && matchPrice;
  });

  return (
    <div className="min-h-screen pb-20 bg-background text-foreground flex flex-col">
      
      {/* Hero Banner Section */}
      <section className="relative w-full h-[40vh] min-h-[380px] flex flex-col items-center justify-center text-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full">
          <img
            src="/images/BannerPageProduct.png"
            alt="Discover Your Scent Background"
            className="w-full h-full object-cover object-center scale-105"
          />
          {/* Subtle Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-black/50 to-black/40" />
        </div>

        {/* Content Banner */}
        <div className="relative z-10 px-6 max-w-2xl mx-auto flex flex-col items-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-light text-white tracking-tight mb-4 capitalize">
            Discover Your <span className="font-heading italic">Scent</span>
          </h1>
          <p className="text-white/80 text-sm md:text-base font-light leading-relaxed max-w-lg">
            Koleksi wewangian eksklusif yang dirancang untuk memperkuat karakter dan kepercayaan dirimu setiap hari.
          </p>
        </div>
      </section>

      {/* Main Content Layout */}
      <div className="container max-w-7xl w-full mx-auto px-5 pt-12 flex flex-col md:flex-row gap-10">
        
        {/* Sidebar Filter */}
        <aside className="w-full md:w-1/4 shrink-0">
          <div className="sticky top-24">
            
            {/* Header Filter & Reset */}
            <div className="flex items-center justify-between mb-6 border-b border-border pb-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <h2 className="text-sm font-semibold tracking-widest uppercase">Filter</h2>
              </div>
              
              {isFiltered && (
                <button
                  onClick={resetFilter}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset
                </button>
              )}
            </div>

            {/* Accordion Filter */}
            <Accordion type="multiple" defaultValue={['gender', 'harga']} className="w-full space-y-2">
              
              {/* Filter Gender */}
              <AccordionItem value="gender" className="border-border">
                <AccordionTrigger className="hover:no-underline text-xs font-semibold uppercase tracking-wider text-foreground py-3">
                  Gender
                </AccordionTrigger>
                <AccordionContent className="space-y-3 pt-2 pb-3">
                  {['male', 'female', 'unisex'].map((gen) => (
                    <div key={gen} className="flex items-center space-x-3 capitalize">
                      <Checkbox
                        id={`gen-${gen}`}
                        checked={selectedGenders.includes(gen)}
                        onCheckedChange={(checked) => handleCheckbox(gen, checked, selectedGenders, setSelectedGenders)}
                        className="rounded-sm"
                      />
                      <label
                        htmlFor={`gen-${gen}`}
                        className="text-sm font-medium leading-none cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {gen}
                      </label>
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>

              {/* Filter Harga */}
              <AccordionItem value="harga" className="border-border border-b-0">
                <AccordionTrigger className="hover:no-underline text-xs font-semibold uppercase tracking-wider text-foreground py-3">
                  Harga (Maks)
                </AccordionTrigger>
                <AccordionContent className="pt-4 pb-2 px-1">
                  <Slider
                    defaultValue={[500000]}
                    max={500000}
                    step={10000}
                    value={[priceRange]}
                    onValueChange={(vals) => setPriceRange(vals[0])}
                    className="mb-5 cursor-pointer"
                  />
                  <div className="flex justify-between items-center text-xs font-medium text-foreground bg-muted/60 py-2 px-3 rounded-md border border-border/40">
                    <span className="text-muted-foreground uppercase tracking-wider text-[10px]">Maksimum</span>
                    <span className="font-semibold text-sm">Rp {priceRange.toLocaleString('id-ID')}</span>
                  </div>
                </AccordionContent>
              </AccordionItem>

            </Accordion>
          </div>
        </aside>

        {/* Product Catalog Grid */}
        <main className="flex-1">
          {/* Catalog Top Info */}
          <div className="flex justify-between items-center mb-6 border-b border-border pb-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Menampilkan <span className="text-foreground">{filteredProducts.length}</span> produk
            </div>
          </div>

          {/* Empty State */}
          {filteredProducts.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center border border-dashed border-border rounded-xl bg-muted/20 gap-3">
              <Search className="w-7 h-7 text-muted-foreground/40" />
              <p className="text-muted-foreground font-medium text-sm">Tidak ada produk yang sesuai dengan filter.</p>
              <Button variant="outline" size="sm" onClick={resetFilter} className="mt-1 text-xs">
                Bersihkan Filter
              </Button>
            </div>
          ) : (
            /* Product List */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="border-0 shadow-none rounded-none group cursor-pointer bg-transparent text-foreground overflow-hidden">
                  
                  {/* Image Container */}
                  <CardContent className="p-0 relative overflow-hidden aspect-[4/5] bg-muted flex items-center justify-center mb-4 rounded-xl border border-border/60">
                    {product.Foto ? (
                      <img
                        src={`/storage/${product.Foto}`}
                        alt={product.nama}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    ) : (
                      <span className="text-muted-foreground font-medium text-xs uppercase tracking-widest">No Image</span>
                    )}

                    {/* Floating Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start z-10">
                      {product['Best Seller'] === 'yes' && (
                        <Badge className="bg-foreground text-background hover:bg-foreground rounded-md px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-widest shadow-sm">
                          Best Seller
                        </Badge>
                      )}
                      <Badge variant="secondary" className="bg-background/90 backdrop-blur-md text-foreground hover:bg-background rounded-md px-2.5 py-0.5 text-[9px] uppercase font-semibold border border-border shadow-sm">
                        {product.kategori}
                      </Badge>
                    </div>

                    {/* Quick Action Button (Slide Up on Hover) */}
                    <div className="absolute bottom-3 left-3 right-3 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out z-10">
                      <Button className="w-full bg-background/95 backdrop-blur-md text-foreground hover:bg-primary hover:text-primary-foreground border border-border rounded-lg h-10 font-medium uppercase tracking-wider text-[11px] shadow-md">
                        Lihat Detail
                      </Button>
                    </div>
                  </CardContent>

                  {/* Product Details */}
                  <CardFooter className="p-0 flex flex-col items-start gap-1">
                    <div className="w-full flex justify-between items-start gap-2">
                      <h3 className="font-semibold text-base text-foreground tracking-tight leading-snug">
                        <a href={`/products/${product.id}`} className="hover:underline underline-offset-2">
                          {product.nama}
                        </a>
                      </h3>
                      <span className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider shrink-0 mt-0.5">
                        {product.Ukuran} ml
                      </span>
                    </div>
                    
                    <p className="text-xs text-muted-foreground capitalize">{product.Varian}</p>
                    
                    <p className="font-semibold text-sm text-foreground mt-1">
                      Rp {Number(product.Harga).toLocaleString('id-ID')}
                    </p>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}