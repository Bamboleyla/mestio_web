import React from 'react';
import { Link } from 'react-router-dom';

const MainPage: React.FC = () => {
  return (
    <div className="App">
      <div className="container">
        <header className="App-header">
          <h1>Welcome to Mestio Web</h1>
          <p>Manage your events and locations</p>
        </header>
        <main>
          <nav>
            <ul className="icon-nav">
              <li className="icon-item">
                <Link to="/upload-image" title="Загрузка изображений" className="icon-link">
                  <span className="icon">🖼️</span>
                </Link>
              </li>
              <li className="icon-item">
                <Link to="/create-event" title="Создание мероприятие" className="icon-link">
                  <span className="icon">📅</span>
                </Link>
              </li>
              <li className="icon-item">
                <Link to="/create-location" title="Создать локацию" className="icon-link">
                  <span className="icon">📍</span>
                </Link>
              </li>
            </ul>
          </nav>
        </main>
      </div>
    </div>
  );
};

export default MainPage;