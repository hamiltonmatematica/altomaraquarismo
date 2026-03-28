import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { LucideProps } from 'lucide-react';
import dynamicIconImports from 'lucide-react/dynamicIconImports';

// Fallback para quando o ícone não for encontrado
const Fallback = () => <div className="w-full h-full bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />;

interface IconProps extends Omit<LucideProps, 'ref'> {
  name: string;
}

export function Icon({ name, ...props }: IconProps) {
  // Verifica se o nome do ícone existe no dynamicIconImports
  const isLucide = name in dynamicIconImports;

  if (isLucide) {
    const LucideIcon = dynamic(dynamicIconImports[name as keyof typeof dynamicIconImports], {
      loading: () => <Fallback />,
    });
    return <LucideIcon {...props} />;
  }

  // Fallback para Material Symbols caso não seja Lucide e estejamos em transição
  return (
    <span className="material-symbols-outlined" style={{ fontSize: props.size, color: props.color }}>
      {name}
    </span>
  );
}
