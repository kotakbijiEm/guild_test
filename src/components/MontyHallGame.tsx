import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Door } from "./Door";
import { GameStatus } from "./GameStatus";
import { WinCelebration } from "./WinCelebration";

type GamePhase = 'setup' | 'choosing' | 'revealing' | 'decision' | 'result';

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
    numDoors: 3,
    selectedDoor: null,
    carDoor: 0,
    revealedDoors: [],
    phase: 'setup',
    finalChoice: null,
    hasWon: false,
    switchChoice: null,
  });

  const [currentMessage, setCurrentMessage] = useState("Welcome to the N-Door Monty Hall Challenge!");
  const [isRevealing, setIsRevealing] = useState(false);

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
    if (gameState.phase !== 'choosing') return;
    
    setGameState(prev => ({ ...prev, selectedDoor: doorIndex }));
    setCurrentMessage(`You chose Door ${doorIndex + 1}. Now, let's see what Monty does...`);
    
    // Start revealing phase after a short delay
    setTimeout(() => {
      revealGoats(doorIndex);
    }, 1500);
  };

  const revealGoats = async (selectedDoor: number) => {
    setGameState(prev => ({ ...prev, phase: 'revealing' }));
    setIsRevealing(true);
    setCurrentMessage("Monty is revealing goats...");

    // Get all doors except the selected one and the car door
    const doorsToReveal = [];
    for (let i = 0; i < gameState.numDoors; i++) {
      if (i !== selectedDoor && i !== gameState.carDoor) {
        doorsToReveal.push(i);
      }
    }

    // We need to reveal N-2 doors total
    const numToReveal = gameState.numDoors - 2;
    const revealThese = doorsToReveal.slice(0, numToReveal);

    // Reveal doors one by one with animation
    for (let i = 0; i < revealThese.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setGameState(prev => ({
        ...prev,
        revealedDoors: [...prev.revealedDoors, revealThese[i]]
      }));
      setCurrentMessage(`Monty opened Door ${revealThese[i] + 1} - it's a goat!`);
    }

    // Find the switch option (the remaining unopened door that's not the selected one)
    const switchOption = Array.from({ length: gameState.numDoors }, (_, i) => i)
      .find(i => i !== selectedDoor && !revealThese.includes(i));

    setGameState(prev => ({ 
      ...prev, 
      phase: 'decision',
      switchChoice: switchOption || null
    }));
    
    setCurrentMessage(
      `You chose Door ${selectedDoor + 1}. Only Door ${(switchOption || 0) + 1} remains unopened. Do you want to STICK with your original choice, or SWITCH?`
    );
    setIsRevealing(false);
  };

  const makeDecision = (stick: boolean) => {
    const finalChoice = stick ? gameState.selectedDoor : gameState.switchChoice;
    const hasWon = finalChoice === gameState.carDoor;
    
    setGameState(prev => ({
      ...prev,
      phase: 'result',
      finalChoice,
      hasWon
    }));

    setCurrentMessage("And the winner is...!");
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
    if (num >= 3 && num <= 10) {
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
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="link" className="text-primary">
                Learn More About the Problem
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Understanding the N-Door Monty Hall Challenge</DialogTitle>
              </DialogHeader>
              <DialogDescription className="text-left space-y-4 text-base">
                <p>
                  Imagine you're on a game show, facing N doors. Behind just one of these doors is a gleaming, 
                  brand-new car – your coveted prize! Behind all the other N-1 doors are goats.
                </p>
                
                <p className="font-semibold">Your Initial Choice:</p>
                <p>
                  The host, Monty Hall, invites you to make your first selection. You choose one door – let's call it your "initial pick." 
                  At this moment, your chances of having picked the car are a modest 1 out of N. Conversely, the collective chances of the car 
                  being behind any of the other N-1 doors are much higher: (N-1) out of N.
                </p>
                
                <p className="font-semibold">Monty's Strategic Reveal:</p>
                <p>
                  Now, here's where the magic happens. Monty, who always knows exactly where the car is hidden, will then proceed to open N-2 
                  of the remaining doors. These are all the doors you didn't choose, except for one. With each dramatic reveal, Monty ensures 
                  that every single door he opens displays a goat. He will never open the door with the car.
                </p>
                
                <p className="font-semibold">The Pivotal Decision:</p>
                <p>
                  So, you're left with two closed doors: Your initial chosen door, still unopened, and one single, unopened door from the 
                  large group you didn't initially pick. Monty asks: "Do you want to STICK with your original choice, or would you like to SWITCH?"
                </p>
                
                <p className="font-semibold">The Power of Switching:</p>
                <p>
                  While your initial choice began with a 1/N chance of being correct, that single remaining unchosen, unopened door now 
                  effectively carries the accumulated probability of all the other N-1 doors that Monty deliberately avoided opening. 
                  The odds overwhelmingly favor switching your choice!
                </p>
              </DialogDescription>
            </DialogContent>
          </Dialog>
        </div>

        {gameState.phase === 'setup' && (
          <Card className="p-8 mb-8 bg-card/50 backdrop-blur-sm border-border/50">
            <div className="space-y-6 text-center">
              <div className="space-y-2">
                <Label htmlFor="numDoors" className="text-lg font-medium">
                  Set Your Doors (3-10)
                </Label>
                <Input
                  id="numDoors"
                  type="number"
                  min="3"
                  max="10"
                  value={gameState.numDoors}
                  onChange={(e) => updateNumDoors(e.target.value)}
                  className="w-32 mx-auto text-center text-lg"
                />
              </div>
              <Button 
                variant="game" 
                size="lg" 
                onClick={initializeGame}
                className="text-lg px-8 py-3"
              >
                Start Game
              </Button>
            </div>
          </Card>
        )}

        {gameState.phase !== 'setup' && (
          <>
            <GameStatus 
              message={currentMessage} 
              phase={gameState.phase}
              isRevealing={isRevealing}
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
                  canClick={gameState.phase === 'choosing'}
                  showContent={gameState.phase === 'result' || gameState.revealedDoors.includes(index)}
                />
              ))}
            </div>

            {gameState.phase === 'decision' && (
              <div className="flex justify-center gap-6 mb-8">
                <Button
                  variant="game-stick"
                  size="lg"
                  onClick={() => makeDecision(true)}
                  className="text-lg px-8 py-3"
                >
                  STICK with Door {(gameState.selectedDoor || 0) + 1}
                </Button>
                <Button
                  variant="game-switch"
                  size="lg"
                  onClick={() => makeDecision(false)}
                  className="text-lg px-8 py-3"
                >
                  SWITCH to Door {(gameState.switchChoice || 0) + 1}
                </Button>
              </div>
            )}

            {gameState.phase === 'result' && (
              <>
                <WinCelebration 
                  hasWon={gameState.hasWon} 
                  finalChoice={(gameState.finalChoice || 0) + 1}
                />
                <div className="text-center">
                  <Button
                    variant="game"
                    size="lg"
                    onClick={resetGame}
                    className="text-lg px-8 py-3"
                  >
                    Play Again
                  </Button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};