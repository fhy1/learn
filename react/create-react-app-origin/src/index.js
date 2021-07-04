// import {useState, useReducer} from 'react';
// import ReactDOM from 'react-dom';
import './index.css';
// import App from './App';
// import reportWebVitals from './reportWebVitals';
import {useReducer} from './react/myreact'
import FhyDOM from './react/react-dom.js';
// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// );

function FunctionComponent(props) {
  // 管理许多 数据、链表
  // 
  // fiber.memoizedState => hook0(next) => hook1(next) 
  // workInProgressHook
  // const [count1, setCount1] = useState(0) //hook0
  const [count2, setCount2] = useReducer((x) => x + 1,0 ) //hook1
  
  return (
    <div className="border">
      <p>{props.name}</p>
      {/* <button onClick={() => setCount1(count1 + 1)}>
        {count1}
      </button> */}
      <button onClick={() => {
        setCount2()
      }}>
        {count2}
      </button>
    </div>
  )
}

const jsx = (
  <div className="big">
    <h1>
      你们都是大佬
    </h1>
    <div>离谱强</div>
    <FunctionComponent name="最爱菁菁" />
  </div>
);

FhyDOM.render(jsx, document.getElementById('root'))

// 原生标签 文本节点 函数组件 类组件 等等