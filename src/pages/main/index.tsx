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
            <ul>
              <li>
                <Link to="/upload-image">Загрузка изображений</Link>
              </li>
              <li>
                <Link to="/create-event">Создание мероприятие</Link>
              </li>
              <li>
                <Link to="/create-location">Создать локацию</Link>
              </li>
            </ul>
          </nav>
        </main>
      </div>
    </div>
  );
};

export default MainPage;