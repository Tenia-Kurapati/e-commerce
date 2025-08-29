// frontend/src/components/Logo.jsx

// This is a reusable component for your brand logo.
export default function Logo() {
    return (
        <div className="flex items-center justify-center gap-2">
            {/* 2. Replace the Package component with the Store component */}
            <div className="text-3xl font-bold text-slate-800 tracking-tight">
                <span className="bg-slate-800 text-white rounded-md px-2.5 py-1 mr-1">P</span>
                roShop
            </div>
        </div>
    );
}
