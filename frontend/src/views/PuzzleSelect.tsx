import { useState } from 'react';
import { Card, Form, Button } from 'react-bootstrap';
import DatabaseService from '../services/DatabaseService.ts';

const PuzzleSelect: React.FC = () => {
  const [minRating, setMinRating] = useState<number>(1000);
  const [ratingRange, setRatingRange] = useState<number>(25);
  const [numPuzzles, setNumPuzzles] = useState<number>(10);

  const handleMinRatingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMinRating(parseInt(event.target.value));
  };

  const handleRatingRangeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRatingRange(parseInt(event.target.value));
  };

  const handleNumPuzzlesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNumPuzzles(parseInt(event.target.value));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const min_rating = minRating-ratingRange
    const max_rating = minRating+ratingRange
    try {
      const puzzles = await DatabaseService.getPuzzles(min_rating, max_rating, numPuzzles);
      localStorage.removeItem('fetched_puzzles')
      localStorage.setItem('fetched_puzzles', JSON.stringify(puzzles));
      window.location.href = '/displayPuzzles';
    } catch (error) {
      console.error('Error fetching puzzles:', error);
    }
  };


  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Card style={{ width: '400px' }}>
        <Card.Body>
          <Card.Title>Puzzle Selector</Card.Title>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="rating">
              <Form.Label>Rating</Form.Label>
              <Form.Control type="number" value={minRating} onChange={handleMinRatingChange} />
            </Form.Group>
            <Form.Group controlId="ratingRange">
              <Form.Label>Range</Form.Label>
              <Form.Control type="number" value={ratingRange} onChange={handleRatingRangeChange} />
            </Form.Group>
            <Form.Group controlId="numPuzzles">
              <Form.Label>Number of Puzzles</Form.Label>
              <Form.Control type="number" value={numPuzzles} onChange={handleNumPuzzlesChange} />
            </Form.Group>
            <Button variant="primary" type="submit">Get Puzzles</Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default PuzzleSelect;