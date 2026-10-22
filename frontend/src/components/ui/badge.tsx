

export const Badge = ({ children, variant, style }: any) => {
  const bg = variant === "destructive" ? "#ef4444" : variant === "outline" ? "transparent" : "#3b82f6";
  const border = variant === "outline" ? "1px solid #3f3f46" : "none";
  return (
    <span style={{ padding: "4px 8px", borderRadius: "999px", fontSize: "0.75rem", background: bg, border, color: "#fff", ...style }}>
      {children}
    </span>
  );
};
