import './MainPage.css'; // Import CSS file for styling

// MainPage.tsx
import React from 'react';

import testImage from '../test.png';

const MainPage: React.FC = () => {
    return (
        <div className="main-page" >
                        <img src={testImage} alt="Guy" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: -1, opacity: 0.3 }} /> 

            <div className="content">
                <h1 className="heading">IT projektų ir neatlygintinų IT specialistų platforma</h1>
            </div>
        </div>
    );
}

export default MainPage;