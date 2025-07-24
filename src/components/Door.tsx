import { cn } from "@/lib/utils";

interface DoorProps {
  index: number;
  isSelected: boolean;
  isRevealed: boolean;
  isCarDoor: boolean;
  isFinalChoice: boolean;
  isSwitchOption: boolean;
  onClick: () => void;
  canClick: boolean;
  showContent: boolean;
}

export const Door = ({
  index,
  isSelected,
  isRevealed,
  isCarDoor,
  isFinalChoice,
  isSwitchOption,
  onClick,
  canClick,
  showContent
}: DoorProps) => {
  const doorNumber = index + 1;
  
  return (
    <div className="relative">
      <div
        className={cn(
          "relative w-24 h-32 md:w-32 md:h-40 cursor-pointer transition-all duration-300 perspective-1000",
          canClick && "hover:scale-105",
          !canClick && "cursor-default"
        )}
        onClick={canClick ? onClick : undefined}
      >
        {/* Door */}
        <div
          className={cn(
            "absolute inset-0 rounded-lg border-4 transition-all duration-800 transform-style-preserve-3d",
            "bg-gradient-to-b from-game-door to-game-door/80 shadow-lg",
            isSelected && "border-game-door-selected shadow-[0_0_30px_hsl(var(--game-door-selected)/0.5)]",
            isSwitchOption && "border-accent animate-pulse-glow",
            isFinalChoice && "border-primary shadow-[0_0_40px_hsl(var(--primary)/0.6)]",
            isRevealed && "animate-door-open origin-left",
            !isSelected && !isSwitchOption && !isFinalChoice && "border-border"
          )}
        >
          {/* Door Number */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl md:text-3xl font-bold text-foreground">
              {doorNumber}
            </span>
          </div>
          
          {/* Door Handle */}
          <div className="absolute right-2 top-1/2 -translate-y-1/2 w-2 h-6 bg-muted rounded-full"></div>
        </div>

        {/* Content behind door */}
        {showContent && (
          <div
            className={cn(
              "absolute inset-0 rounded-lg border-4 flex items-center justify-center text-6xl",
              "animate-fade-in",
              isCarDoor ? "bg-game-car/20 border-game-car" : "bg-game-goat/20 border-game-goat"
            )}
          >
            {isCarDoor ? (
              <div className="text-center">
                <div className="text-4xl md:text-6xl mb-2">🚗</div>
                <div className="text-xs md:text-sm font-bold text-game-car">CAR!</div>
              </div>
            ) : (
              <div className="text-center">
                <div className="text-4xl md:text-6xl mb-2">🐐</div>
                <div className="text-xs md:text-sm font-bold text-game-goat">Goat</div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Door labels */}
      {isSelected && (
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-center">
          <div className="text-sm font-bold text-game-door-selected">Your Choice</div>
        </div>
      )}
      
      {isSwitchOption && (
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-center">
          <div className="text-sm font-bold text-accent animate-float">Switch Option</div>
        </div>
      )}
    </div>
  );
};