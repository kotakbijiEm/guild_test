import { cn } from "@/lib/utils";

interface WinCelebrationProps {
  hasWon: boolean;
  finalChoice: number;
}

export const WinCelebration = ({ hasWon, finalChoice }: WinCelebrationProps) => {
  const handleClaimPrize = () => {
    // Open the prize link in a new tab
    window.open("https://lovable.dev/projects/c0b2883b-3fb2-4433-9642-5ecec9a093b0", "_blank");
  };

  return (
    <div className="text-center mb-8">
      <div
        className={cn(
          "inline-block p-8 rounded-xl border-2 transition-all duration-500",
          hasWon
            ? "bg-gradient-to-r from-game-car/20 to-primary/20 border-game-car animate-celebration"
            : "bg-gradient-to-r from-game-goat/20 to-muted/20 border-game-goat"
        )}
      >
        <div className="space-y-4">
          {hasWon ? (
            <>
              <div className="text-6xl md:text-8xl animate-bounce">🎉</div>
              <h2 className="text-3xl md:text-4xl font-bold text-game-car">
                Congratulations!
              </h2>
              <p className="text-xl text-foreground">
                You won the car behind Door {finalChoice}! 🚗
              </p>
              <div className="mt-6">
                <button
                  onClick={handleClaimPrize}
                  className="bg-yellow-500 text-black hover:bg-yellow-400 rounded-md text-lg px-8 py-3 font-medium transition-colors animate-pulse-glow"
                >
                  🏆 Claim Your Prize! 🏆
                </button>
              </div>
              <p className="text-sm text-muted-foreground">
                You made the statistically optimal choice!
              </p>
            </>
          ) : (
            <>
              <div className="text-6xl md:text-8xl">😅</div>
              <h2 className="text-3xl md:text-4xl font-bold text-game-goat">
                Better luck next time!
              </h2>
              <p className="text-xl text-foreground">
                You got a goat behind Door {finalChoice}. 🐐
              </p>
              <p className="text-sm text-muted-foreground">
                Remember: switching gives you better odds!
              </p>
            </>
          )}
        </div>
      </div>

      {/* Educational note */}
      <div className="mt-6 p-4 bg-muted/30 rounded-lg max-w-2xl mx-auto">
        <p className="text-sm text-muted-foreground">
          <strong>Fun Fact:</strong> With {hasWon ? "your choice" : "more doors"}, switching would have given you{" "}
          <span className="text-primary font-semibold">
            much better odds
          </span>{" "}
          of winning! The probability accumulates on the remaining door.
        </p>
      </div>
    </div>
  );
};