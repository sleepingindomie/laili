export default function MitraKatalogPage() {
  const products = [
    {
      id: 1,
      name: "Produk Sample 1",
      price: "Rp 150.000",
      image: "🌸",
      stock: "Tersedia",
    },
    {
      id: 2,
      name: "Produk Sample 2",
      price: "Rp 200.000",
      image: "💐",
      stock: "Tersedia",
    },
    {
      id: 3,
      name: "Produk Sample 3",
      price: "Rp 175.000",
      image: "🌺",
      stock: "Terbatas",
    },
  ];

  return (
    <div className="container-responsive py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Katalog Produk</h1>
        <p className="mt-2 text-gray-600">Pilih produk untuk dipesan</p>
      </div>

      {/* Search & Filter */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        <input
          type="search"
          placeholder="Cari produk..."
          className="flex-1 rounded-lg border border-gray-300 px-4 py-3 focus:border-secondary-500 focus:outline-none focus:ring-2 focus:ring-secondary-200"
        />
        <select className="rounded-lg border border-gray-300 px-4 py-3 focus:border-secondary-500 focus:outline-none focus:ring-2 focus:ring-secondary-200">
          <option>Semua Kategori</option>
          <option>Kategori 1</option>
          <option>Kategori 2</option>
        </select>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <div
            key={product.id}
            className="overflow-hidden rounded-xl bg-white shadow-md transition-shadow hover:shadow-lg"
          >
            <div className="flex h-48 items-center justify-center bg-gradient-to-br from-secondary-100 to-secondary-50">
              <span className="text-6xl">{product.image}</span>
            </div>
            <div className="p-6">
              <h3 className="mb-2 text-lg font-semibold text-gray-800">{product.name}</h3>
              <p className="mb-4 text-2xl font-bold text-secondary-600">{product.price}</p>
              <div className="mb-4 flex items-center justify-between">
                <span
                  className={`text-sm font-medium ${
                    product.stock === "Tersedia" ? "text-green-600" : "text-orange-600"
                  }`}
                >
                  {product.stock}
                </span>
              </div>
              <button className="touch-target w-full rounded-lg bg-secondary-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-secondary-600">
                Pesan Sekarang
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
