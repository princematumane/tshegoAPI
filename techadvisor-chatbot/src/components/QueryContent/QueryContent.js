// AdmissionContent.js
import React from 'react';

const AdmissionContent = ({ userOption }) => {
    return (
        <div className="admission-content">
            <h2>Admission Requirements</h2>
            <p>You selected: <strong>{userOption}</strong></p>
            <p>Here are the admission requirements for Tshwane University of Technology:</p>
            <ul>
                <li>National Senior Certificate (NSC) with appropriate APS scores</li>
                <li>Specific subject requirements for chosen courses</li>
                <li>Submission of required documents during application</li>
                <li>Additional faculty-specific requirements may apply</li>
            </ul>
            <p>For more detailed information, please visit our official <a href="https://www.tut.ac.za">TUT Admissions page</a>.</p>
        </div>
    );
};

export default AdmissionContent;
