import logo from "./logo.svg";
import "./App.css";
import MiniDrawer from "./navegacao";
import { Provider } from "react-redux";
import { store } from "./ConfigSate";
function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <MiniDrawer></MiniDrawer>
      </div>
    </Provider>
  );
}

export default App;
