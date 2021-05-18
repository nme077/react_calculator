import './App.css';
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { buttons } from './buttons';
import { evaluate } from 'mathjs';


// HANDLE ALL CALCULATIONS AND RENDER CALCULATOR
class Calculator extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      line1Arr: [],
      line2Arr: [0],
      total: 0
    }
    this.handleClick = this.handleClick.bind(this);
    this.init = this.init.bind(this);
    this.evaluate = this.evaluate.bind(this);
    this.handleInt = this.handleInt.bind(this);
    this.handleOperator = this.handleOperator.bind(this);
  }

  // handleClick
  handleClick(e) {
    const input = e.target.value;
    const inputIsInt = !isNaN(parseInt(input));
    const line2Arr = this.state.line2Arr;
    // Init if calculated
    if(this.state.calculated) {
      this.setState({
        input: '',
        line1Arr: [line2Arr],
        calculated: false
      })
    }
    
    // Initialize state
    if(/C/.test(input)) return this.init();
    if(/=/.test(input)) return this.evaluate();
    if(inputIsInt || input === '.') return this.handleInt(input);
    return this.handleOperator(input);
  }

  init() {
    this.setState({
      input: '',
      line1Arr: [], 
      line2Arr: [0],
      total: 0,
      calculated: false
    })
  }

  // Handle equals
  evaluate() {
    const expression = this.state.line1Arr.join('');
    if(!this.state.calculated) {
      this.setState(prevState => {
        let line1Arr = prevState.line1Arr;
        let prevInputIsNum = !isNaN(prevState.input);
        
        if(prevInputIsNum) {
          const calculatedTotal = evaluate(expression)
          //const calculatedTotal = parse(expression);
          //const calculatedTotal = eval(expression);

          return { line1Arr: [...line1Arr, '=', calculatedTotal] , calculated: true, total: calculatedTotal, line2Arr: [calculatedTotal]};
        } else {
          return
        }
      });
    }
  }

  // Handle integers and decimals
  handleInt(input) {
    this.setState(prevState => {
      const inputIsDec = input === '.';
      const inputIsInt = !isNaN(parseInt(input));
      const prevIsInt = !isNaN(parseInt(prevState.input));
      const prevNotDec = prevState.line2Arr.indexOf('.') === -1;
      const leadingZero = prevState.line2Arr[0] === '0';
      
      let line1Arr = prevState.line1Arr;
      let line2Arr = prevState.line2Arr;

      // Remove leading zero
        if(leadingZero) {
          line1Arr.shift();
          line2Arr.shift();
        }
        // Handle decimal
        if(!prevIsInt && prevNotDec) {
          prevState.line2Arr.pop();
          updateBothLines();
        } else if((inputIsDec && prevNotDec) || inputIsInt) {
          updateBothLines();
        }

        function updateBothLines() {
          line2Arr = [...prevState.line2Arr, input];
          line1Arr = [...prevState.line1Arr, input];
        }
    
      return {line1Arr, line2Arr, input};
    })
  }
  
  // Handle operators
  handleOperator(input) {
    this.setState(prevState => {
      let prevLine1Arr = prevState.line1Arr;
      let prevLine2Arr = prevState.line2Arr;
      const prevInput = prevState.line1Arr[prevState.line1Arr.length-1];
      const prevInputIsNum = prevInput && (!isNaN(prevInput) || prevInput === '.');
      const negativeNum = input === '-' && prevInput !== '-' && !prevInputIsNum;
      
      // Handle negative number
      if(negativeNum) {
        prevLine1Arr = [...prevLine1Arr, input];
        prevLine2Arr = [input];
      } 
      // Handle operator when two operators in a row
      else if(input !== '-' && !prevInputIsNum && prevLine1Arr[prevLine1Arr.length - 2] && isNaN(prevLine1Arr[prevLine1Arr.length - 2]) && prevLine1Arr[prevLine1Arr.length - 2] !== '.') {
        prevLine1Arr.splice(prevLine1Arr.length - 2, 2);
        prevLine1Arr = [...prevLine1Arr, input];
        prevLine2Arr = [input];
      }
      // Handle when previous character is operator
      else if((isNaN(prevInput) && prevInput !== '.' && input !== prevInput)) {
        prevLine1Arr.splice(prevLine1Arr.length - 1, 2, input);
        prevLine2Arr = [input];
      }
      // Handle operator when previous character is NOT operator 
      else if(prevInput && !isNaN(prevInput) && input !== prevInput) {
        prevLine1Arr = [...prevLine1Arr, input];
        prevLine2Arr = [input];
      }
    
      return {line1Arr: prevLine1Arr, line2Arr: prevLine2Arr, input};
    })
  }

    
render() {
  let numButtons = this.props.buttons
      .map((obj,i) => {
      return(
        <Button 
          key={buttons[i].id}
          id={buttons[i].id}
          label={buttons[i].label}
          action={buttons[i].action}
          class={typeof buttons[i].action}
          handleClick={this.handleClick}
        />
    )});

    return (
      <div id="app" className="container">
        <div className="row fixed-top">
          <h1 className="text-center pt-5" id="title">Calculator</h1>
        </div>
        <div className="row">
          <div id="calculator" className="shadow-lg rounded">
            <div id="display-operations" className="display">{this.state.line1Arr.join('')}</div>
            <div id="display" className="display">
              {this.state.line2Arr.join('')}
            </div>
            <div>
              {numButtons}
            </div>
          </div>
        </div>
        <div className="row fixed-bottom py-4">
          <footer className="col-12 px-0 text-center text-dark">
            <div>
                <a href="mailto:cardapp77@gmail.com" className="social-link" target="_blank" rel="noreferrer">
                    <FontAwesomeIcon icon={faPaperPlane} />
                </a>
                <a href="http://www.linkedin.com/in/nicholas-eveland-7988279a" className="social-link" target="_blank" rel="noreferrer">
                    <FontAwesomeIcon icon={faLinkedinIn} />
                </a>
                <a href="https://github.com/nme077" className="social-link" target="_blank" rel="noreferrer">
                    <FontAwesomeIcon icon={faGithub} />
                </a>
            </div>
            <small id="copyright" className="text-white">&copy; Copyright 2021, Nicholas Eveland</small>
          </footer> 
        </div>
      </div>
    )
  }
}

// BUTTON CLASS
class Button extends React.Component {
  constructor(props) {
    super(props)
    this.classNamePicker = this.classNamePicker.bind(this);
  }
  
  classNamePicker() {
    let className;
    if(this.props.class === 'number') {
      className = `${this.props.class}`;
    } else if(this.props.class === 'string') {
      className = 'operator';
    }
    return className;
  }
  
  render() {
    return(
      <button id={this.props.id} className={this.classNamePicker() + ' button'} onClick={this.props.handleClick} value={this.props.action}>{this.props.label}</button>
    )
  }
}

// APP CLASS
class App extends React.Component {  
  render() {
    return(
      <Calculator 
        buttons={buttons}
      />
    )
  }
}


export default App;