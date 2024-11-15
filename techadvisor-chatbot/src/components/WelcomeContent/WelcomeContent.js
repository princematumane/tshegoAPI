import React from 'react';
import techAdvisor from '../../techAdvisor.png';
import './WelcomeContent.css'

const WelcomeContent = ({ onWelcomeButtonClick }) => {
  return (
    <div >
      <img src={techAdvisor} alt="TechAdvisor Chatbot" style={{ width: '158px' }} />
      <p className='text-techAdvisor'>TechAdvisor</p>
      <p className='text-description'>Simplify Enrollment, Empower Your Journey</p>
      <button className="welcome" onClick={onWelcomeButtonClick}>
        Welcome
      </button>
    </div>
  );
};

export default WelcomeContent;
