import { useState, useEffect } from "react";
import { Door } from "./Door";
import { GameStatus } from "./GameStatus";
import { WinCelebration } from "./WinCelebration";

type GamePhase = 'setup' | 'choosing' | 'user-revealing' | 'decision' | 'result';

interface GameState {
  numDoors: number;
  selectedDoor: number | null;
  carDoor: number;
  revealedDoors: number[];
  phase: GamePhase;
  finalChoice: number | null;
  hasWon: boolean;
  switchChoice: number | null;
}

export const MontyHallGame = () => {
  const [gameState, setGameState] = useState<GameState>({
    numDoors: 7,
    selectedDoor: null,
    carDoor: 0,
    revealedDoors: [],
    phase: 'setup',
    finalChoice: null,
    hasWon: false,
    switchChoice: null,
  });

  const [currentMessage, setCurrentMessage] = useState("Welcome to the N-Door Monty Hall Challenge!");
  const [showLearnMore, setShowLearnMore] = useState(false);

  const initializeGame = () => {
    const carDoor = Math.floor(Math.random() * gameState.numDoors);
    setGameState(prev => ({
      ...prev,
      carDoor,
      selectedDoor: null,
      revealedDoors: [],
      phase: 'choosing',
      finalChoice: null,
      hasWon: false,
      switchChoice: null,
    }));
    setCurrentMessage(`Choose one of the ${gameState.numDoors} doors!`);
  };

  const selectDoor = (doorIndex: number) => {
    if (gameState.phase === 'choosing') {
      setGameState(prev => ({ ...prev, selectedDoor: doorIndex, phase: 'user-revealing' }));
      setCurrentMessage(`You chose Door ${doorIndex + 1}. Now choose another door to open. Be careful - if it's the car, you lose!`);
    } else if (gameState.phase === 'user-revealing') {
      userRevealDoor(doorIndex);
    }
  };

  const userRevealDoor = (doorIndex: number) => {
    // Don't allow opening the currently held door (selected or final choice)
    const heldDoor = gameState.finalChoice !== null ? gameState.finalChoice : gameState.selectedDoor;
    if (doorIndex === heldDoor) {
      setCurrentMessage("You can't open your chosen door! Pick a different one.");
      return;
    }

    // Check if this is the car door
    if (doorIndex === gameState.carDoor) {
      // Game over - user found the car
      setGameState(prev => ({
        ...prev,
        phase: 'result',
        finalChoice: doorIndex,
        hasWon: false,
        revealedDoors: [...prev.revealedDoors, doorIndex]
      }));
      setCurrentMessage("Oh no! You opened the car door and lost the challenge!");
    } else {
      // User opened a goat door - add to revealed doors
      const newRevealedDoors = [...gameState.revealedDoors, doorIndex];
      
      // Check if we're in the initial phase (before stick/switch decision)
      if (gameState.finalChoice === null) {
        // Find remaining unopened door (excluding selected door and revealed doors)
        const switchOption = Array.from({ length: gameState.numDoors }, (_, i) => i)
          .find(i => i !== gameState.selectedDoor && !newRevealedDoors.includes(i));

        setGameState(prev => ({
          ...prev,
          revealedDoors: newRevealedDoors,
          phase: 'decision',
          switchChoice: switchOption || null
        }));
        
        setCurrentMessage(
          `Good! Door ${doorIndex + 1} has a goat. You chose Door ${(gameState.selectedDoor || 0) + 1}. Only Door ${(switchOption || 0) + 1} remains. Do you want to STICK or SWITCH?`
        );
      } else {
        // After stick/switch decision - continue revealing doors
        const remainingDoors = Array.from({ length: gameState.numDoors }, (_, i) => i)
          .filter(i => i !== heldDoor && !newRevealedDoors.includes(i));
        
        setGameState(prev => ({
          ...prev,
          revealedDoors: newRevealedDoors
        }));

        if (remainingDoors.length === 0) {
          // All doors except the held door are revealed - game ends
          const hasWon = heldDoor === gameState.carDoor;
          setGameState(prev => ({ ...prev, phase: 'result', hasWon }));
          setCurrentMessage("And the winner is...!");
        } else {
          setCurrentMessage(`Good! Door ${doorIndex + 1} has a goat. Continue opening doors or see what's behind your Door ${(heldDoor || 0) + 1}!`);
        }
      }
    }
  };

  const makeDecision = (stick: boolean) => {
    const finalChoice = stick ? gameState.selectedDoor : gameState.switchChoice;
    
    setGameState(prev => ({
      ...prev,
      phase: 'user-revealing',
      finalChoice,
      selectedDoor: finalChoice
    }));

    const remainingDoors = Array.from({ length: gameState.numDoors }, (_, i) => i)
      .filter(i => i !== finalChoice && !gameState.revealedDoors.includes(i));
    
    if (remainingDoors.length === 0) {
      // All doors except final choice are revealed
      const hasWon = finalChoice === gameState.carDoor;
      setGameState(prev => ({ ...prev, phase: 'result', hasWon }));
      setCurrentMessage("And the winner is...!");
    } else {
      setCurrentMessage(`You're now holding Door ${(finalChoice || 0) + 1}. Continue opening the remaining doors!`);
    }
  };

  const resetGame = () => {
    setGameState(prev => ({
      ...prev,
      phase: 'setup',
      selectedDoor: null,
      revealedDoors: [],
      finalChoice: null,
      hasWon: false,
      switchChoice: null,
    }));
    setCurrentMessage("Welcome to the N-Door Monty Hall Challenge!");
  };

  const updateNumDoors = (value: string) => {
    const num = parseInt(value);
    if (num >= 7 && num <= 10) {
      setGameState(prev => ({ ...prev, numDoors: num }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
            The N-Door Monty Hall Challenge
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            Test your probability intuition in this classic game show puzzle!
          </p>
          
          <button 
            onClick={() => setShowLearnMore(!showLearnMore)}
            className="text-primary underline hover:no-underline transition-all duration-200"
          >
            Learn More About the Problem
          </button>
          
          {showLearnMore && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <div className="bg-background border border-border rounded-lg max-w-3xl max-h-[80vh] overflow-y-auto p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold">Understanding the N-Door Monty Hall Challenge</h3>
                  <button 
                    onClick={() => setShowLearnMore(false)}
                    className="text-muted-foreground hover:text-foreground text-2xl"
                  >
                    ×
                  </button>
                </div>
                <div className="text-left space-y-4 text-base text-muted-foreground">
                  <p>
                    Imagine you're on a game show, facing N doors. Behind just one of these doors is a gleaming, 
                    brand-new car – your coveted prize! Behind all the other N-1 doors are goats.
                  </p>
                  
                  <p className="font-semibold text-foreground">Your Initial Choice:</p>
                  <p>
                    The host, Monty Hall, invites you to make your first selection. You choose one door – let's call it your "initial pick." 
                    At this moment, your chances of having picked the car are a modest 1 out of N. Conversely, the collective chances of the car 
                    being behind any of the other N-1 doors are much higher: (N-1) out of N.
                  </p>
                  
                  <p className="font-semibold text-foreground">Monty's Strategic Reveal:</p>
                  <p>
                    Now, here's where the magic happens. Monty, who always knows exactly where the car is hidden, will then proceed to open N-2 
                    of the remaining doors. These are all the doors you didn't choose, except for one. With each dramatic reveal, Monty ensures 
                    that every single door he opens displays a goat. He will never open the door with the car.
                  </p>
                  
                  <p className="font-semibold text-foreground">The Pivotal Decision:</p>
                  <p>
                    So, you're left with two closed doors: Your initial chosen door, still unopened, and one single, unopened door from the 
                    large group you didn't initially pick. Monty asks: "Do you want to STICK with your original choice, or would you like to SWITCH?"
                  </p>
                  
                  <p className="font-semibold text-foreground">The Power of Switching:</p>
                  <p>
                    While your initial choice began with a 1/N chance of being correct, that single remaining unchosen, unopened door now 
                    effectively carries the accumulated probability of all the other N-1 doors that Monty deliberately avoided opening. 
                    The odds overwhelmingly favor switching your choice!
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {gameState.phase === 'setup' && (
          <div className="p-8 mb-8 bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg">
            <div className="space-y-6 text-center">
              <div className="space-y-2">
                <label htmlFor="numDoors" className="block text-lg font-medium">
                  Set Your Doors (7-10)
                </label>
                <input
                  id="numDoors"
                  type="number"
                  min="7"
                  max="10"
                  value={gameState.numDoors}
                  onChange={(e) => updateNumDoors(e.target.value)}
                  className="w-32 mx-auto text-center text-lg h-10 rounded-md border border-input bg-background px-3 py-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
              <button 
                onClick={initializeGame}
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md text-lg px-8 py-3 font-medium transition-colors"
              >
                Start Game
              </button>
            </div>
          </div>
        )}

        {gameState.phase !== 'setup' && (
          <>
            <GameStatus 
              message={currentMessage} 
              phase={gameState.phase}
              isRevealing={false}
            />

            <div className="flex flex-wrap justify-center gap-6 mb-8 min-h-[200px]">
              {Array.from({ length: gameState.numDoors }, (_, index) => (
                <Door
                  key={index}
                  index={index}
                  isSelected={gameState.selectedDoor === index}
                  isRevealed={gameState.revealedDoors.includes(index)}
                  isCarDoor={gameState.carDoor === index}
                  isFinalChoice={gameState.finalChoice === index}
                  isSwitchOption={gameState.switchChoice === index}
                  onClick={() => selectDoor(index)}
                  canClick={gameState.phase === 'choosing' || gameState.phase === 'user-revealing'}
                  showContent={gameState.phase === 'result' || gameState.revealedDoors.includes(index)}
                />
              ))}
            </div>

            {gameState.phase === 'decision' && (
              <div className="flex justify-center gap-6 mb-8">
                <button
                  onClick={() => makeDecision(true)}
                  className="bg-green-600 text-white hover:bg-green-700 rounded-md text-lg px-8 py-3 font-medium transition-colors"
                >
                  STICK with Door {(gameState.selectedDoor || 0) + 1}
                </button>
                <button
                  onClick={() => makeDecision(false)}
                  className="bg-blue-600 text-white hover:bg-blue-700 rounded-md text-lg px-8 py-3 font-medium transition-colors"
                >
                  SWITCH to Door {(gameState.switchChoice || 0) + 1}
                </button>
              </div>
            )}

            {gameState.phase === 'result' && (
              <>
                <WinCelebration 
                  hasWon={gameState.hasWon} 
                  finalChoice={(gameState.finalChoice || 0) + 1}
                />
                <div className="text-center">
                  <button
                    onClick={resetGame}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md text-lg px-8 py-3 font-medium transition-colors"
                  >
                    Play Again
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};