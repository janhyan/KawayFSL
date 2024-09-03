import { Link } from 'react-router-dom'
import '../App.css';
import Navbar from '../../Components/Navbar.jsx';
import HomeContent from '../../Components/HomeContent.jsx';

export default function Home() {

    console.log(import.meta.env.REACT_APP_CLIENT_ID)
    return (
        <div id='page-container'>
            <Navbar />
            <HomeContent />
        </div>
    )
}