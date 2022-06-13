import {
  BrowserRouter, Route, Routes
} from "react-router-dom";
import QuestionsScreen from "./Screens/Questions";
import MainScreen from "./Screens/Main";
import ConfigScreen from "./Screens/Config";

const RouterFile = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<QuestionsScreen></QuestionsScreen>}></Route>
        <Route path="/index" element={<MainScreen></MainScreen>}></Route>
        <Route path="/config" element={<ConfigScreen></ConfigScreen>}></Route>
      </Routes>
    </BrowserRouter>
  );

  
}

export default RouterFile;