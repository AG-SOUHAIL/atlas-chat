import Button from "./Button";
import { useNavigate} from 'react-router-dom';



export default function Card({ name, content, imageUrl, to, isOnline }) {

    const navigate = useNavigate();

    console.log(isOnline);

    const nav = () => {
        navigate(to);
    };

    const cardStyle = {
        // border: '1px solid #ccc',
        // borderRadius: '8px',
        overflow: 'hidden',
        // margin: '20px',
        width: '100%',
        height: 100,
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#232D3F',
    };

    const imageStyle = {
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        objectFit: 'cover',
        border: '1px solid #ccc',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
    };

    const contentStyle = {
        padding: '16px',
        color: "#fff",
    };

    const titleStyle = {
        fontSize: '1.2rem',
        margin: 0,
    };

    const contenetTextStyle = {
        fontSize: '0.7rem',
        margin: 0,
        color: isOnline ? '#059212' : '#fff',
    };

    return (
        <div style={cardStyle}>
            <div>
                <Button onClick={nav} color={'transparent'} label={'<'}/>
            </div>
            <img src={imageUrl} alt={name} style={imageStyle} />
            <div style={contentStyle}>
                <h2 style={titleStyle}>{name}</h2>
                <div style={contenetTextStyle}>{isOnline ? '👀' : `Last activity: ${content}`}</div>
            </div>
        </div>
    )
}