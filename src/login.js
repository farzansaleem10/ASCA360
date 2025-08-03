import React, { useState } from 'react';
import './login.css';
import AscaLogin from './asca';
import StudentLogin from './student';
import AscaCommittee from './comit';
import McaStudent from './alumini';

const App = () => {
  const [selectedLogin, setSelectedLogin] = useState('Asca Login');



  const renderRightPanel = () => {
    switch (selectedLogin) {
      case 'Asca Login':
        return <AscaLogin />;
      case 'Student Login':
        return <StudentLogin />;
      case 'Asca Committee':
        return <AscaCommittee />;
      case 'Mca Students':
        return <McaStudent />;
      default:
        return <AscaLogin />;
    }
  };

  return (
    <div className="container">
      <div className="left-panel">
        <div className="logo-section">
          <img src="image.png" alt="Logo" className="logo" />
          <h1 className="brand">ASCA 360</h1>
        </div>

        <div className="login-options">
          {['Asca Login', 'Student Login', 'Mca Students', 'Asca Committee'].map((label) => (
            <div
              className="login-item"
              key={label}
              onClick={() => setSelectedLogin(label)}
            >
              {label}
            </div>
          ))}
        </div>
      </div>

      <div className="right-panel">{renderRightPanel()}</div>
    </div>
  );
};

export default App;
