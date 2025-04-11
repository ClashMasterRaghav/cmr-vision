import React, { useState } from 'react';
import AppWindow from '../components/AppWindow';

interface CalculatorAppProps {
  id: string;
  title: string;
  onClose: () => void;
  data: {
    value?: string;
  };
}

const CalculatorApp: React.FC<CalculatorAppProps> = ({ id, title, onClose, data }) => {
  const [display, setDisplay] = useState(data.value || '0');
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [pendingOperator, setPendingOperator] = useState<string | null>(null);
  const [storedValue, setStoredValue] = useState<number>(0);
  
  const clearAll = () => {
    setDisplay('0');
    setWaitingForOperand(false);
    setPendingOperator(null);
    setStoredValue(0);
  };
  
  const clearDisplay = () => {
    setDisplay('0');
    setWaitingForOperand(false);
  };
  
  const clearLastChar = () => {
    setDisplay(display.length > 1 ? display.substring(0, display.length - 1) : '0');
  };
  
  const toggleSign = () => {
    const value = parseFloat(display);
    setDisplay(value ? (-value).toString() : '0');
  };
  
  const inputPercent = () => {
    const value = parseFloat(display);
    setDisplay((value / 100).toString());
  };
  
  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };
  
  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };
  
  const performOperation = (operator: string) => {
    const value = parseFloat(display);
    
    if (pendingOperator !== null) {
      const currentValue = storedValue || 0;
      let newValue;
      
      switch (pendingOperator) {
        case '+':
          newValue = currentValue + value;
          break;
        case '-':
          newValue = currentValue - value;
          break;
        case '×':
          newValue = currentValue * value;
          break;
        case '÷':
          newValue = currentValue / value;
          break;
        default:
          newValue = value;
      }
      
      setDisplay(newValue.toString());
      setStoredValue(newValue);
    } else {
      setStoredValue(value);
    }
    
    setPendingOperator(operator);
    setWaitingForOperand(true);
  };
  
  const calculateResult = () => {
    const value = parseFloat(display);
    
    if (pendingOperator !== null && !waitingForOperand) {
      const currentValue = storedValue || 0;
      let newValue;
      
      switch (pendingOperator) {
        case '+':
          newValue = currentValue + value;
          break;
        case '-':
          newValue = currentValue - value;
          break;
        case '×':
          newValue = currentValue * value;
          break;
        case '÷':
          newValue = currentValue / value;
          break;
        default:
          newValue = value;
      }
      
      setDisplay(newValue.toString());
      setStoredValue(newValue);
      setPendingOperator(null);
      setWaitingForOperand(true);
    }
  };
  
  return (
    <AppWindow title={title} onClose={onClose}>
      <div className="calculator-container">
        <div className="calculator-display">
          <div className="calculator-display-value">{display}</div>
        </div>
        
        <div className="calculator-keypad">
          <div className="calculator-row">
            <button className="calculator-key calculator-key-clear" onClick={clearAll}>C</button>
            <button className="calculator-key" onClick={clearLastChar}>←</button>
            <button className="calculator-key" onClick={inputPercent}>%</button>
            <button className="calculator-key calculator-key-operation" onClick={() => performOperation('÷')}>÷</button>
          </div>
          
          <div className="calculator-row">
            <button className="calculator-key" onClick={() => inputDigit('7')}>7</button>
            <button className="calculator-key" onClick={() => inputDigit('8')}>8</button>
            <button className="calculator-key" onClick={() => inputDigit('9')}>9</button>
            <button className="calculator-key calculator-key-operation" onClick={() => performOperation('×')}>×</button>
          </div>
          
          <div className="calculator-row">
            <button className="calculator-key" onClick={() => inputDigit('4')}>4</button>
            <button className="calculator-key" onClick={() => inputDigit('5')}>5</button>
            <button className="calculator-key" onClick={() => inputDigit('6')}>6</button>
            <button className="calculator-key calculator-key-operation" onClick={() => performOperation('-')}>-</button>
          </div>
          
          <div className="calculator-row">
            <button className="calculator-key" onClick={() => inputDigit('1')}>1</button>
            <button className="calculator-key" onClick={() => inputDigit('2')}>2</button>
            <button className="calculator-key" onClick={() => inputDigit('3')}>3</button>
            <button className="calculator-key calculator-key-operation" onClick={() => performOperation('+')}>+</button>
          </div>
          
          <div className="calculator-row">
            <button className="calculator-key" onClick={toggleSign}>±</button>
            <button className="calculator-key" onClick={() => inputDigit('0')}>0</button>
            <button className="calculator-key" onClick={inputDecimal}>.</button>
            <button className="calculator-key calculator-key-equals" onClick={calculateResult}>=</button>
          </div>
        </div>
      </div>
    </AppWindow>
  );
};

export default CalculatorApp; 