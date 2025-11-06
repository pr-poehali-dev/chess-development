import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';

type PieceType = 'k' | 'q' | 'r' | 'b' | 'n' | 'p' | 'K' | 'Q' | 'R' | 'B' | 'N' | 'P' | null;
type Board = PieceType[][];

interface Position {
  row: number;
  col: number;
}

const PIECE_SYMBOLS: Record<string, string> = {
  'k': '♚', 'q': '♛', 'r': '♜', 'b': '♝', 'n': '♞', 'p': '♟',
  'K': '♔', 'Q': '♕', 'R': '♖', 'B': '♗', 'N': '♘', 'P': '♙'
};

const initialBoard: Board = [
  ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
  ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
  ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
];

interface ChessBoardProps {
  difficulty: 'easy' | 'medium' | 'hard';
}

export default function ChessBoard({ difficulty }: ChessBoardProps) {
  const [board, setBoard] = useState<Board>(initialBoard);
  const [selectedSquare, setSelectedSquare] = useState<Position | null>(null);
  const [validMoves, setValidMoves] = useState<Position[]>([]);
  const [isWhiteTurn, setIsWhiteTurn] = useState(true);
  const [gameStatus, setGameStatus] = useState<'playing' | 'check' | 'checkmate' | 'draw'>('playing');
  const [capturedPieces, setCapturedPieces] = useState<{ white: string[], black: string[] }>({ white: [], black: [] });

  const isWhitePiece = (piece: PieceType): boolean => {
    return piece !== null && piece === piece.toUpperCase();
  };

  const getPawnMoves = (row: number, col: number, piece: PieceType): Position[] => {
    const moves: Position[] = [];
    const direction = isWhitePiece(piece) ? -1 : 1;
    const startRow = isWhitePiece(piece) ? 6 : 1;

    if (board[row + direction]?.[col] === null) {
      moves.push({ row: row + direction, col });
      if (row === startRow && board[row + 2 * direction]?.[col] === null) {
        moves.push({ row: row + 2 * direction, col });
      }
    }

    [-1, 1].forEach(offset => {
      const targetPiece = board[row + direction]?.[col + offset];
      if (targetPiece && isWhitePiece(targetPiece) !== isWhitePiece(piece)) {
        moves.push({ row: row + direction, col: col + offset });
      }
    });

    return moves;
  };

  const getKnightMoves = (row: number, col: number, piece: PieceType): Position[] => {
    const moves: Position[] = [];
    const offsets = [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]];

    offsets.forEach(([dRow, dCol]) => {
      const newRow = row + dRow;
      const newCol = col + dCol;
      if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
        const targetPiece = board[newRow][newCol];
        if (!targetPiece || isWhitePiece(targetPiece) !== isWhitePiece(piece)) {
          moves.push({ row: newRow, col: newCol });
        }
      }
    });

    return moves;
  };

  const getSlidingMoves = (row: number, col: number, piece: PieceType, directions: number[][]): Position[] => {
    const moves: Position[] = [];

    directions.forEach(([dRow, dCol]) => {
      let newRow = row + dRow;
      let newCol = col + dCol;

      while (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
        const targetPiece = board[newRow][newCol];
        if (!targetPiece) {
          moves.push({ row: newRow, col: newCol });
        } else {
          if (isWhitePiece(targetPiece) !== isWhitePiece(piece)) {
            moves.push({ row: newRow, col: newCol });
          }
          break;
        }
        newRow += dRow;
        newCol += dCol;
      }
    });

    return moves;
  };

  const getKingMoves = (row: number, col: number, piece: PieceType): Position[] => {
    const moves: Position[] = [];
    const offsets = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];

    offsets.forEach(([dRow, dCol]) => {
      const newRow = row + dRow;
      const newCol = col + dCol;
      if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
        const targetPiece = board[newRow][newCol];
        if (!targetPiece || isWhitePiece(targetPiece) !== isWhitePiece(piece)) {
          moves.push({ row: newRow, col: newCol });
        }
      }
    });

    return moves;
  };

  const getValidMoves = (row: number, col: number): Position[] => {
    const piece = board[row][col];
    if (!piece) return [];

    const pieceType = piece.toLowerCase();

    switch (pieceType) {
      case 'p':
        return getPawnMoves(row, col, piece);
      case 'n':
        return getKnightMoves(row, col, piece);
      case 'b':
        return getSlidingMoves(row, col, piece, [[-1, -1], [-1, 1], [1, -1], [1, 1]]);
      case 'r':
        return getSlidingMoves(row, col, piece, [[-1, 0], [1, 0], [0, -1], [0, 1]]);
      case 'q':
        return getSlidingMoves(row, col, piece, [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]]);
      case 'k':
        return getKingMoves(row, col, piece);
      default:
        return [];
    }
  };

  const makeAIMove = () => {
    const allBlackPieces: Position[] = [];
    board.forEach((row, rowIdx) => {
      row.forEach((piece, colIdx) => {
        if (piece && !isWhitePiece(piece)) {
          allBlackPieces.push({ row: rowIdx, col: colIdx });
        }
      });
    });

    let bestMove: { from: Position; to: Position } | null = null;
    let attempts = 0;
    const maxAttempts = difficulty === 'easy' ? 5 : difficulty === 'medium' ? 10 : 20;

    while (!bestMove && attempts < maxAttempts) {
      const randomPiece = allBlackPieces[Math.floor(Math.random() * allBlackPieces.length)];
      const moves = getValidMoves(randomPiece.row, randomPiece.col);

      if (moves.length > 0) {
        const captureMoves = moves.filter(move => board[move.row][move.col] !== null);
        
        if (difficulty === 'hard' && captureMoves.length > 0) {
          bestMove = { from: randomPiece, to: captureMoves[Math.floor(Math.random() * captureMoves.length)] };
        } else if (difficulty === 'medium' && captureMoves.length > 0 && Math.random() > 0.5) {
          bestMove = { from: randomPiece, to: captureMoves[Math.floor(Math.random() * captureMoves.length)] };
        } else {
          bestMove = { from: randomPiece, to: moves[Math.floor(Math.random() * moves.length)] };
        }
      }
      attempts++;
    }

    if (bestMove) {
      const newBoard = board.map(row => [...row]);
      const capturedPiece = newBoard[bestMove.to.row][bestMove.to.col];
      
      if (capturedPiece) {
        setCapturedPieces(prev => ({
          ...prev,
          black: [...prev.black, PIECE_SYMBOLS[capturedPiece]]
        }));
      }

      newBoard[bestMove.to.row][bestMove.to.col] = newBoard[bestMove.from.row][bestMove.from.col];
      newBoard[bestMove.from.row][bestMove.from.col] = null;
      setBoard(newBoard);
      setIsWhiteTurn(true);
    }
  };

  useEffect(() => {
    if (!isWhiteTurn && gameStatus === 'playing') {
      const timer = setTimeout(() => {
        makeAIMove();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isWhiteTurn, gameStatus]);

  const handleSquareClick = (row: number, col: number) => {
    if (!isWhiteTurn || gameStatus !== 'playing') return;

    const piece = board[row][col];

    if (selectedSquare) {
      const isValidMove = validMoves.some(move => move.row === row && move.col === col);

      if (isValidMove) {
        const newBoard = board.map(row => [...row]);
        const capturedPiece = newBoard[row][col];
        
        if (capturedPiece) {
          setCapturedPieces(prev => ({
            ...prev,
            white: [...prev.white, PIECE_SYMBOLS[capturedPiece]]
          }));
        }

        newBoard[row][col] = newBoard[selectedSquare.row][selectedSquare.col];
        newBoard[selectedSquare.row][selectedSquare.col] = null;
        setBoard(newBoard);
        setSelectedSquare(null);
        setValidMoves([]);
        setIsWhiteTurn(false);
      } else if (piece && isWhitePiece(piece)) {
        const moves = getValidMoves(row, col);
        setSelectedSquare({ row, col });
        setValidMoves(moves);
      } else {
        setSelectedSquare(null);
        setValidMoves([]);
      }
    } else if (piece && isWhitePiece(piece)) {
      const moves = getValidMoves(row, col);
      setSelectedSquare({ row, col });
      setValidMoves(moves);
    }
  };

  const resetGame = () => {
    setBoard(initialBoard);
    setSelectedSquare(null);
    setValidMoves([]);
    setIsWhiteTurn(true);
    setGameStatus('playing');
    setCapturedPieces({ white: [], black: [] });
  };

  const isSquareSelected = (row: number, col: number): boolean => {
    return selectedSquare?.row === row && selectedSquare?.col === col;
  };

  const isValidMoveSquare = (row: number, col: number): boolean => {
    return validMoves.some(move => move.row === row && move.col === col);
  };

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <div className="flex gap-4 items-center flex-wrap justify-center">
        <div className="text-sm pixel-text">
          {isWhiteTurn ? '⚪ YOUR TURN' : '⚫ AI THINKING...'}
        </div>
        <div className="text-xs pixel-text text-muted-foreground">
          LEVEL: {difficulty.toUpperCase()}
        </div>
      </div>

      <div className="flex gap-8 flex-wrap justify-center items-start">
        <Card className="p-2 bg-secondary">
          <div className="text-xs pixel-text mb-2 text-center">CAPTURED</div>
          <div className="flex flex-col gap-2">
            <div className="flex gap-1 flex-wrap max-w-[120px]">
              {capturedPieces.white.map((piece, idx) => (
                <span key={idx} className="text-lg">{piece}</span>
              ))}
            </div>
            <div className="flex gap-1 flex-wrap max-w-[120px]">
              {capturedPieces.black.map((piece, idx) => (
                <span key={idx} className="text-lg">{piece}</span>
              ))}
            </div>
          </div>
        </Card>

        <Card className="p-2 bg-muted inline-block">
          <div className="grid grid-cols-8 gap-0">
            {board.map((row, rowIdx) =>
              row.map((piece, colIdx) => {
                const isLight = (rowIdx + colIdx) % 2 === 0;
                const isSelected = isSquareSelected(rowIdx, colIdx);
                const isValidMove = isValidMoveSquare(rowIdx, colIdx);

                return (
                  <button
                    key={`${rowIdx}-${colIdx}`}
                    onClick={() => handleSquareClick(rowIdx, colIdx)}
                    className={`
                      chess-square w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center text-2xl sm:text-4xl
                      ${isLight ? 'bg-[#0f3460]' : 'bg-[#16213e]'}
                      ${isSelected ? 'ring-4 ring-primary' : ''}
                      ${isValidMove ? 'ring-2 ring-accent animate-pulse' : ''}
                      ${!isWhiteTurn ? 'cursor-not-allowed opacity-70' : 'hover:brightness-125'}
                    `}
                    disabled={!isWhiteTurn}
                  >
                    {piece && PIECE_SYMBOLS[piece]}
                  </button>
                );
              })
            )}
          </div>
        </Card>
      </div>

      <button
        onClick={resetGame}
        className="px-6 py-3 bg-primary text-primary-foreground pixel-text text-xs hover:bg-primary/80 transition-colors"
      >
        NEW GAME
      </button>
    </div>
  );
}
