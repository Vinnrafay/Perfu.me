import React, { useState } from 'react';
import { Filter } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import  Navbar  from '@/components/blocks/navbar';

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
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedGenders, setSelectedGenders] = useState<string[]>([]);

    // Handler untuk toggle checkbox shadcn
    const handleCheckbox = (value: string, isChecked: boolean | string, state: string[], setState: React.Dispatch<React.SetStateAction<string[]>>) => {
        if (isChecked) {
            setState([...state, value]);
        } else {
            setState(state.filter((item) => item !== value));
        }
    };

    // Eksekusi filter data
    const filteredProducts = products.filter((product) => {
        const matchCategory = selectedCategories.length === 0 || selectedCategories.includes(product.kategori);
        const matchGender = selectedGenders.length === 0 || selectedGenders.includes(product.gender);
        const matchPrice = product.Harga <= priceRange;

        return matchCategory && matchGender && matchPrice;
    });

    return (

        <div className="min-h-screen pb-20">
            <Navbar/>
            {/* Hero Section - Minimalist Editorial Style */}
            <section className="bg-primary text-primary-foreground py-24 px-6 flex flex-col items-center text-center">
                <h1 className="text-4xl md:text-6xl font-semibold font-heading tracking-tighter mb-6 uppercase">
                    Discover Your Scent
                </h1>
                <p className="text-muted-foreground text-lg max-w-xl font-light">
                    Koleksi wewangian eksklusif yang dirancang untuk memperkuat karakter dan kepercayaan dirimu setiap hari.
                </p>
            </section>

            {/* Main Content Layout */}
            <div className="container max-w-7xl w-full mx-auto px-5 pt-12 flex flex-col md:flex-row gap-10">
                
                {/* Sidebar Filter */}
                <aside className="w-full md:w-1/4 shrink-0">
                    <div className="sticky top-24">
                        <div className="flex items-center gap-2 mb-6 border-b border-border pb-4">
                            <Filter className="w-5 h-5" />
                            <h2 className="text-lg font-semibold tracking-wide uppercase">Filter</h2>
                        </div>

                        <Accordion type="multiple" defaultValue={['kategori', 'gender', 'harga']} className="w-full">
                            
                            {/* Filter Kategori */}
                            <AccordionItem value="kategori" className="border-b-0 mb-2">
                                <AccordionTrigger className="hover:no-underline text-sm font-medium uppercase tracking-wider text-muted-foreground">
                                    Kategori
                                </AccordionTrigger>
                                <AccordionContent className="space-y-4 pt-2">
                                    {['EDP', 'EDT', 'Roll-On', 'Body Mist'].map((cat) => (
                                        <div key={cat} className="flex items-center space-x-3">
                                            <Checkbox 
                                                id={`cat-${cat}`} 
                                                onCheckedChange={(checked) => handleCheckbox(cat, checked, selectedCategories, setSelectedCategories)}
                                            />
                                            <label htmlFor={`cat-${cat}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                                                {cat}
                                            </label>
                                        </div>
                                    ))}
                                </AccordionContent>
                            </AccordionItem>

                            {/* Filter Gender */}
                            <AccordionItem value="gender" className="border-b-0 mb-2">
                                <AccordionTrigger className="hover:no-underline text-sm font-medium uppercase tracking-wider text-muted-foreground">
                                    Gender
                                </AccordionTrigger>
                                <AccordionContent className="space-y-4 pt-2">
                                    {['male', 'female', 'unisex'].map((gen) => (
                                        <div key={gen} className="flex items-center space-x-3 capitalize">
                                            <Checkbox 
                                                id={`gen-${gen}`} 
                                                onCheckedChange={(checked) => handleCheckbox(gen, checked, selectedGenders, setSelectedGenders)}
                                            />
                                            <label htmlFor={`gen-${gen}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                                                {gen}
                                            </label>
                                        </div>
                                    ))}
                                </AccordionContent>
                            </AccordionItem>

                            {/* Filter Harga */}
                            <AccordionItem value="harga" className="border-b-0">
                                <AccordionTrigger className="hover:no-underline text-sm font-medium uppercase tracking-wider text-muted-foreground">
                                    Harga (Maks)
                                </AccordionTrigger>
                                <AccordionContent className="pt-4 pb-2 px-1">
                                    <Slider
                                        defaultValue={[500000]}
                                        max={500000}
                                        step={10000}
                                        value={[priceRange]}
                                        onValueChange={(vals) => setPriceRange(vals[0])}
                                        className="mb-4"
                                    />
                                        <div className="text-sm font-medium text-muted-foreground">
                                        Rp {priceRange.toLocaleString('id-ID')}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                </aside>

                {/* Product Catalog */}
                <main className="flex-1">
                    <div className="mb-8 text-sm text-muted-foreground">
                        Menampilkan {filteredProducts.length} produk
                    </div>

                    {filteredProducts.length === 0 ? (
                        <div className="h-64 flex items-center justify-center border border-dashed border-border rounded-lg bg-card">
                            <p className="text-muted-foreground">Tidak ada produk yang sesuai dengan filter.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
                            {filteredProducts.map((product) => (
                                // Card flat & clean tanpa shadow bawaan
                                <Card key={product.id} className="border-0 shadow-none rounded-none group cursor-pointer bg-transparent text-foreground">
                                    
                                    {/* Image Area */}
                                    <CardContent className="p-0 relative overflow-hidden aspect-3/4 bg-muted flex items-center justify-center mb-4">
                                        {product.Foto ? (
                                            <img 
                                                src={`/storage/${product.Foto}`} 
                                                alt={product.nama} 
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                        ) : (
                                            <span className="text-muted-foreground font-medium">No Image</span>
                                        )}
                                        
                                        {/* Floating Badges */}
                                        <div className="absolute top-3 left-3 flex flex-col gap-2 items-start">
                                            {product['Best Seller'] === 'yes' && (
                                                <Badge className="bg-foreground hover:bg-foreground text-background rounded-sm px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest">
                                                    Best Seller
                                                </Badge>
                                            )}
                                            <Badge variant="secondary" className="bg-card/90 text-card-foreground hover:bg-card rounded-sm px-2 py-0.5 text-[10px] uppercase font-medium">
                                                {product.kategori}
                                            </Badge>
                                        </div>

                                        {/* Quick Action Button (Hover) */}
                                        <div className="absolute bottom-4 left-4 right-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                                            <Button className="w-full bg-card/90 backdrop-blur text-card-foreground hover:bg-foreground hover:text-background rounded-none h-11">
                                                Lihat Detail
                                            </Button>
                                        </div>
                                    </CardContent>

                                    {/* Product Details */}
                                    <CardFooter className="p-0 flex flex-col items-start gap-1">
                                        <div className="w-full flex justify-between items-start">
                                            <h3 className="font-semibold text-base text-foreground uppercase tracking-tight">
                                                <a href={`/products/${product.id}`} className="hover:underline">
                                                    {product.nama}
                                                </a>
                                            </h3>
                                            <span className="text-xs text-muted-foreground uppercase tracking-wider mt-1">
                                                {product.Ukuran} ml
                                            </span>
                                        </div>
                                        <p className="text-sm text-muted-foreground capitalize">{product.Varian}</p>
                                        <p className="font-medium text-foreground mt-2">
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
