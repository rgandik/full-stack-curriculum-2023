import logo from './logo.svg';
import './App.css';
import Greeting from './Greeting';

let name = "Rishi";

const names = ["me", "you", "us"]

function App() {
  return (
    <div className="App">
      <header className="App-header">
        
        <p>Hello World!</p>

        <p>Hello {name}!</p>

        <Greeting></Greeting>

        {names.map((name, index) => <Greeting name={name} key={index}></Greeting>)}

      </header>
    </div>
  );
}

export default App;
