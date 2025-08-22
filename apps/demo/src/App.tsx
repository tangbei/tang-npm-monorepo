import { useState } from 'react';
import './App.css';
import reactLogo from './assets/react.svg';
import TBRequest from './service';
import viteLogo from '/vite.svg';

function App() {
  const [count, setCount] = useState(0)

  const onRequest = async () => {
    TBRequest({
      url: '/456456/weather/v001/now',
      method: 'get',
      data: {
        areacode: '101010100',
      },
      interceptors: {
        requestInterceptors: (config) => {
          console.log('单个请求拦截config', config);
          return config;
        },
        responseInterceptors: (res) => {
          console.log('单个响应拦截res', res);
          return res;
        }
      }
    }).then(res => {
      console.log('res', res);
    }).catch(err => {
      console.log('err', err);
    });
  };

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>

        <button onClick={() => onRequest()}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
