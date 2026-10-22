

export const Card = ({ children, style }: any) => <div style={{ border: "1px solid #27272a", borderRadius: "8px", background: "#18181b", padding: "16px", ...style }}>{children}</div>;
export const CardHeader = ({ children, style }: any) => <div style={{ marginBottom: "16px", ...style }}>{children}</div>;
export const CardTitle = ({ children, style }: any) => <h2 style={{ margin: 0, fontSize: "1.25rem", color: "#fff", ...style }}>{children}</h2>;
export const CardContent = ({ children, style }: any) => <div style={{ ...style }}>{children}</div>;
