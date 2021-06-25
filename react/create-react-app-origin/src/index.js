// import React from 'react';
// import ReactDOM from 'react-dom';
import './index.css';
// import App from './App';
// import reportWebVitals from './reportWebVitals';
import FhyDOM from './react/react-dom'

// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// );

const jsx = (
  <div className="big">
    <h1>
      你们都是大佬
    </h1>
    <div>离谱强</div>
  </div>
);

FhyDOM.render(jsx, document.getElementById('root'))

// 原生标签 文本节点 函数组件 类组件 等等