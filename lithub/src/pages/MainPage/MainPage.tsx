// MainPage.tsx
import React from 'react';
import './MainPage.css'; // Import CSS file for styling
import testImage from '../test.png';

const MainPage: React.FC = () => {
    return (
        <img src={testImage} alt="Guy" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: -1 }} />
    );
}

export default MainPage;