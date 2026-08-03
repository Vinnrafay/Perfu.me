import Navbar from "@/components/blocks/navbar";


export default function AboutUs() {
  return (
    <>
    <Navbar />
    <div className="flex min-h-screen flex-col items-center">
        <div className="flex flex-col max-w-7xl w-full min-h-screen gap-6 p-5">
            <h1 className="text-7xl font-semibold capitalize">
                About <span className="font-heading">Perfu.me</span>
            </h1>
        </div>
    </div>
    </>
  )
}
