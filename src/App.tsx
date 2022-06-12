import { initializeApp } from 'firebase/app';
import './styles/global.css';
import RouterFile from './routes';

const firebaseApp = initializeApp({
  apiKey: "AIzaSyBLxcmYxFlVZHo6lruot6xo3GibetkUYRc",
  authDomain: "finances-6b2b0.firebaseapp.com",
  projectId: "finances-6b2b0",
});

function App() {
  return (
    <div className="App">
      <RouterFile></RouterFile>
    </div>
  );
}

export default App;
