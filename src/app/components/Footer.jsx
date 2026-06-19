import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#1a1a2e] pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
          {/* LOGO SECTION */}
          <div className="col-span-1">
            <Link href="/" className="flex items-center gap-3">
              <img src="/logo.png" alt="Logo" className="h-10 w-10 object-contain" />
              <span className="text-xl font-bold text-white">Promptrix</span>
            </Link>
            <p className="mt-4 text-sm text-gray-400 leading-relaxed">
              AI prompt marketplace for discovering, buying, and selling verified prompts across text, image, video, audio, and 3D workflows.
            </p>
          </div>

          {/* LINKS COLUMNS */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6">Marketplace</h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link href="/gallery" className="hover:text-white transition">Gallery</Link></li>
              <li><Link href="/market" className="hover:text-white transition">Prompt Market</Link></li>
              <li><Link href="/shops" className="hover:text-white transition">Top Shops</Link></li>
              <li><Link href="/sell" className="hover:text-white transition">Start selling</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6">Resources</h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link href="/guide" className="hover:text-white transition">Guide to Prompt Submission</Link></li>
              <li><Link href="/faqs" className="hover:text-white transition">FAQs</Link></li>
              <li><Link href="/changelog" className="hover:text-white transition">Changelog</Link></li>
              <li><Link href="/support" className="hover:text-white transition">Support</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6">Company</h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link href="/about" className="hover:text-white transition">About Us</Link></li>
              <li><Link href="/blog" className="hover:text-white transition">Blog</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition">Terms of Use</Link></li>
            </ul>
          </div>
        </div>

        {/* BOTTOM SECTION */}
        <div className="mt-16 border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 gap-4">
          <p>© 2026 Promptrix. All rights reserved.</p>
          <p>Payments secured by Stripe.</p>
          <p>Platform design and development by Promptrix Team.</p>
        </div>
      </div>
    </footer>
  );
}