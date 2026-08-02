import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/blocks/navbar';

export default function Welcome() {

    return (
        <>
            <Head title="Welcome" />
            <Navbar />
            <div className="flex min-h-screen flex-col items-center">
                <div className="flex flex-col min-h-screen items-center justify-center p-5">
                    <h1 className="text-6xl text-center font-semibold font-heading">
                        Smell good, feel confident.
                    </h1>
                </div>
            </div>
        </>
    );
}
