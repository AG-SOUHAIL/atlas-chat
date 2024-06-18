
export default function Button({ label, onClick, color, width, height, onKeyDown }) {

    const buttonStyle = {
        backgroundColor: color || '#3498db', // Default color is blue
        color: '#fff',
        padding: '10px 15px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        width: width,
        height: height,
        margin: '5px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 20,
      };

  return (
    <button style={buttonStyle} onClick={onClick} onKeyDown={onKeyDown}>
        {label}
    </button>
  )
}