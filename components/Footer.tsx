import Link from "next/link";
import Logo from "@/components/Logo";

export default function Footer() {
  return (
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
              Ibu Berkarir dalam Dalam rumah
            </p>
          </div>
          <div>
            <h4 className="mb-3 font-bold text-white">Informasi</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/profil" className="text-gray-300 transition-colors hover:text-white">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link href="/brand" className="text-gray-300 transition-colors hover:text-white">
                  Brand
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 font-bold text-white">Kontak</h4>
            <ul className="space-y-2">
              <li className="text-gray-300">Email: info@laili.com</li>
              <li className="text-gray-300">WhatsApp: 0812-3456-7890</li>
            </ul>
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
  );
}
