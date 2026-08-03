import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/blocks/navbar';

export default function Welcome() {

    return (
        <>
            <Head title="Welcome" />
            <Navbar />
            <div className="flex min-h-screen flex-col items-center">
                <div className="flex flex-col min-h-screen items-center justify-center gap-6 p-5">
                    <h1 className="text-7xl text-center font-semibold capitalize">
                        Smell <span className="font-heading italic">good</span>, feel <span className="font-heading italic">confident</span>.
                    </h1>
                </div>
            </div>
        </>
    );
}
