interface GlobalHeaderProps {
  title: string;
  description?: string;
  rightContent?: React.ReactNode;
}

export default function GlobalHeader({ title, description, rightContent }: GlobalHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4">
        <div>
            <h1 className="text-3xl font-bold text-primary">{title}</h1>
            {description && ( <p className="mt-1 text-secondary">{description}</p>)}
        </div>
        {rightContent && ( <div className="flex items-center">{rightContent}</div>)}
    </div>
  );
}