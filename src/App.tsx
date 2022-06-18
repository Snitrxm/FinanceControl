import './styles/global.css';
import RouterFile from './routes';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <div className="App">
      <ToastContainer></ToastContainer>
      <RouterFile></RouterFile>
    </div>
  );
}

export default App;
