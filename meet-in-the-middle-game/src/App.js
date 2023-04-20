import './App.css';

let players = ["me", "you"];
let loggedInPlayer = "me";
let partnerPlayer = "you";
let score = 0;
let words = ["beautiful", "train", "Shakespeare", "table", "river", "ant", "heart", "Antarctica", "ski", "firefighter", "rodeo", "wedding", "banana", "melt", "muscle", "chip"]

function getFiveWords() {
  let fiveButtons = [];
  for (let i = 0; i < 5; i++) {
    fiveButtons.push(<button>{words[i]}</button>);
  }
  return fiveButtons;
}

function App() {
  return (
    <div className="App">
      <div>
        <div className="playerContainer">
          <h1>Teams [Score]</h1>
          <ul>
            <li>{loggedInPlayer} - {partnerPlayer} [{score}]</li>
          </ul>
        </div>
      </div>
      <div className="partnerName">{partnerPlayer}</div>
      <div className="crystalBall"></div>
      <div className="yourName">{loggedInPlayer}</div>
      <div className="inputContainer">
        <button>Guess</button>
        <input></input>
      </div>
      <div className="cardSelectionContainer">
        {getFiveWords()}
      </div>
    </div>
  );
}

export default App;
