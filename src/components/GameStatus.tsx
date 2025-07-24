import { cn } from "@/lib/utils";

interface GameStatusProps {
  message: string;
  phase: string;
  isRevealing: boolean;
}

export const GameStatus = ({ message, phase, isRevealing }: GameStatusProps) => {
  return (
    <div className="text-center mb-8">
      <div
        className={cn(
          "inline-block p-6 rounded-lg border transition-all duration-300",
          "bg-card/80 backdrop-blur-sm border-border/50",
          isRevealing && "animate-pulse-glow"
        )}
      >
        <h2
          className={cn(
            "text-xl md:text-2xl font-bold mb-2 transition-colors duration-300",
            phase === 'choosing' && "text-primary",
            phase === 'revealing' && "text-accent animate-pulse",
            phase === 'decision' && "text-secondary",
            phase === 'result' && "text-primary"
          )}
        >
          {phase === 'choosing' && "🎯 Make Your Choice"}
          {phase === 'revealing' && "🎭 Monty's Reveal"}
          {phase === 'decision' && "🤔 Stick or Switch?"}
          {phase === 'result' && "🎉 The Result"}
        </h2>
        
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          {message}
        </p>
        
        {isRevealing && (
          <div className="mt-4 flex justify-center">
            <div className="flex space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};