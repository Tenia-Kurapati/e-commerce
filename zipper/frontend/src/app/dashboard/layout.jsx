// frontend/src/app/(main)/layout.js
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import OrdersPanel from '@/components/OrdersPanel';

// This layout will be applied to all pages INSIDE the (main) folder.
export default function MainAppLayout({ children }) {
    return (
        <>
            <Header />
            <OrdersPanel />
            <main className="max-w-full m-0 p-0">
                {children}
            </main>
            <Footer />
        </>
    );
}