interface CardContentProps {
  children: React.ReactNode;
}

export default function CardContent({ children } : CardContentProps) {
  return (
    <div className="bg-background rounded-xl shadow-sm border border-default p-4 my-6">
      {children}
    </div>
  )
}