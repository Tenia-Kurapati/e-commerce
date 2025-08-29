'use client';

import { CheckCircle2, XCircle, AlertTriangle, Info } from 'lucide-react';

const VARIANTS = {
    success: {
        icon: CheckCircle2,
        iconColor: 'text-emerald-500',
        gradientFrom: 'from-emerald-400',
        gradientVia: 'via-teal-400',
        gradientTo: 'to-cyan-400',
        glowColor: 'rgba(52, 211, 153, 0.4)',
        blobColor1: '52, 211, 153',  // emerald-400
        blobColor2: '45, 212, 191',  // teal-400
    },
    error: {
        icon: XCircle,
        iconColor: 'text-rose-500',
        gradientFrom: 'from-rose-400',
        gradientVia: 'via-pink-400',
        gradientTo: 'to-fuchsia-400',
        glowColor: 'rgba(251, 113, 133, 0.4)',
        blobColor1: '251, 113, 133',  // rose-400
        blobColor2: '244, 114, 182',  // pink-400
    },
    warning: {
        icon: AlertTriangle,
        iconColor: 'text-amber-500',
        gradientFrom: 'from-amber-400',
        gradientVia: 'via-orange-400',
        gradientTo: 'to-yellow-400',
        glowColor: 'rgba(251, 191, 36, 0.4)',
        blobColor1: '251, 191, 36',   // amber-400
        blobColor2: '251, 146, 60',   // orange-400
    },
    info: {
        icon: Info,
        iconColor: 'text-sky-500',
        gradientFrom: 'from-sky-400',
        gradientVia: 'via-blue-400',
        gradientTo: 'to-indigo-400',
        glowColor: 'rgba(56, 189, 248, 0.4)',
        blobColor1: '56, 189, 248',   // sky-400
        blobColor2: '96, 165, 250',   // blue-400
    },
};

export function Toaster({ notifications = [] }) {
    return (
        <div
            className="fixed top-6 right-6 z-[100] w-full max-w-sm space-y-4 pointer-events-none"
            aria-live="polite"
            aria-atomic="true"
        >
            {notifications.map((n, idx) => {
                const v = VARIANTS[n.variant] ?? VARIANTS.info;
                const Icon = v.icon;

                return (
                    <div key={n.id} className="pointer-events-auto">
                        <div
                            className={[
                                'relative overflow-hidden',
                                // Super rounded for fluid look
                                'rounded-3xl',
                                // Glass morphism with color tint
                                'bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl backdrop-saturate-150',
                                'text-slate-900 dark:text-slate-50',
                                // Soft, colorful shadow
                                'shadow-2xl shadow-black/10',
                                // Content layout
                                'flex items-center gap-4 p-5',
                                // Bouncy entrance
                                'animate-[toast-bounce-in_600ms_cubic-bezier(0.68,-0.55,0.265,1.55)_both]',
                                // Hover lift
                                'transition-all duration-300 ease-out hover:scale-[1.02] hover:-translate-y-1',
                                'hover:shadow-2xl',
                            ].join(' ')}
                            style={{
                                animationDelay: `${idx * 80}ms`,
                                boxShadow: `0 20px 40px -12px ${v.glowColor}`,
                            }}
                            data-leaving={n.leaving ? 'true' : 'false'}
                        >
                            {/* Fluid blob backgrounds */}
                            <div className="absolute inset-0 -z-10">
                                <div
                                    className="absolute -top-12 -left-12 h-32 w-32 rounded-full blur-3xl animate-blob"
                                    style={{
                                        background: `radial-gradient(circle, rgba(${v.blobColor1}, 0.15), transparent 70%)`,
                                        animation: 'blob 7s infinite',
                                    }}
                                />
                                <div
                                    className="absolute -bottom-12 -right-12 h-40 w-40 rounded-full blur-3xl animate-blob animation-delay-2000"
                                    style={{
                                        background: `radial-gradient(circle, rgba(${v.blobColor2}, 0.12), transparent 70%)`,
                                        animation: 'blob 7s infinite 2s',
                                    }}
                                />
                                <div
                                    className="absolute top-0 right-20 h-28 w-28 rounded-full blur-3xl animate-blob animation-delay-4000"
                                    style={{
                                        background: `radial-gradient(circle, rgba(${v.blobColor1}, 0.10), transparent 70%)`,
                                        animation: 'blob 7s infinite 4s',
                                    }}
                                />
                            </div>

                            {/* Animated gradient icon container */}
                            {/* Animated gradient icon container - Extra small version */}
                            <div className="relative flex-shrink-0">
                                <div
                                    className={[
                                        'relative h-8 w-8 rounded-xl',  // Even smaller
                                        'bg-gradient-to-br',
                                        v.gradientFrom,
                                        v.gradientVia,
                                        v.gradientTo,
                                        'shadow-lg',
                                        'flex items-center justify-center',
                                        'animate-[icon-pop_600ms_cubic-bezier(0.68,-0.55,0.265,1.55)_200ms_both]',
                                    ].join(' ')}
                                >
                                    <Icon className="h-4 w-4 text-white animate-[icon-bounce_2s_ease-in-out_600ms_infinite]" />
                                </div>
                                {/* Icon glow pulse */}
                                <div
                                    className="absolute inset-0 rounded-xl blur-xl opacity-50 animate-pulse"
                                    style={{
                                        background: `linear-gradient(135deg, ${v.glowColor}, transparent)`,
                                    }}
                                />
                            </div>

                            {/* Content with subtle animation */}
                            <div className="relative z-10 min-w-0 flex-1 animate-[content-fade_400ms_ease-out_300ms_both]">
                                <p className="text-sm font-semibold leading-5">
                                    {n.message}
                                </p>
                                {n.description && (
                                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                                        {n.description}
                                    </p>
                                )}
                            </div>

                            {/* Fluid progress bar */}
                            <div className="absolute bottom-0 left-0 right-0 h-1 overflow-hidden rounded-b-3xl">
                                <div
                                    className={[
                                        'h-full origin-left',
                                        'bg-gradient-to-r',
                                        v.gradientFrom,
                                        v.gradientVia,
                                        v.gradientTo,
                                        'opacity-80',
                                    ].join(' ')}
                                    style={{
                                        animation: 'progress-fluid linear forwards',
                                        animationDuration: `${n.duration ?? 4000}ms`,
                                        boxShadow: `0 0 20px ${v.glowColor}`,
                                    }}
                                />
                            </div>

                            {/* Exit animation overlay */}
                            <div
                                className="absolute inset-0 rounded-3xl data-[leaving=true]:animate-[toast-bounce-out_400ms_cubic-bezier(0.68,-0.55,0.755,0.055)_forwards]"
                                data-leaving={n.leaving ? 'true' : 'false'}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}