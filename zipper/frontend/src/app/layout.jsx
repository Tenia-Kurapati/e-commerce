// frontend/src/app/layout.js
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { LikesProvider } from '@/context/LikesContext';
import { PurchasesProvider } from '@/context/PurchasesContext';
import { NotificationProvider } from '@/context/NotificationContext';
import { UIProvider } from '@/context/UIContext';
// DO NOT import Header or Footer here anymore

export const metadata = {
  title: 'ProShop',
  description: 'The finest products, delivered to you.',
};

// This is now a minimal root layout that applies providers to ALL pages.
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="max-w-full m-0 p-0 bg-gray-100">
        <AuthProvider>
          <NotificationProvider>
            <UIProvider>
              <CartProvider>
                <LikesProvider>
                  <PurchasesProvider>
                    {children} {/* Render children directly, without Header/Footer */}
                  </PurchasesProvider>
                </LikesProvider>
              </CartProvider>
            </UIProvider>
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}