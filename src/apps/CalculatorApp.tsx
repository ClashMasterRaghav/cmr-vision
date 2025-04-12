import React, { useState } from 'react';
import AppWindow from '../components/AppWindow';
import { getAssetPath } from '../utils/assetUtils';
import '../styles/Calculator.css';

interface CalculatorAppProps {
  id: string; // Required for routing/identification even if not directly used
  title: string;
  onClose: () => void;
  data: any;
}

const CalculatorApp: React.FC<CalculatorAppProps> = ({ id, title, onClose }) => {
  const [display, setDisplay] = useState('0');
  const [operator, setOperator] = useState<string | null>(null);
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  
  const handleDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };
  
  // Used in the UI for the C button
  const clearAll = () => {
    setDisplay('0');
    setOperator(null);
    setPrevValue(null);
    setWaitingForOperand(false);
  };
  
  const handleOperator = (nextOperator: string) => {
    const inputValue = parseFloat(display);
    
    if (prevValue === null) {
      setPrevValue(inputValue);
    } else if (operator) {
      const result = performCalculation(operator, prevValue, inputValue);
      setDisplay(String(result));
      setPrevValue(result);
    }
    
    setWaitingForOperand(true);
    setOperator(nextOperator);
  };
  
  const performCalculation = (op: string, a: number, b: number): number => {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '×': return a * b;
      case '÷': return a / b;
      default: return b;
    }
  };
  
  const handleEquals = () => {
    if (operator === null || prevValue === null) return;
    
    const inputValue = parseFloat(display);
    const result = performCalculation(operator, prevValue, inputValue);
    
    setDisplay(String(result));
    setPrevValue(null);
    setOperator(null);
    setWaitingForOperand(true);
  };
  
  const handleDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };
  
  return (
    <AppWindow id={id} title={title} onClose={onClose}>
      <div className="calculator-container">
        <div className="calculator-display">
          <div className="calculator-display-value">{display}</div>
        </div>
        
        <div className="calculator-keypad">
          <div className="calculator-row">
            <button className="calculator-key calculator-key-clear" onClick={clearAll}>C</button>
            <button className="calculator-key" onClick={() => setDisplay(display.startsWith('-') ? display.substr(1) : '-' + display)}>±</button>
            <button className="calculator-key" onClick={() => handleOperator('%')}>%</button>
            <button className="calculator-key calculator-key-operation" onClick={() => handleOperator('÷')}>÷</button>
          </div>
          
          <div className="calculator-row">
            <button className="calculator-key" onClick={() => handleDigit('7')}>7</button>
            <button className="calculator-key" onClick={() => handleDigit('8')}>8</button>
            <button className="calculator-key" onClick={() => handleDigit('9')}>9</button>
            <button className="calculator-key calculator-key-operation" onClick={() => handleOperator('×')}>×</button>
          </div>
          
          <div className="calculator-row">
            <button className="calculator-key" onClick={() => handleDigit('4')}>4</button>
            <button className="calculator-key" onClick={() => handleDigit('5')}>5</button>
            <button className="calculator-key" onClick={() => handleDigit('6')}>6</button>
            <button className="calculator-key calculator-key-operation" onClick={() => handleOperator('-')}>−</button>
          </div>
          
          <div className="calculator-row">
            <button className="calculator-key" onClick={() => handleDigit('1')}>1</button>
            <button className="calculator-key" onClick={() => handleDigit('2')}>2</button>
            <button className="calculator-key" onClick={() => handleDigit('3')}>3</button>
            <button className="calculator-key calculator-key-operation" onClick={() => handleOperator('+')}>+</button>
          </div>
          
          <div className="calculator-row">
            <button className="calculator-key" onClick={() => handleDigit('0')}>0</button>
            <button className="calculator-key" onClick={handleDecimal}>.</button>
            <button className="calculator-key calculator-key-equals" onClick={handleEquals}>=</button>
          </div>
        </div>
      </div>
    </AppWindow>
  );
};

export default CalculatorApp; 