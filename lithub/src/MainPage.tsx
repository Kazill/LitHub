// MainPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import './MainPage.css'; // Import CSS file for styling

const MainPage: React.FC = () => {
    return (
        <div className="main-page">
            <div className="content">
                <h1>IT projektų ir neatlygintinų IT specialistų platforma</h1>
                <Link to="/projects">
                    <button>Projektai</button>
                </Link>
            </div>
        </div>
    );
}

export default MainPage;