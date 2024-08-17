import { Link } from 'react-router-dom'
import '../App';
import Navbar from '../../Components/Navbar.jsx';
import HomeContent from '../../Components/HomeContent.jsx';

export default function Home() {
    return (
        <div id='page-container'>
            <Navbar />
            <HomeContent />
        </div>
    )
}