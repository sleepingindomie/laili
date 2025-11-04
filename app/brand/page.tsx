import Navigation from "@/components/Navigation";

export default function BrandPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <section className="py-16">
        <div className="container-responsive">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-6 text-5xl font-bold text-gray-900">Laili Brand</h1>
            <p className="mb-12 text-xl text-gray-600">
              Produk berkualitas dengan brand identity yang elegant dan modern
            </p>

            <div className="grid gap-8 md:grid-cols-2">
              <div className="rounded-xl border border-gray-200 p-8">
                <h3 className="mb-4 text-2xl font-semibold">Brand Identity</h3>
                <p className="text-gray-600">
                  Laili mengusung design monochrome elegant yang timeless dan sophisticated
                </p>
              </div>
              <div className="rounded-xl border border-gray-200 p-8">
                <h3 className="mb-4 text-2xl font-semibold">Kualitas Produk</h3>
                <p className="text-gray-600">
                  Setiap produk dipilih dengan teliti untuk memastikan standar kualitas terbaik
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
