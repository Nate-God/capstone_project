import { useState, useEffect } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import axios from 'axios';

export default function PlayRandomMoveEngine() {
  const [game, setGame] = useState(null);
  const [gameStatus, setGameStatus] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [color, setColor] = useState('w' || 'b'); 
  const [width, setWidth] = useState(70);

  useEffect(() => {
    if (!game) return; 
    console.log(gameStatus, "I'm the status")
    const interval = setInterval(() => {
      if (!game.isGameOver() && game.turn() !== color) {
        makeMove();
      } 
      if (game.isGameOver() || game.isThreefoldRepetition() ) {
        clearInterval(interval);
        determineGameStatus();
      }
    }, 500);

    const handleResize = () => {setWidth(window.innerWidth * 0.5)};

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    }

    
  }, [game]);




  function onDrop(sourceSquare, targetSquare, piece) {
    console.log("from", sourceSquare, "to", targetSquare)
    const move = playMove({
      from: sourceSquare,
      to: targetSquare,
      promotion: piece[1].toLowerCase() ?? "q", 
    });
    console.log("I'm a move", move)
    

    if (move === null) return false;
    return true;
  }

  function playMove(move) {
    const gameCopy = new Chess(game.fen());
    const result = gameCopy.move(move);
    setGame(gameCopy);
    console.log(gameCopy.fen().trim(), "random")
    return result; 
  }
  function makeMove() {
    if (difficulty === 'stockfish') {
      stockfishMove();
    } else if (difficulty === 'random') {
      makeRandomMove();
    }
  }

  async function stockfishMove() {
    try {
      const response = await axios.get(`https://stockfish.online/api/stockfish.php?fen=${game.fen()}&depth=5&mode=bestmove`);
      const parts = response.data.data.split(' ');
      const fromSquare = parts[1].slice(0, 2);
      const toSquare = parts[1].slice(2, 4);
      const premoteTo = parts[1].slice(4);
      console.log(premoteTo, "I'm promotion info")
      playMove({ from: fromSquare, to: toSquare, promotion: premoteTo});
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  function makeRandomMove() {
    const possibleMoves = game.moves();
    const randomIndex = Math.floor(Math.random() * possibleMoves.length);
    playMove(possibleMoves[randomIndex]);
  }

  function determineGameStatus() {
    if (game.isCheckmate()) {
      setGameStatus(game.turn() === 'b' ? "You won!" : "You lost!");
    } else if (game.isDraw() || game.isStalemate() || game.isThreefoldRepetition()) {
      setGameStatus("It's a draw!");
    }
  }
  function handleDifficultyChange(e) {
    setDifficulty(e.target.value);
  }

  function handleColorChange(e) {
    if (e.target.value === 'random') {
      setColor(['w', 'b'][Math.floor(Math.random() * 2)]);
    } else{setColor(e.target.value);}

    
  }

  function handleStartGame(e) {

    const orientation = color === 'random' ? ['w', 'b'][Math.floor(Math.random() * 2)] : color;
    setColor
    const initialGame = new Chess();
  
    setGame(initialGame);
    setGameStatus('');
  }

  function restartGame() {
    setGame(null);
    setGameStatus("");
    setDifficulty('');
    setColor('');
  }

  return (
    <>
      {!game && (
        <div className="chess-pi-card">
          <div>
            <label>Difficulty:</label>
            <select value={difficulty} onChange={handleDifficultyChange} default={"stockfish"}>
              <option value="stockfish">Stockfish</option>
              <option value="random">Random</option>
            </select>
            <br />
            <label>Color:</label>
            <select value={color} onChange={handleColorChange}>
              <option value="w">White</option>
              <option value="b">Black</option>
              <option value="random">Random</option>
            </select>
            <br />
            <button onClick={handleStartGame}>Start Game</button>
          </div>
        </div>
      )}

      {game && (
        <>
          <div className="chess-pi">
            <Chessboard
              position={game.fen()}
              onPieceDrop={(sourceSquare, targetSquare, piece) => onDrop(sourceSquare, targetSquare, piece)}
              boardWidth={width}
              customBoardStyle={{ borderRadius: '7px', margin: '5px auto' }}
            />
          </div>
          {gameStatus && (
            <div className="card">
              <div className="chess-pi-card-inner">
                <div>{gameStatus}</div>
                <button onClick={restartGame}>Restart</button>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};