import { useEffect, useState } from 'react';
import { Card, Container} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Chessboard } from "react-chessboard";

const isWhiteBottom = (fen) => fen.includes(' w ');

const PuzzlesPage: React.FC = () => {
  const [puzzles, setPuzzles] = useState<any[]>([]);

  useEffect(() => {
    const fetchedPuzzles = localStorage.getItem('fetched_puzzles');
    if (fetchedPuzzles) {
      setPuzzles(JSON.parse(fetchedPuzzles));
    }
  }, []);
  
  const handlePlayButtonClick = (puzzleId: string) => {
    localStorage.setItem('current_puzzle_id', puzzleId);
  };

  return (
    <Container>
      <h1 className="mt-3 mb-4">Puzzles</h1>
      <div className="centered-cards">
        {puzzles.map((puzzle, index) => (
          <div key={index} className="duo-puzzle-card-wrapper">
            <Card className="duo-puzzle-card">
              <Card.Body>
                <Card.Title>
                <Link to={`/playpuzzle`} onClick={() => handlePlayButtonClick(puzzle.PuzzleId)}>
                  <button>Play</button>
                </Link>
                </Card.Title>
                <Chessboard position={puzzle.FEN} boardOrientation={isWhiteBottom(puzzle.FEN) ? 'white' : 'black'} arePiecesDraggable={false} />
              </Card.Body>
              <Card.Footer className="text-muted text-center">
                Rating: {puzzle.Rating} | Themes: {puzzle.Themes}
              </Card.Footer>
            </Card>
          </div>
        ))}
      </div>
    </Container>
  );
};

export default PuzzlesPage;
