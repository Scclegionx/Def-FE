import { useState, useEffect } from 'react';

const GunTowerAnimation = () => {
  const [angle, setAngle] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Simulate data from Arduino
    const interval = setInterval(() => {
      setAngle({
        x: Math.random() * 360,
        y: Math.random() * 360
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="gun-tower-container">
      <div className="tower-base">
        <div
          className="tower-head"
          style={{
            transform: `rotateX(${angle.x}deg) rotateY(${angle.y}deg)`,
            transition: 'transform 0.5s ease-in-out'
          }}
        >
          <div className="tower-gun" />
        </div>
        <div className="tower-pillar" />
      </div>
      <div className="angle-display">
        <h3 className="angle-title">Current Angle</h3>
        <p className="angle-value">X: {angle.x.toFixed(1)}°</p>
        <p className="angle-value">Y: {angle.y.toFixed(1)}°</p>
      </div>
    </div>
  );
};

export default GunTowerAnimation; 