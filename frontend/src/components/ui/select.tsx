

export const Select = ({ children, onValueChange, value, defaultValue, className }: any) => {
  return (
    <select 
      value={value}
      defaultValue={defaultValue}
      onChange={(e) => onValueChange && onValueChange(e.target.value)}
      className={`st-input ${className || ''}`}
      style={{ cursor: 'pointer' }}
    >
      {children}
    </select>
  );
};
export const SelectTrigger = ({ children }: any) => <>{children}</>;
export const SelectValue = ({ placeholder }: any) => placeholder ? <option value="" disabled>{placeholder}</option> : null;
export const SelectContent = ({ children }: any) => <>{children}</>;
export const SelectItem = ({ children, value }: any) => <option value={value}>{children}</option>;
