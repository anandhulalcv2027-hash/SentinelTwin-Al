

export const DatePickerWithRange = ({ date, setDate, className }: any) => {
  return (
    <div className={className} style={{ display: 'flex', gap: '8px' }}>
      <input 
        type="date" 
        className="st-input"
        onChange={(e) => setDate({ ...date, from: new Date(e.target.value) })}
      />
      <input 
        type="date" 
        className="st-input"
        onChange={(e) => setDate({ ...date, to: new Date(e.target.value) })}
      />
    </div>
  );
};
