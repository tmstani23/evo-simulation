import React, { useState } from 'react';
import { Creature, Predator, FoodItem } from './GridItems';
import '../App.css';

const Grid = ({ creatures, predators, foodItems, debugMode, onClickCreature }) => {
  const [hoveredCreature, setHoveredCreature] = useState(null);
  const [tooltipContent, setTooltipContent] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

  const handleMouseEnter = (e, creature) => {
    setHoveredCreature(creature.id);
    const velocityInfo = creature.velocity
      ? `\nSpeed: ${creature.velocity.speed.toFixed(2)}\nDirection: ${creature.velocity.direction.toFixed(2)}`
      : '';
    setTooltipContent(`ID: ${creature.id}\nHealth: ${creature.health.current}/${creature.health.max}${velocityInfo}`);
    setTooltipPosition({ top: e.clientY + 10, left: e.clientX + 10 });
  };

  const handleMouseLeave = () => {
    setHoveredCreature(null);
    setTooltipContent(null);
  };

  const handleMouseMove = (e) => {
    setTooltipPosition({ top: e.clientY + 10, left: e.clientX + 10 });
  };

  return (
    <div className="grid">
      <div className="grid-content">
        {foodItems.map(food => (
          <FoodItem key={food.id} food={food} />
        ))}
        {creatures.map(creature => (
          <Creature
            key={creature.id}
            creature={creature}
            debugMode={debugMode}
            onClick={() => onClickCreature(creature)}
            onMouseEnter={(e) => handleMouseEnter(e, creature)}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
          />
        ))}
        {predators.map(predator => (
          <Predator
            key={predator.id}
            predator={predator}
            debugMode={debugMode}
            onClick={() => onClickCreature(predator)}
            onMouseEnter={(e) => handleMouseEnter(e, predator)}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
          />
        ))}
        {tooltipContent && (
          <div className="creature-tooltip" style={{ top: tooltipPosition.top, left: tooltipPosition.left }}>
            {tooltipContent.split('\n').map((line, index) => (
              <div key={index}>{line}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Grid;
