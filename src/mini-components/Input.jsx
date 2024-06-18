
export default function Input({ type, placeholder, value, onChange, width, height}) {
  
    const inputStyle = {
        padding: '10px',
        margin: '5px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        fontSize: '16px',
        width: width || '250px',
      };

    return (
    <input
      type={type || 'text'}
      placeholder={placeholder || 'Enter text...'}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={inputStyle}
    />
  )
}