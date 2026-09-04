import { Button } from "@/components/ui/button";
import { index } from "@/routes/order";
import { Plus } from "lucide-react";

export default function OrderManagement() {
    return (
        <div className="flex flex-col gap-3 p-5 w-full">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                        Daftar Pesanan
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Kelola semua pesanan yang masuk dan lakukan tindakan yang diperlukan.
                    </p>
                </div>
                <Button>
                    <Plus />
                    Tambah Pesanan
                </Button>
            </div>


        </div>
    )
}

OrderManagement.layout = {
    breadcrumbs: [
        {
            title: 'Order Management',
            href: index(),
        },
    ],
};
