// components/Footer.jsx
'use client';

import Link from 'next/link';
import { Twitter, Linkedin, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="p-6 border-t border-white/60">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-xl font-bold text-slate-800 tracking-wider">
            <span className="bg-slate-800 text-white rounded-md px-2 py-1 mr-1">P</span>roShop
          </Link>
          <p className="text-sm text-slate-500 hidden md:block">
            &copy; {new Date().getFullYear()} All Rights Reserved.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium text-slate-600">Follow us on:</span>
          <div className="flex items-center gap-1 text-gray-400">
            <a href="#" aria-label="Twitter" className="p-2 rounded-full hover:bg-gray-200/50 hover:text-slate-800 transition-colors"><Twitter size={18}/></a>
            <a href="https://www.linkedin.com/in/tenia-kurapati-896809273/" aria-label="LinkedIn" className="p-2 rounded-full hover:bg-gray-200/50 hover:text-slate-800 transition-colors"><Linkedin size={18}/></a>
            <a href="#" aria-label="Instagram" className="p-2 rounded-full hover:bg-gray-200/50 hover:text-slate-800 transition-colors"><Instagram size={18}/></a>
          </div>
        </div>
      </div>
    </footer>
  );
}