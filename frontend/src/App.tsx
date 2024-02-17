import {useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navigation from './components/Navbar';
import Home from './views/Home';
import Register from './views/Register';
import Login from './views/Login';
import Play from './views/Play';
import PuzzleSelect from './views/PuzzleSelect';
import DisplayPuzzles from './views/DisplayPuzzles';
import PlayPuzzle from './views/PlayPuzzle';
import Account from './views/Account';

const App: React.FC = () => {
  return (
      <Router>
        <Navigation/>
        <div>
          <Routes>
            <Route path="/"  Component={Home} />
            <Route path="/register" Component={Register} />
            <Route path="/login" Component={Login} />
            <Route path="/play"  Component={Play} />
            <Route path="/puzzleSelect"  Component={PuzzleSelect} />
            <Route path="/displayPuzzles"  Component={DisplayPuzzles} />
            <Route path="/playPuzzle"  Component={PlayPuzzle} />
            <Route path="/account"  Component={Account} />
          </Routes>
        </div>
      </Router>
  );
};

export default App;