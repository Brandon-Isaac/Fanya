import { CheckSquare } from 'lucide-react';

export function AppHeader() {
  return (
    <header className="py-6 px-4 md:px-8 border-b border-border bg-card shadow-sm sticky top-0 z-50">
      <div className="container mx-auto flex items-center gap-3">
        <CheckSquare className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold text-foreground font-headline">FanyaFocus</h1>
      </div>
    </header>
  );
}
