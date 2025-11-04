import Navigation from "@/components/Navigation";
import Logo from "@/components/Logo";

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

      {/* Footer */}
            <footer style={{ backgroundColor: 'var(--accent-darker)' }}>
                <div className="container-responsive py-10 sm:py-12">
                  <div className="mb-8 flex justify-center">
                    <div className="rounded-lg bg-white p-4">
                      <Logo width={120} height={38} />
                    </div>
                  </div>
              
                  <div className="mb-8 grid grid-cols-1 gap-6 text-sm sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                      <h4 className="mb-3 font-bold text-white">Laili Brand</h4>
                      <p className="leading-relaxed text-gray-300">
                        Ibu Berkarir dalam rumah
                      </p>
                    </div>
                  </div>
              
                  <div
                    className="border-t pt-5 text-center text-sm text-gray-400"
                    style={{ borderColor: 'var(--primary-700)' }}
                  >
                    <p>&copy; 2025 Laili Brand. All rights reserved.</p>
                  </div>
                </div>
            </footer>
    </div>
  );
}
