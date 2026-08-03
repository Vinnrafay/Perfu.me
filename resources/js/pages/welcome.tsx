import { Head, Link } from '@inertiajs/react';
import Navbar from '@/components/blocks/navbar';
import { Star, CheckCircle2, Recycle, ArrowRight } from 'lucide-react';

export default function Welcome() {
    return (
        <>
            <Head title="Welcome" />
            <Navbar />
            
            <main className="min-h-screen w-full bg-background text-foreground pb-24">
                
                {/* 1. HERO SECTION (Kode asli kamu) */}
                <section className="flex flex-col min-h-[80vh] items-center justify-center gap-6 p-5">
                    <h1 className="text-6xl sm:text-7xl md:text-8xl text-center font-semibold capitalize tracking-tight">
                        Smell <span className="font-heading italic text-muted-foreground">good</span>,<br /> 
                        feel <span className="font-heading italic text-muted-foreground">confident</span>.
                    </h1>
                </section>

                {/* 2. BENTO GRID FEATURE SECTION */}
                <section className="w-full max-w-6xl mx-auto px-5 py-16">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                        <h2 className="text-4xl sm:text-5xl font-medium tracking-tight leading-[1.1]">
                            Why Your Scent <br className="hidden md:block" />
                            Deserves the Best
                        </h2>
                        
                        {/* Rating Summary */}
                        <div className="flex flex-col items-end gap-2">
                            <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                                ))}
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-medium">4.9 (2,109 reviews)</span>
                                <div className="flex -space-x-2">
                                    <img src="https://i.pravatar.cc/100?img=1" alt="user" className="w-7 h-7 rounded-full border-2 border-background" />
                                    <img src="https://i.pravatar.cc/100?img=5" alt="user" className="w-7 h-7 rounded-full border-2 border-background" />
                                    <img src="https://i.pravatar.cc/100?img=9" alt="user" className="w-7 h-7 rounded-full border-2 border-background" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Grid Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                        
                        {/* Left Large Card */}
                        <div className="lg:col-span-7 relative h-[450px] sm:h-[600px] rounded-3xl overflow-hidden group">
                            <img 
                                src="https://images.unsplash.com/photo-1595959183082-7b570b7e08e2?auto=format&fit=crop&q=80&w=1000" 
                                alt="Elegance" 
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                            />
                            {/* Floating Badge */}
                            <div className="absolute bottom-6 left-6 right-6 sm:right-auto bg-background/95 backdrop-blur-md p-5 rounded-2xl shadow-lg max-w-xs">
                                <div className="flex items-center gap-2 mb-2">
                                    <CheckCircle2 className="w-5 h-5 text-primary" />
                                    <span className="font-semibold text-sm">Long-lasting Projection</span>
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    Every signature scent is carefully crafted with premium ingredients to meet the highest quality standards.
                                </p>
                            </div>
                        </div>

                        {/* Right Stacked Cards */}
                        <div className="lg:col-span-5 flex flex-col gap-5">
                            
                            {/* Top Small Card - Light */}
                            <div className="flex-1 bg-secondary rounded-3xl p-8 relative overflow-hidden flex flex-col justify-center min-h-[280px]">
                                <div className="relative z-10 max-w-[60%]">
                                    <Recycle className="w-6 h-6 mb-4 text-primary" />
                                    <h3 className="text-2xl font-medium mb-3">Eco-Friendly<br/>Packaging</h3>
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        Sustainable materials designed to care for the planet as 
                                        much as your confidence.
                                    </p>
                                </div>
                                {/* Bottle Image Absolute */}
                                <img 
                                    src="https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=400" 
                                    alt="Bottle" 
                                    className="absolute -bottom-10 -right-10 w-64 h-auto object-cover mix-blend-multiply opacity-90"
                                />
                            </div>

                            {/* Bottom Small Card - Dark */}
                            <div className="flex-1 bg-primary text-primary-foreground rounded-3xl p-8 relative overflow-hidden flex flex-col justify-center min-h-[280px]">
                                <div className="relative z-10">
                                    <h3 className="text-2xl font-medium mb-1">100% Premium</h3>
                                    <h3 className="text-2xl font-medium text-primary-foreground/70 mb-6">100% You</h3>
                                    
                                    <ul className="space-y-3">
                                        {['No Harsh Chemicals', 'Ethically Sourced', 'Cruelty-Free'].map((item, i) => (
                                            <li key={i} className="flex items-center gap-3 text-sm text-primary-foreground/90">
                                                <div className="w-1.5 h-1.5 rounded-full border border-primary-foreground" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                {/* Leaf/Abstract Image Absolute */}
                                <img 
                                    src="https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&q=80&w=400" 
                                    alt="Nature" 
                                    className="absolute top-0 right-0 w-48 h-full object-cover opacity-20 mask-image-gradient"
                                />
                            </div>

                        </div>
                    </div>
                </section>

                {/* 3. TESTIMONIAL SECTION */}
                <section className="w-full max-w-4xl mx-auto px-5 py-24 text-center flex flex-col items-center">
                    {/* Polaroid Icon */}
                    <div className="bg-background p-2 shadow-xl rounded-sm rotate-3 mb-8 border border-border">
                        <img 
                            src="https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=100" 
                            alt="Mini" 
                            className="w-12 h-12 object-cover"
                        />
                    </div>
                    
                    <h2 className="text-2xl sm:text-3xl md:text-4xl leading-relaxed sm:leading-relaxed font-medium mb-8 max-w-3xl">
                        "It feels <span className="font-heading italic">more elegant, luxurious & confident</span> than ever. I love knowing I'm wearing a signature scent that truly represents me!"
                    </h2>
                    
                    <div className="flex items-center gap-1 mb-3">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                        ))}
                    </div>
                    <p className="font-semibold text-sm">Jennifer K.</p>
                    <p className="text-xs text-muted-foreground">Verified Buyer</p>
                </section>

                {/* 4. PRODUCT SHOWCASE (Floating Tooltips) */}
                <section className="w-full max-w-5xl mx-auto px-5 py-10">
                    <div className="relative w-full aspect-square sm:aspect-video bg-secondary/50 rounded-3xl flex items-center justify-center overflow-hidden">
                        
                        {/* Main Center Image */}
                        <img 
                            src="https://images.unsplash.com/photo-1585386959984-a4155224a1ad?auto=format&fit=crop&q=80&w=1200" 
                            alt="Product Collection" 
                            className="w-full h-full object-cover"
                        />

                        {/* Tooltip 1 (Left) */}
                        <div className="absolute top-[60%] sm:top-[70%] left-[10%] sm:left-[20%] group cursor-pointer">
                            <div className="w-3 h-3 bg-white rounded-full animate-pulse shadow-lg absolute -top-1 -left-1 z-10" />
                            <div className="bg-background/95 backdrop-blur-sm border border-border p-2 pr-4 rounded-xl shadow-2xl flex items-center gap-4 transition-transform group-hover:-translate-y-1">
                                <img src="https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=100" className="w-10 h-10 object-cover rounded-md" alt="Thumb" />
                                <div>
                                    <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Unisex</p>
                                    <p className="text-sm font-medium">Vannessence EDP</p>
                                    <p className="text-xs text-muted-foreground">Rp 135.000</p>
                                </div>
                                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>
                        </div>

                        {/* Tooltip 2 (Right) */}
                        <div className="absolute top-[35%] right-[5%] sm:right-[15%] group cursor-pointer">
                            <div className="w-3 h-3 bg-white rounded-full animate-pulse shadow-lg absolute -top-1 -left-1 z-10" />
                            <div className="bg-background/95 backdrop-blur-sm border border-border p-2 pr-4 rounded-xl shadow-2xl flex items-center gap-4 transition-transform group-hover:-translate-y-1">
                                <img src="https://images.unsplash.com/photo-1523293115678-02462479650b?auto=format&fit=crop&q=80&w=100" className="w-10 h-10 object-cover rounded-md" alt="Thumb" />
                                <div>
                                    <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Men</p>
                                    <p className="text-sm font-medium">Dynamyst EDP</p>
                                    <p className="text-xs text-muted-foreground">Rp 125.000</p>
                                </div>
                                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>
                        </div>

                    </div>
                </section>

            </main>
        </>
    );
}