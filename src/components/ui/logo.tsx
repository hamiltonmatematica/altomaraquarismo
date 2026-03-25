'use client';

import Link from 'next/link';

interface LogoProps {
    className?: string;
    size?: 'sm' | 'md' | 'lg';
}

export default function Logo({ className = '', size = 'md' }: LogoProps) {
    const sizes = {
        sm: 'text-lg',
        md: 'text-xl',
        lg: 'text-2xl',
    };

    return (
        <Link href="/" className={`flex items-center gap-2 group ${className}`}>
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                    <span className="material-symbols-outlined text-white text-lg">waves</span>
                </div>
                <div className="flex flex-col leading-none">
                    <span className={`${sizes[size]} font-black bg-gradient-to-r from-cyan-600 to-blue-700 bg-clip-text text-transparent`}>
                        Alto Mar
                    </span>
                    <span className="text-[9px] font-bold uppercase tracking-[3px] text-slate-400">Aquarismo</span>
                </div>
            </div>
        </Link>
    );
}
