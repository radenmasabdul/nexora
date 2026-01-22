interface PageContainerProps {
  children: React.ReactNode;
}

export default function PageContainer({ children }: PageContainerProps) {
  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto space-y-6"> {children} </div>
    </main>
  );
}