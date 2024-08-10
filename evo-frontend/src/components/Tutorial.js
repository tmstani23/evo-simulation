import React from 'react';

const Tutorial = () => {
  return (
    <div className="tutorial-container p-8 bg-gray-900 text-white">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-5xl font-bold">EvoLife Tutorial</h2>
        <button onClick={() => window.location.href='/'} className="px-6 py-3 bg-blue-500 text-white rounded-full text-lg font-semibold hover:bg-blue-600 transition duration-300 ease-in-out">
          To Simulation
        </button>
      </div>
      <p className="mb-8 leading-relaxed">
        <strong className="text-2xl">Welcome to EvoLife Simulation!</strong>
        <br /><br />
        <strong className="text-xl">Introduction</strong>
        <br />
        Welcome to EvoLife, a dynamic simulation where you can witness the fascinating interplay of creatures, predators, and their environment. This guide will walk you through the functionalities of the simulation and explain the underlying mechanics that drive this miniature ecosystem.
        <br /><br />
        <strong className="text-xl">Getting Started</strong>
        <br />
        When you first load the EvoLife simulation, you'll see a grid populated with various elements:
        <ul className="list-disc list-inside ml-4">
          <li><span className="text-teal-400">Creatures (Cyan)</span>: These represent different life forms trying to survive and reproduce.</li>
          <li><span className="text-pink-400">Predators (Magenta)</span>: These are more aggressive life forms that hunt creatures.</li>
          <li><span className="text-orange-400">Food (Orange Squares)</span>: The primary resource that creatures and predators need to consume to survive.</li>
        </ul>
        <br />
        <strong className="text-xl">Simulation Key</strong>
        <br />
        On the left-hand side, you will find the Simulation Key which helps you identify the different elements:
        <ul className="list-disc list-inside ml-4">
          <li><span className="text-teal-400">Creatures</span>: Represented in cyan, these entities move around the grid, searching for food and reproducing.</li>
          <li><span className="text-pink-400">Predators</span>: Shown in magenta, these entities hunt creatures and reproduce.</li>
          <li><span className="text-orange-400">Food</span>: Marked as orange squares, scattered across the grid for creatures and predators to consume.</li>
          <li><span className="text-cyan-200">Creature Offspring</span>: Very light cyan, representing new creatures born from existing ones.</li>
          <li><span className="text-pink-200">Predator Offspring</span>: Very light magenta, indicating new predators born from existing ones.</li>
        </ul>
        <br />
        <strong className="text-xl">Controls</strong>
        <br />
        Below the grid, you have several control buttons:
        <ul className="list-disc list-inside ml-4">
          <li><strong>Start Simulation</strong>: Begins the simulation, allowing creatures and predators to move, consume food, and interact.</li>
          <li><strong>Stop Simulation</strong>: Pauses the simulation, freezing all actions but keeping the state intact.</li>
          <li><strong>Reset Simulation</strong>: Stops the current simulation and resets everything to the initial state.</li>
          <li><strong>Toggle Debug Mode</strong>: Activates the debug mode, showing additional information like the vision and speed of the creatures and predators.</li>
        </ul>
        <br />
        <strong className="text-xl">Debug Mode</strong>
        <br />
        When you toggle the debug mode, you will see:
        <ul className="list-disc list-inside ml-4">
          <li><strong>Vision</strong>: Represented by yellow circles around creatures and predators, indicating their vision range.</li>
          <li><strong>Speed</strong>: Indicated by blue arrows showing the direction and magnitude of movement. The width of the arrow represents the strength of the creature or predator.</li>
        </ul>
        <br />
        <strong className="text-xl">Genetic Code</strong>
        <br />
        Each creature and predator in the simulation has a unique genetic code that determines its characteristics:
        <ul className="list-disc list-inside ml-4">
          <li><strong>Health</strong>: Determines the size and longevity of the entity.</li>
          <li><strong>Speed</strong>: Dictates how fast the entity can move across the grid.</li>
          <li><strong>Vision</strong>: Defines how far the entity can see to locate food or other entities.</li>
          <li><strong>Strength</strong>: Influences the width of the speed arrow and the entity's ability to hunt or escape.</li>
        </ul>
        <br />
        <strong className="text-xl">The Cycle of Life</strong>
        <br />
        <ul className="list-disc list-inside ml-4">
          <li><strong>Movement</strong>: Creatures and predators move around the grid based on their genetic code, searching for food and avoiding danger.</li>
          <li><strong>Consumption</strong>: When a creature or predator encounters food, it consumes it, replenishing its health.</li>
          <li><strong>Reproduction</strong>: Creatures and predators reproduce when they have sufficient health, creating offspring with a mix of their genetic characteristics.</li>
          <li><strong>Hunting</strong>: Predators actively hunt creatures, and successful hunts result in the predator consuming the creature to gain health.</li>
        </ul>
        <br />
        <strong className="text-xl">Simulation Dynamics</strong>
        <br />
        The simulation dynamically adjusts based on the interactions between creatures, predators, and their environment. The genetic diversity and interactions lead to natural selection, where only the fittest survive and reproduce.
        <br /><br />
        <strong className="text-xl">How to Use the Tutorial</strong>
        <br />
        To explore the detailed workings of EvoLife, you can pause the simulation at any time to analyze specific interactions or toggle the debug mode to see behind-the-scenes data. The tutorial is here to guide you through the complexities of the simulation, ensuring you have a comprehensive understanding of each component and its role in the ecosystem.
        <br /><br />
        <strong className="text-xl">Conclusion</strong>
        <br />
        EvoLife is more than just a simulation; it's a window into the principles of evolution, natural selection, and survival. As you interact with the simulation, you'll gain insights into how genetic traits affect the survival and reproduction of organisms in a dynamic environment.
        <br /><br />
        Enjoy exploring EvoLife, and don't hesitate to experiment with the controls and settings to see how changes impact the ecosystem. Happy simulating!
      </p>
    </div>
  );
};

export default Tutorial;
