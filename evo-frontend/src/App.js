import React, { useState } from 'react';
import { generateGeneticCode, mutateGeneticCode, crossoverGeneticCode } from './genetics/geneticCodeTemplate';
import { geneticVariables } from './genetics/geneticVariables';

const App = () => {
  // State to manage the list of genetic codes
  const [geneticCodes, setGeneticCodes] = useState(Array.from({ length: 10 }, () => generateGeneticCode(geneticVariables)));
  
  // State to manage the genetic variables for real-time manipulation
  const [variables, setVariables] = useState(geneticVariables);

  // Handler function to update genetic variables in real-time
  const handleVariableChange = (variableName, subVariableName, value) => {
    if (variableName === 'mutationRate') {
      setVariables(prevState => ({
        ...prevState,
        mutationRate: value
      }));
    } else {
      setVariables(prevState => ({
        ...prevState,
        [variableName]: {
          ...prevState[variableName],
          [subVariableName]: value
        }
      }));
    }
  };

  // Handler to regenerate genetic codes based on current variables
  const regenerateGeneticCodes = () => {
    setGeneticCodes(Array.from({ length: 10 }, () => generateGeneticCode(variables)));
  };

  // Handler to mutate a specific genetic code
  const handleMutate = (index) => {
    console.log('Mutate button clicked for index:', index);
    console.log('Current mutation rate:', variables.mutationRate);
    const newGeneticCodes = [...geneticCodes];
    newGeneticCodes[index] = mutateGeneticCode(geneticCodes[index], variables.mutationRate);  // Pass mutation rate as argument
    console.log('Old genetic code:', geneticCodes[index]);
    console.log('New genetic code:', newGeneticCodes[index]);
    setGeneticCodes(newGeneticCodes);
  };

  // Handler to crossover two genetic codes and create a new offspring genetic code
const handleCrossover = (index1, index2) => {
  const newGeneticCodes = [...geneticCodes];
  const offspring = crossoverGeneticCode(geneticCodes[index1], geneticCodes[index2]);
  console.log('Parent 1:', geneticCodes[index1]); // Log parent 1
  console.log('Parent 2:', geneticCodes[index2]); // Log parent 2
  console.log('Offspring (before mutation):', offspring); // Log offspring before mutation
  const mutatedOffspring = mutateGeneticCode(offspring, variables.mutationRate);
  console.log('Offspring (after mutation):', mutatedOffspring); // Log offspring after mutation
  newGeneticCodes.push(mutatedOffspring);
  setGeneticCodes(newGeneticCodes);
};

  return (
    <div>
      {/* Display the current list of genetic codes */}
      <h1>Genetic Code Structure</h1>
      <pre>{JSON.stringify(geneticCodes, null, 2)}</pre>

      {/* UI section for manipulating genetic variables */}
      <h2>Genetic Variables</h2>
      {Object.keys(variables).map(key => (
        <div key={key}>
          <h3>{key}</h3>
          {Object.keys(variables[key]).map(subKey => (
            <div key={subKey}>
              <label>{subKey}: </label>
              <input
                type="number"
                value={variables[key][subKey]}
                onChange={e => handleVariableChange(key, subKey, parseFloat(e.target.value))}
              />
            </div>
          ))}
        </div>
      ))}

      {/* Input to adjust the mutation rate */}
      <div>
        <label>Mutation Rate: </label>
        <input
          type="number"
          min="0"
          max="1"
          step="0.1"
          value={variables.mutationRate}
          onChange={e => handleVariableChange('mutationRate', 'default', parseFloat(e.target.value))}
        />
      </div>

      {/* Button to regenerate the genetic codes based on the current variables */}
      <button onClick={regenerateGeneticCodes}>Regenerate Genetic Codes</button>
      <span> - Generates new genetic codes based on the current variables.</span>

      {/* UI section for performing actions on genetic codes */}
      <h2>Genetic Code Actions</h2>
      {geneticCodes.map((code, index) => (
        <div key={code.id}>
          <h3>Genetic Code {index + 1}</h3>
          {/* Button to mutate the selected genetic code */}
          <button onClick={() => handleMutate(index)}>Mutate</button>
          <span> - Applies random mutations to this genetic code.</span>
          {/* Button to crossover the selected genetic code with the next one */}
          {index < geneticCodes.length - 1 && (
            <>
              <button onClick={() => handleCrossover(index, index + 1)}>Crossover with Next</button>
              <span> - Combines this genetic code with the next one to produce an offspring, then applies mutation.</span>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default App;
