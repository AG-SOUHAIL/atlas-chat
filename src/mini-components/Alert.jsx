
export default function Alert({ type, message, index }) {

    const alertStyle = {
        position: 'fixed',
        top: `${index * 85}px`,
        right: 0,
        margin: '15px',
        padding: '15px',
        borderRadius: '5px',
        fontSize: '16px',
        backgroundColor: type === 'success' ? '#d4edda' : type === 'error' ? '#f8d7da' : '#cce5ff',
        border: type === 'success' ? '1px solid #c3e6cb' : type === 'error' ? '1px solid #f5c6cb' : '1px solid #b8daff',
        color: type === 'success' ? '#155724' : type === 'error' ? '#721c24' : '#004085',
      };

  return (
    <div data-aos="fade-left" style={alertStyle}>
      <p>{message}</p>
    </div>
  )
}