# Creature Simulation

This project is a creature simulation where virtual creatures move within a grid environment. The simulation includes basic mechanics for movement, health management, and genetic variables.

Current Live Version at: https://evo-simulation-7wqp6i5sn-tmstani23s-projects.vercel.app/

## Features

- **Grid Environment:** A fixed-size grid where creatures move, find food, and interact.
- **Creature Initialization:** Creatures are initialized with genetic codes that determine their attributes such as health, speed, and direction.
- **Genetic Code, Crossover, and Mutation:** 
  - Each creature has a unique genetic code that influences its behavior and characteristics.
  - During reproduction, genetic crossover combines genetic codes from two parent creatures, introducing variability.
  - Mutations are applied to offspring at a specified rate, ensuring diversity and evolution within the population.
- **Movement Mechanics:** Creatures move within the grid based on their genetic attributes. They bounce back upon hitting grid boundaries.
- **Health Management:** Creatures lose health over time and can be removed from the grid when their health reaches zero.
- **Mutation Sliders:** Real-time sliders allow adjustment of genetic variables affecting the creatures.

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/tmstani23/evo-simulation



2. **Navigate to the project directory:**
   ```bash
   cd evo-simulation

2. **Install dependencies:**
   ```bash
   npm install

    
Usage

2. **Start the development server:**
   ```bash
   cd evo-frontend
   npm start

2. **Open the simulation in your browser:**
   ```bash
   http://localhost:3000

### License

This project is licensed under the MIT License.