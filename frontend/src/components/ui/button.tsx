

export const Button = ({ children, onClick, style, variant = 'primary' }: any) => {
  const bg = variant === 'destructive' ? '#ef4444' : variant === 'outline' ? 'transparent' : '#3b82f6';
  const border = variant === 'outline' ? '1px solid #3f3f46' : 'none';
  return (
    <button 
      onClick={onClick}
      style={{ padding: '8px 16px', borderRadius: '6px', background: bg, border, color: '#fff', cursor: 'pointer', ...style }}
    >
      {children}
    </button>
  );
};
