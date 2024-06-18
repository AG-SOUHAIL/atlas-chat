export default function Avatar ({ src, alt, size = '50px', margin}) {
    const avatarStyle = {
      width: size,
      height: size,
      borderRadius: '50%',
      objectFit: 'cover',
      margin: margin,
    };
  
    return <img loading="lazy" src={src} alt={alt} style={avatarStyle} />;
  };
  
