import React, { useState, useEffect } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';

const isWhiteBottom = (fen) => fen.includes(' w ');

const PlayPuzzle: React.FC = () => {
    const [puzzle, setPuzzle] = useState<any | null>(null);
    const [game, setGame] = useState<Chess | null>(null);
    const [gameStatus, setGameStatus] = useState<string>('');

    useEffect(() => {
        const puzzleId = localStorage.getItem('current_puzzle_id');
        const fetchedPuzzles = localStorage.getItem('fetched_puzzles');
        const parsedPuzzles = fetchedPuzzles ? JSON.parse(fetchedPuzzles) : [];
        const foundPuzzle = parsedPuzzles.find((p: any) => p.PuzzleId === puzzleId);

        if (foundPuzzle) {
            setPuzzle(foundPuzzle);
            setGame(new Chess(foundPuzzle.FEN));
        }
    }, []);

    useEffect(() => {
        if (!game) return;

        const interval = setInterval(() => {
            if (game.turn() !== puzzle?.FEN.split(' ')[1]) {
                makeMove();
            }
            if (game?.game_over() || game?.threefold_repetition()) {
                clearInterval(interval);
                determineGameStatus();
            }
        }, 500);

        return () => clearInterval(interval);
    }, [game]);

    const onDrop = (sourceSquare: string, targetSquare: string, piece: string) => {
        if (!puzzle) return false;

        const move = playMove({
            from: sourceSquare,
            to: targetSquare,
            promotion: piece.toLowerCase() === 'p' && (targetSquare[1] === '1' || targetSquare[1] === '8') ? 'q' : undefined
        });

        return !!move;
    };

    const playMove = (move: any) => {
        if (!game || !puzzle) return null;

        const gameCopy = new Chess(game.fen());
        const result = gameCopy.move(move);

        if (!result) return null;

        const moves = puzzle.Moves.split(' ');
        if (!moves.includes(move.from + move.to)) return null;

        setGame(gameCopy);
        return result;
    };

    const makeMove = () => {
        // Implement logic to make computer move
    };

    const determineGameStatus = () => {
        if (!game) return;

        if (game.in_checkmate()) {
            setGameStatus(game.turn() === 'b' ? 'You won!' : 'You lost!');
        } else if (game.in_draw() || game.in_stalemate() || game.in_threefold_repetition()) {
            setGameStatus("It's a draw!");
        }
    };

    const restartGame = () => {
        if (puzzle) {
            setGame(new Chess(puzzle.FEN));
            setGameStatus('');
        }
    };

    return (
        <>
            {game && (
                <Chessboard
                    position={game.fen()}
                    onPieceDrop={(sourceSquare, targetSquare, piece) => onDrop(sourceSquare, targetSquare, piece)}
                    customBoardStyle={{ borderRadius: '7px', margin: '5px auto' }}
                    boardOrientation={isWhiteBottom(puzzle.FEN) ? 'white' : 'black'}
                    boardWidth={800}
                />
            )}
        </>
    );
};

export default PlayPuzzle;
