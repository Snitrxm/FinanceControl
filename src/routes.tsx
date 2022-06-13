import {
  BrowserRouter, Route, Routes
} from "react-router-dom";
import QuestionsScreen from "./Screens/Questions";
import MainScreen from "./Screens/Main";
import HistoryScreen from "./Screens/History";

const RouterFile = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<QuestionsScreen></QuestionsScreen>}></Route>
        <Route path="/index" element={<MainScreen></MainScreen>}></Route>
        <Route path="/history" element={<HistoryScreen></HistoryScreen>}></Route>
      </Routes>
    </BrowserRouter>
  );

  
}

export default RouterFile;