import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { update } from '@/actions/App/Http/Controllers/ProductsController';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';

const kategoriOptions = ['EDP', 'EDT', 'Roll-On', 'Body Mist'];
const genderOptions = ['male', 'female', 'unisex'];

export interface Product {
    id: number;
    nama: string;
    kategori: string;
    gender: string;
    Varian: string;
    Top_Note: string;
    Middle_Note: string;
    Base_Note: string;
    Komposisi: string;
    Kemasan: string | null;
    Ukuran: number;
    Harga: number;
    Stok: number;
    Tanggal_launch: string | null;
    Deskripsi: string;
    Foto: string | null;
    Best_Seller: 'yes' | 'no';
}

interface Props {
    product: Product;
    trigger?: React.ReactNode;
    onUpdated?: () => void;
}

export default function EditProductSheet({ product, trigger, onUpdated }: Props) {
    const [open, setOpen] = useState(false);

    const { data, setData, post, processing, errors, transform } = useForm({
        nama: product.nama ?? '',
        kategori: product.kategori ?? '',
        gender: product.gender ?? '',
        Varian: product.Varian ?? '',
        Top_Note: product.Top_Note ?? '',
        Middle_Note: product.Middle_Note ?? '',
        Base_Note: product.Base_Note ?? '',
        Komposisi: product.Komposisi ?? '',
        Kemasan: product.Kemasan ?? '',
        Ukuran: product.Ukuran?.toString() ?? '',
        Harga: product.Harga?.toString() ?? '',
        Stok: product.Stok?.toString() ?? '',
        Tanggal_launch: product.Tanggal_launch ?? '',
        Deskripsi: product.Deskripsi ?? '',
        Foto: null as File | null,
        Best_Seller: product.Best_Seller === 'yes',
    });

    const submitProduct = (e: React.FormEvent) => {
        e.preventDefault();

        // Method spoofing agar upload file binary bisa terkirim via PUT di Inertia/Laravel
        transform((data) => ({
            ...data,
            _method: 'put',
        }));

        post(update(product.id).url, {
            forceFormData: true,
            onSuccess: () => {
                setOpen(false);
                onUpdated?.();
            },
        });
    };

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                {trigger ?? <Button variant="outline">Edit</Button>}
            </SheetTrigger>
            <SheetContent className="flex h-full flex-col gap-0 sm:max-w-lg">
                <SheetHeader className="shrink-0">
                    <SheetTitle>Edit Produk</SheetTitle>
                    <SheetDescription>
                        Ubah detail produk, lalu klik simpan perubahan.
                    </SheetDescription>
                </SheetHeader>

                <form
                    onSubmit={submitProduct}
                    data-lenis-prevent
                    className="grid min-h-0 flex-1 auto-rows-min gap-5 overflow-y-auto px-4 pb-4"
                >
                    <div className="grid gap-2">
                        <Label htmlFor="nama">Nama</Label>
                        <Input
                            id="nama"
                            value={data.nama}
                            onChange={(e) => setData('nama', e.target.value)}
                        />
                        {errors.nama && (
                            <span className="text-xs text-destructive">{errors.nama}</span>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="grid gap-2">
                            <Label htmlFor="kategori">Kategori</Label>
                            <select
                                id="kategori"
                                value={data.kategori}
                                onChange={(e) => setData('kategori', e.target.value)}
                                className="h-9 rounded-md border border-border bg-background px-3 text-sm"
                            >
                                <option value="">Pilih kategori</option>
                                {kategoriOptions.map((opt) => (
                                    <option key={opt} value={opt}>
                                        {opt}
                                    </option>
                                ))}
                            </select>
                            {errors.kategori && (
                                <span className="text-xs text-destructive">{errors.kategori}</span>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="gender">Gender</Label>
                            <select
                                id="gender"
                                value={data.gender}
                                onChange={(e) => setData('gender', e.target.value)}
                                className="h-9 rounded-md border border-border bg-background px-3 text-sm"
                            >
                                <option value="">Pilih gender</option>
                                {genderOptions.map((opt) => (
                                    <option key={opt} value={opt}>
                                        {opt}
                                    </option>
                                ))}
                            </select>
                            {errors.gender && (
                                <span className="text-xs text-destructive">{errors.gender}</span>
                            )}
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="varian">Varian</Label>
                        <Input
                            id="varian"
                            value={data.Varian}
                            onChange={(e) => setData('Varian', e.target.value)}
                        />
                        {errors.Varian && (
                            <span className="text-xs text-destructive">{errors.Varian}</span>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="top_note">Top Note</Label>
                        <Input
                            id="top_note"
                            value={data.Top_Note}
                            onChange={(e) => setData('Top_Note', e.target.value)}
                        />
                        {errors.Top_Note && (
                            <span className="text-xs text-destructive">{errors.Top_Note}</span>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="middle_note">Middle Note</Label>
                        <Input
                            id="middle_note"
                            value={data.Middle_Note}
                            onChange={(e) => setData('Middle_Note', e.target.value)}
                        />
                        {errors.Middle_Note && (
                            <span className="text-xs text-destructive">{errors.Middle_Note}</span>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="base_note">Base Note</Label>
                        <Input
                            id="base_note"
                            value={data.Base_Note}
                            onChange={(e) => setData('Base_Note', e.target.value)}
                        />
                        {errors.Base_Note && (
                            <span className="text-xs text-destructive">{errors.Base_Note}</span>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="komposisi">Komposisi</Label>
                        <Input
                            id="komposisi"
                            value={data.Komposisi}
                            onChange={(e) => setData('Komposisi', e.target.value)}
                        />
                        {errors.Komposisi && (
                            <span className="text-xs text-destructive">{errors.Komposisi}</span>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="kemasan">Kemasan (opsional)</Label>
                        <Input
                            id="kemasan"
                            value={data.Kemasan}
                            onChange={(e) => setData('Kemasan', e.target.value)}
                        />
                        {errors.Kemasan && (
                            <span className="text-xs text-destructive">{errors.Kemasan}</span>
                        )}
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        <div className="grid gap-2">
                            <Label htmlFor="ukuran">Ukuran (ml)</Label>
                            <Input
                                id="ukuran"
                                type="number"
                                value={data.Ukuran}
                                onChange={(e) => setData('Ukuran', e.target.value)}
                            />
                            {errors.Ukuran && (
                                <span className="text-xs text-destructive">{errors.Ukuran}</span>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="harga">Harga</Label>
                            <Input
                                id="harga"
                                type="number"
                                value={data.Harga}
                                onChange={(e) => setData('Harga', e.target.value)}
                            />
                            {errors.Harga && (
                                <span className="text-xs text-destructive">{errors.Harga}</span>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="stok">Stok</Label>
                            <Input
                                id="stok"
                                type="number"
                                value={data.Stok}
                                onChange={(e) => setData('Stok', e.target.value)}
                            />
                            {errors.Stok && (
                                <span className="text-xs text-destructive">{errors.Stok}</span>
                            )}
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="tanggal_launch">Tanggal Launch (opsional)</Label>
                        <Input
                            id="tanggal_launch"
                            type="date"
                            value={data.Tanggal_launch ?? ''}
                            onChange={(e) => setData('Tanggal_launch', e.target.value)}
                        />
                        {errors.Tanggal_launch && (
                            <span className="text-xs text-destructive">
                                {errors.Tanggal_launch}
                            </span>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="deskripsi">Deskripsi</Label>
                        <Textarea
                            id="deskripsi"
                            rows={4}
                            value={data.Deskripsi}
                            onChange={(e) => setData('Deskripsi', e.target.value)}
                        />
                        {errors.Deskripsi && (
                            <span className="text-xs text-destructive">{errors.Deskripsi}</span>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="foto">
                            Foto {product.Foto && '(kosongkan kalau tidak ingin ganti)'}
                        </Label>
                        {product.Foto && (
                            <img
                                src={`/storage/${product.Foto}`}
                                alt={data.nama}
                                className="h-20 w-20 rounded-md border border-border object-cover"
                            />
                        )}
                        <Input
                            id="foto"
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={(e) =>
                                setData('Foto', e.target.files ? e.target.files[0] : null)
                            }
                        />
                        {errors.Foto && (
                            <span className="text-xs text-destructive">{errors.Foto}</span>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <Checkbox
                            id="best_seller"
                            checked={data.Best_Seller}
                            onCheckedChange={(checked) =>
                                setData('Best_Seller', Boolean(checked))
                            }
                        />
                        <Label htmlFor="best_seller" className="font-normal">
                            Tandai sebagai Best Seller
                        </Label>
                    </div>

                    <SheetFooter className="px-0">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </Button>
                        <SheetClose asChild>
                            <Button type="button" variant="outline">
                                Batal
                            </Button>
                        </SheetClose>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    );
}