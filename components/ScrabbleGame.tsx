import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Tile, Player, ScrabbleLetter } from '../types';
import { useDictionary } from '../hooks/useDictionary';
import { getScrabbleLetters } from '../services/gameService';
import { ChevronLeft, RefreshCw, Star } from './icons';

const BOARD_SIZE = 15;

const ScrabbleGame: React.FC<{ setView: (view: View) => void }> = ({ setView }) => {
  const dictionary = useDictionary();
  const dictionarySet = useMemo(() => new Set(dictionary.map(entry => entry.numee.toLowerCase())), [dictionary]);

  const [board, setBoard] = useState<(Tile | null)[][]>(() => Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null)));
  const [players, setPlayers] = useState<Player[]>([{ rack: [], score: 0 }, { rack: [], score: 0 }]);
  const [letterBag, setLetterBag] = useState<ScrabbleLetter[]>([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [selectedTile, setSelectedTile] = useState<{ tile: Tile, index: number } | null>(null);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'finished'>('idle');

  const createInitialBag = useCallback(() => {
    return getScrabbleLetters().sort(() => Math.random() - 0.5);
  }, []);

  const drawTiles = (currentBag: ScrabbleLetter[], count: number) => {
    const drawn: Tile[] = [];
    const remainingBag = [...currentBag];
    for (let i = 0; i < count && remainingBag.length > 0; i++) {
      const tileData = remainingBag.pop();
      if (tileData) {
        drawn.push({ ...tileData, id: `${tileData.letter}-${Date.now()}-${i}` });
      }
    }
    return { drawn, remainingBag };
  };
  
  const startGame = useCallback(() => {
    const initialBag = createInitialBag();
    let bag = [...initialBag];
    
    const newPlayers: Player[] = [{ rack: [], score: 0 }, { rack: [], score: 0 }];
    
    for (let i = 0; i < 2; i++) {
      const { drawn, remainingBag } = drawTiles(bag, 7);
      newPlayers[i].rack = drawn;
      bag = remainingBag;
    }

    setBoard(Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null)));
    setPlayers(newPlayers);
    setLetterBag(bag);
    setCurrentPlayerIndex(0);
    setGameState('playing');
  }, [createInitialBag]);


  const handleTileSelect = (tile: Tile, index: number) => {
    if (selectedTile && selectedTile.index === index) {
      setSelectedTile(null);
    } else {
      setSelectedTile({ tile, index });
    }
  };

  const handleBoardClick = (row: number, col: number) => {
    if (!selectedTile || board[row][col]) return;

    const newBoard = board.map(r => [...r]);
    newBoard[row][col] = selectedTile.tile;
    setBoard(newBoard);

    const newPlayers = [...players];
    newPlayers[currentPlayerIndex].rack[selectedTile.index] = null;
    setPlayers(newPlayers);
    
    setSelectedTile(null);
  };
  
  const validateAndScoreTurn = () => {
    // This is a simplified validation and scoring logic.
    // A full implementation would be much more complex.
    let word = '';
    let score = 0;
    
    // Simple horizontal word check from top-left
    for(let r=0; r<BOARD_SIZE; r++) {
        for(let c=0; c<BOARD_SIZE; c++) {
            if(board[r][c]) {
                word += board[r][c]!.letter;
                score += board[r][c]!.points;
            }
        }
        if(word.length > 1) {
             if (dictionarySet.has(word.toLowerCase())) {
                 alert(`Mot trouvé: ${word} pour ${score} points!`);
                 const newPlayers = [...players];
                 newPlayers[currentPlayerIndex].score += score;
                 
                 // Refill rack
                 const rack = newPlayers[currentPlayerIndex].rack.filter(t => t !== null) as Tile[];
                 const tilesToDraw = 7 - rack.length;
                 const { drawn, remainingBag } = drawTiles(letterBag, tilesToDraw);
                 newPlayers[currentPlayerIndex].rack = [...rack, ...drawn];

                 setPlayers(newPlayers);
                 setLetterBag(remainingBag);
                 setCurrentPlayerIndex((currentPlayerIndex + 1) % 2);
                 return;
             }
        }
        word = '';
        score = 0;
    }
    alert("Mot non valide ou logique de jeu simplifiée. Réessayez.");
  };

  if (gameState === 'idle') {
    return (
        <div className="text-center p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-xl">
            <button onClick={() => setView('games')} className="absolute top-4 left-4 flex items-center gap-2 text-sm text-cyan-600 dark:text-cyan-400 font-semibold hover:underline">
                <ChevronLeft className="w-4 h-4"/> Retour aux jeux
            </button>
            <h2 className="text-4xl font-bold text-slate-800 dark:text-white">Mots Numèè</h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">Formez des mots, marquez des points. Jouable à deux en local !</p>
            <button
                onClick={startGame}
                className="mt-8 px-8 py-3 bg-cyan-500 text-white font-bold rounded-full text-lg hover:bg-cyan-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
                Commencer une partie
            </button>
        </div>
    );
  }

  const currentPlayer = players[currentPlayerIndex];

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
        <div className="flex-grow w-full">
            <h2 className="text-2xl font-bold mb-4 text-center">Tour du Joueur {currentPlayerIndex + 1}</h2>
            <div className="grid grid-cols-15 gap-1 bg-cyan-100 dark:bg-slate-700 p-2 rounded-lg aspect-square">
            {board.map((row, r_idx) => row.map((tile, c_idx) => (
                <div key={`${r_idx}-${c_idx}`} onClick={() => handleBoardClick(r_idx, c_idx)} className={`w-full aspect-square flex items-center justify-center rounded-sm text-white font-bold text-sm md:text-lg ${tile ? 'bg-amber-600' : 'bg-cyan-500/50 hover:bg-cyan-500/80 cursor-pointer'}`}>
                    {tile ? (
                        <div className="relative">
                            {tile.letter}
                            <span className="absolute -bottom-2 -right-1 text-xs">{tile.points}</span>
                        </div>
                    ) : ''}
                </div>
            )))}
            </div>
            <style>{`.grid-cols-15 { grid-template-columns: repeat(15, minmax(0, 1fr)); }`}</style>
        </div>

        <div className="w-full lg:w-80 flex-shrink-0 space-y-6">
            <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-lg">
                <h3 className="font-bold text-lg mb-2 text-center">Scores</h3>
                <div className="flex justify-around text-center">
                    <div><p className="font-semibold">Joueur 1</p><p className="text-2xl font-bold text-cyan-500">{players[0].score}</p></div>
                    <div><p className="font-semibold">Joueur 2</p><p className="text-2xl font-bold text-cyan-500">{players[1].score}</p></div>
                </div>
                 <p className="text-center mt-2 text-sm text-slate-500">{letterBag.length} lettres restantes</p>
            </div>
            
            <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-lg">
                <h3 className="font-bold text-lg mb-2 text-center">Vos lettres (Joueur {currentPlayerIndex + 1})</h3>
                <div className="flex justify-center gap-1">
                    {currentPlayer.rack.map((tile, index) => (
                        <button key={index} onClick={() => tile && handleTileSelect(tile, index)}
                            className={`w-10 h-12 rounded bg-amber-400 text-slate-800 font-bold text-xl relative ${selectedTile?.index === index ? 'ring-2 ring-red-500 -translate-y-2' : ''}`}
                            disabled={!tile}
                        >
                            {tile && <>
                                {tile.letter}
                                <span className="absolute bottom-0 right-1 text-xs">{tile.points}</span>
                            </>}
                        </button>
                    ))}
                </div>
            </div>
            
            <div className="flex flex-col gap-2">
                 <button onClick={validateAndScoreTurn} className="px-6 py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition-colors w-full">Jouer le mot</button>
                 <button onClick={() => setCurrentPlayerIndex((currentPlayerIndex + 1) % 2)} className="px-6 py-3 bg-slate-400 text-white font-bold rounded-lg hover:bg-slate-500 transition-colors w-full">Passer le tour</button>
            </div>
            <button onClick={() => setGameState('idle')} className="w-full text-center mt-4 text-sm text-cyan-600 dark:text-cyan-400 font-semibold hover:underline">
                 Abandonner la partie
            </button>
        </div>
    </div>
  );
};

export default ScrabbleGame;