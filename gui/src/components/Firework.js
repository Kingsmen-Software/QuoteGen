import React from 'react';
import Particles from 'react-particles';

const Firework = () => {
  return (
    <Particles
      className="firework"
      params={{
        particles: {
          number: {
            value: 100,
          },
          size: {
            value: 5,
          },
          line_linked: {
            enable: false,
          },
          move: {
            speed: 0.5,
          },
          color: {
            value: ['#FF1461', '#18FF92', '#5A87FF', '#FBF38C'],
          },
        },
      }}
    />
  );
};

export default Firework;