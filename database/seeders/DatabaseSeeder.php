<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\ProductSize;
use App\Models\Testimoni;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        // =========================
        // ADMIN
        // =========================
        User::create([
            'name' => 'Admin Perfu.me',
            'email' => 'perfu.me@gmail.com',
            'password' => bcrypt('password'),
        ]);

        // =========================
        // TESTIMONIALS
        // =========================
        Testimoni::insert([
            [
                'nama' => 'Aulia Rahma',
                'email' => 'aulia.rahma@example.com',
                'profil' => null,
                'komentar' => 'Wanginya enak banget dan cukup tahan lama untuk dipakai seharian. Packaging-nya juga rapi, cocok banget buat hadiah.',
                'rating' => 5,
            ],
            [
                'nama' => 'Rizky Pratama',
                'email' => 'rizky.pratama@example.com',
                'profil' => null,
                'komentar' => 'Awalnya coba karena rekomendasi teman, ternyata wanginya sesuai ekspektasi. Fresh tapi tetap elegan. Bakal order lagi.',
                'rating' => 5,
            ],
            [
                'nama' => 'Nadia Putri',
                'email' => 'nadia.putri@example.com',
                'profil' => null,
                'komentar' => 'Suka banget sama pilihan aromanya. Aku pilih yang floral dan wanginya nggak terlalu menyengat, pas buat dipakai sehari-hari.',
                'rating' => 5,
            ],
            [
                'nama' => 'Fajar Maulana',
                'email' => 'fajar.maulana@example.com',
                'profil' => null,
                'komentar' => 'Harga cukup terjangkau untuk kualitas parfum yang didapat. Wanginya juga terasa premium dan packaging-nya aman saat sampai.',
                'rating' => 4,
            ],
            [
                'nama' => 'Salsabila Nurfadilah',
                'email' => 'salsabila.nurfadilah@example.com',
                'profil' => null,
                'komentar' => 'Pelayanannya ramah dan proses pesanannya cepat. Parfumnya juga wangi banget, sekarang jadi parfum favorit aku.',
                'rating' => 5,
            ],
            [
                'nama' => 'Dimas Arya',
                'email' => 'dimas.arya@example.com',
                'profil' => null,
                'komentar' => 'Aromanya enak dan cocok buat dipakai kerja. Ketahanannya lumayan, terutama kalau dipakai di ruangan ber-AC.',
                'rating' => 4,
            ],
            [
                'nama' => 'Citra Lestari',
                'email' => 'citra.lestari@example.com',
                'profil' => null,
                'komentar' => 'Aku suka banget sama parfumnya. Botolnya simpel tapi kelihatan bagus. Bakal coba varian lain di pembelian berikutnya.',
                'rating' => 5,
            ],
            [
                'nama' => 'Bagas Ramadhan',
                'email' => 'bagas.ramadhan@example.com',
                'profil' => null,
                'komentar' => 'Wanginya cukup tahan lama dan nggak bikin pusing. Cocok buat yang suka aroma yang clean dan nggak terlalu kuat.',
                'rating' => 4,
            ],
            [
                'nama' => 'Intan Permata',
                'email' => 'intan.permata@example.com',
                'profil' => null,
                'komentar' => 'Parfumnya sampai dengan kondisi baik dan sesuai pesanan. Aromanya juga ternyata lebih enak setelah beberapa saat dipakai.',
                'rating' => 5,
            ],
            [
                'nama' => 'Rafi Akbar',
                'email' => 'rafi.akbar@example.com',
                'profil' => null,
                'komentar' => 'Overall bagus dan worth it. Pilihan aromanya banyak, jadi bisa pilih sesuai kebutuhan. Untuk harga segini kualitasnya oke.',
                'rating' => 4,
            ],
            [
                'nama' => 'Maya Anindita',
                'email' => 'maya.anindita@example.com',
                'profil' => null,
                'komentar' => 'Pertama kali coba varian ini dan langsung suka. Aromanya manis tapi tetap nyaman dipakai, terutama untuk acara malam.',
                'rating' => 5,
            ],
            [
                'nama' => 'Yoga Saputra',
                'email' => 'yoga.saputra@example.com',
                'profil' => null,
                'komentar' => 'Pengiriman cukup cepat dan packing aman. Untuk aromanya sendiri sesuai dengan deskripsi produk. Overall puas.',
                'rating' => 4,
            ],
        ]);

        // =========================
        // PRODUCTS
        // =========================
        $products = [
            // 1
            [
                'nama' => 'Ocean Blue',
                'kategori' => 'EDT',
                'gender' => 'male',
                'original' => 'Refill',
                'brand' => 'Davidoff',
                'Top_Note' => 'Lemon, Bergamot, Sea Notes',
                'Middle_Note' => 'Lavender, Jasmine, Rosemary',
                'Base_Note' => 'Musk, Sandalwood, Amber',
                'Komposisi' => 'Alcohol, Fragrance, Aqua',
                'Kemasan' => 'Botol Spray',
                'Tanggal_launch' => '2025-01-15',
                'Deskripsi' => 'Aroma fresh dan aquatic yang ringan, cocok untuk aktivitas sehari-hari.',
                'Foto' => null,
                'Gallery' => null,
                'Best_Seller' => 'yes',
                'signature' => 'no',
            ],

            // 2
            [
                'nama' => 'Blue Intense',
                'kategori' => 'EDP',
                'gender' => 'male',
                'original' => 'Refill',
                'brand' => 'Chanel',
                'Top_Note' => 'Lemon, Grapefruit, Mint',
                'Middle_Note' => 'Ginger, Nutmeg, Jasmine',
                'Base_Note' => 'Cedar, Sandalwood, Incense',
                'Komposisi' => 'Alcohol, Fragrance, Aqua',
                'Kemasan' => 'Botol Spray',
                'Tanggal_launch' => '2025-02-10',
                'Deskripsi' => 'Karakter fresh, clean, dan sedikit spicy untuk memberikan kesan elegan.',
                'Foto' => null,
                'Gallery' => null,
                'Best_Seller' => 'yes',
                'signature' => 'no',
            ],

            // 3
            [
                'nama' => 'Sauvage Night',
                'kategori' => 'EDP',
                'gender' => 'male',
                'original' => 'Refill',
                'brand' => 'Dior',
                'Top_Note' => 'Bergamot, Pepper',
                'Middle_Note' => 'Lavender, Sichuan Pepper',
                'Base_Note' => 'Ambroxan, Cedar, Vanilla',
                'Komposisi' => 'Alcohol, Fragrance, Aqua',
                'Kemasan' => 'Botol Spray',
                'Tanggal_launch' => '2025-03-05',
                'Deskripsi' => 'Aroma maskulin dengan karakter spicy, woody, dan warm yang cocok digunakan pada malam hari.',
                'Foto' => null,
                'Gallery' => null,
                'Best_Seller' => 'yes',
                'signature' => 'no',
            ],

            // 4
            [
                'nama' => 'Sweet Bloom',
                'kategori' => 'EDP',
                'gender' => 'female',
                'original' => 'Refill',
                'brand' => 'Lancôme',
                'Top_Note' => 'Pear, Bergamot, Pink Pepper',
                'Middle_Note' => 'Rose, Jasmine, Iris',
                'Base_Note' => 'Vanilla, Musk, Patchouli',
                'Komposisi' => 'Alcohol, Fragrance, Aqua',
                'Kemasan' => 'Botol Spray',
                'Tanggal_launch' => '2025-03-20',
                'Deskripsi' => 'Aroma floral manis dengan kesan feminin dan elegan.',
                'Foto' => null,
                'Gallery' => null,
                'Best_Seller' => 'yes',
                'signature' => 'no',
            ],

            // 5
            [
                'nama' => 'Vanilla Dream',
                'kategori' => 'EDP',
                'gender' => 'female',
                'original' => 'Refill',
                'brand' => 'Yves Saint Laurent',
                'Top_Note' => 'Mandarin, Orange Blossom',
                'Middle_Note' => 'Jasmine, Coffee',
                'Base_Note' => 'Vanilla, Cedar, Musk',
                'Komposisi' => 'Alcohol, Fragrance, Aqua',
                'Kemasan' => 'Botol Spray',
                'Tanggal_launch' => '2025-04-12',
                'Deskripsi' => 'Perpaduan vanilla yang manis dengan karakter creamy dan sedikit floral.',
                'Foto' => null,
                'Gallery' => null,
                'Best_Seller' => 'no',
                'signature' => 'no',
            ],

            // 6
            [
                'nama' => 'Black Coffee',
                'kategori' => 'EDP',
                'gender' => 'female',
                'original' => 'Refill',
                'brand' => 'Yves Saint Laurent',
                'Top_Note' => 'Pink Pepper, Orange Blossom',
                'Middle_Note' => 'Coffee, Jasmine',
                'Base_Note' => 'Vanilla, Cedar, Patchouli',
                'Komposisi' => 'Alcohol, Fragrance, Aqua',
                'Kemasan' => 'Botol Spray',
                'Tanggal_launch' => '2025-05-01',
                'Deskripsi' => 'Aroma coffee yang hangat dan manis dengan karakter modern dan sensual.',
                'Foto' => null,
                'Gallery' => null,
                'Best_Seller' => 'yes',
                'signature' => 'no',
            ],

            // 7
            [
                'nama' => 'Citrus Gentleman',
                'kategori' => 'EDT',
                'gender' => 'male',
                'original' => 'Refill',
                'brand' => 'Hugo Boss',
                'Top_Note' => 'Grapefruit, Lemon, Apple',
                'Middle_Note' => 'Geranium, Cinnamon',
                'Base_Note' => 'Sandalwood, Vetiver, Cedar',
                'Komposisi' => 'Alcohol, Fragrance, Aqua',
                'Kemasan' => 'Botol Spray',
                'Tanggal_launch' => '2025-05-18',
                'Deskripsi' => 'Aroma citrus yang segar dengan sentuhan woody yang memberikan kesan gentleman.',
                'Foto' => null,
                'Gallery' => null,
                'Best_Seller' => 'no',
                'signature' => 'no',
            ],

            // 8
            [
                'nama' => 'Floral Romance',
                'kategori' => 'EDP',
                'gender' => 'female',
                'original' => 'Refill',
                'brand' => 'Chanel',
                'Top_Note' => 'Citrus, Bergamot',
                'Middle_Note' => 'Rose, Jasmine, Ylang-Ylang',
                'Base_Note' => 'Musk, Vanilla, Sandalwood',
                'Komposisi' => 'Alcohol, Fragrance, Aqua',
                'Kemasan' => 'Botol Spray',
                'Tanggal_launch' => '2025-06-07',
                'Deskripsi' => 'Aroma floral yang lembut, romantis, dan elegan untuk berbagai kesempatan.',
                'Foto' => null,
                'Gallery' => null,
                'Best_Seller' => 'no',
                'signature' => 'no',
            ],

            // 9
            [
                'nama' => 'Warm Tobacco',
                'kategori' => 'EDP',
                'gender' => 'male',
                'original' => 'Refill',
                'brand' => 'Tom Ford',
                'Top_Note' => 'Tobacco Leaf, Cinnamon',
                'Middle_Note' => 'Vanilla, Cocoa, Tonka Bean',
                'Base_Note' => 'Dried Fruits, Woody Notes',
                'Komposisi' => 'Alcohol, Fragrance, Aqua',
                'Kemasan' => 'Botol Spray',
                'Tanggal_launch' => '2025-07-12',
                'Deskripsi' => 'Aroma warm dan rich dengan karakter tobacco, vanilla, dan spicy yang kuat.',
                'Foto' => null,
                'Gallery' => null,
                'Best_Seller' => 'yes',
                'signature' => 'no',
            ],

            // 10
            [
                'nama' => 'Golden Santal',
                'kategori' => 'EDP',
                'gender' => 'unisex',
                'original' => 'Refill',
                'brand' => 'Le Labo',
                'Top_Note' => 'Cardamom, Violet',
                'Middle_Note' => 'Sandalwood, Cedar',
                'Base_Note' => 'Amber, Musk',
                'Komposisi' => 'Alcohol, Fragrance, Aqua',
                'Kemasan' => 'Botol Spray',
                'Tanggal_launch' => '2025-08-02',
                'Deskripsi' => 'Aroma woody dan creamy yang elegan dengan karakter unisex.',
                'Foto' => null,
                'Gallery' => null,
                'Best_Seller' => 'no',
                'signature' => 'no',
            ],

            // 11
            [
                'nama' => 'Green Adventure',
                'kategori' => 'EDC',
                'gender' => 'unisex',
                'original' => 'Refill',
                'brand' => 'Jo Malone',
                'Top_Note' => 'Green Apple, Lemon',
                'Middle_Note' => 'Green Tea, Jasmine',
                'Base_Note' => 'Cedar, Musk',
                'Komposisi' => 'Alcohol, Fragrance, Aqua',
                'Kemasan' => 'Botol Spray',
                'Tanggal_launch' => '2025-08-20',
                'Deskripsi' => 'Aroma green dan fresh yang ringan untuk menemani aktivitas harian.',
                'Foto' => null,
                'Gallery' => null,
                'Best_Seller' => 'no',
                'signature' => 'no',
            ],

            // 12
            [
                'nama' => 'Crystal Rose',
                'kategori' => 'EDP',
                'gender' => 'female',
                'original' => 'Refill',
                'brand' => 'Maison Francis Kurkdjian',
                'Top_Note' => 'Bergamot, Lemon',
                'Middle_Note' => 'Rose, Violet, Magnolia',
                'Base_Note' => 'Musk, Amber, Cedar',
                'Komposisi' => 'Alcohol, Fragrance, Aqua',
                'Kemasan' => 'Botol Spray',
                'Tanggal_launch' => '2025-09-10',
                'Deskripsi' => 'Aroma rose yang clean, fresh, dan elegan dengan karakter feminin.',
                'Foto' => null,
                'Gallery' => null,
                'Best_Seller' => 'no',
                'signature' => 'no',
            ],

            // 13 - ORIGINAL
            [
                'nama' => 'Dynamyst',
                'kategori' => 'EDP',
                'gender' => 'male',
                'original' => 'Original',
                'brand' => null,
                'Top_Note' => 'Bergamot, Lemon, Pink Pepper',
                'Middle_Note' => 'Lavender, Geranium, Cedar',
                'Base_Note' => 'Musk, Amber, Sandalwood',
                'Komposisi' => 'Alcohol, Fragrance, Aqua',
                'Kemasan' => 'Botol Spray',
                'Tanggal_launch' => '2026-01-10',
                'Deskripsi' => 'Parfum original Perfu.me dengan karakter fresh, aromatic, dan woody. Dirancang untuk memberikan kesan maskulin yang modern dan percaya diri.',
                'Foto' => null,
                'Gallery' => null,
                'Best_Seller' => 'yes',
                'signature' => 'yes',
            ],

            // 14 - ORIGINAL
            [
                'nama' => 'Evanessence',
                'kategori' => 'EDP',
                'gender' => 'unisex',
                'original' => 'Original',
                'brand' => null,
                'Top_Note' => 'Bergamot, Pear, Green Notes',
                'Middle_Note' => 'Jasmine, Rose, Tea',
                'Base_Note' => 'White Musk, Amber, Cedarwood',
                'Komposisi' => 'Alcohol, Fragrance, Aqua',
                'Kemasan' => 'Botol Spray',
                'Tanggal_launch' => '2026-02-14',
                'Deskripsi' => 'Parfum original Perfu.me dengan aroma clean, floral, dan sedikit woody. Karakternya ringan dan versatile sehingga cocok digunakan oleh siapa saja.',
                'Foto' => null,
                'Gallery' => null,
                'Best_Seller' => 'yes',
                'signature' => 'yes',
            ],
        ];

        // =========================
        // CREATE PRODUCTS + SIZES
        // =========================
        foreach ($products as $productData) {
            $product = Product::create($productData);

            $isOriginal = $productData['original'] === 'Original';

            ProductSize::create([
                'product_id' => $product->id,
                'Ukuran' => 50,
                'Harga' => $isOriginal ? 40000 : 20000,
                'Diskon' => 0,
                'Stok' => rand(15, 30),
            ]);

            ProductSize::create([
                'product_id' => $product->id,
                'Ukuran' => 75,
                'Harga' => $isOriginal ? 65000 : 45000,
                'Diskon' => 0,
                'Stok' => rand(10, 25),
            ]);

            ProductSize::create([
                'product_id' => $product->id,
                'Ukuran' => 100,
                'Harga' => $isOriginal ? 80000 : 70000,
                'Diskon' => 0,
                'Stok' => rand(5, 20),
            ]);
        }
    }
}