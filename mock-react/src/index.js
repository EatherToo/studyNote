import React, { Component } from 'react';
import ReactDOM from './mockFiles/react-dom';
import './index.css';
// import App from './App';
import reportWebVitals from './reportWebVitals';
const FuncCom = () => {
  return <div>
    <h1 style={{
      color: 'blue'
    }}>函数组件</h1>
  </div>
}

class ClassCom extends Component{
  render() {
    return <h1 style={{
      color: 'red'
    }}>类组件</h1>
  }
}

ReactDOM.render(
  <div>
    <ClassCom/>
    <h1>hello world!</h1>
    <h1>hello world2</h1>
    <FuncCom/>
  </div>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
