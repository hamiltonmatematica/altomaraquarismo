'use client';

import Link from 'next/link';
import Image from 'next/image';

interface LogoProps {
    className?: string;
    size?: 'sm' | 'md' | 'lg';
}

export default function Logo({ className = '', size = 'md' }: LogoProps) {
    const dimensions = {
        sm: { width: 100, height: 40 },
        md: { width: 130, height: 50 },
        lg: { width: 160, height: 60 },
    };

    const { width, height } = dimensions[size];

    return (
        <Link href="/" className={`flex items-center group ${className}`}>
            <Image 
                src="/LOGO - transparente.png" 
                alt="Alto Mar Aquarismo" 
                width={width} 
                height={height}
                className="object-contain"
                priority
            />
        </Link>
    );
}
