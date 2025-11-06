import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ChessBoard from './ChessBoard';
import Icon from '@/components/ui/icon';

type Difficulty = 'easy' | 'medium' | 'hard';
type Section = 'menu' | 'game' | 'rules' | 'tutorial' | 'settings';

export default function GameMenu() {
  const [currentSection, setCurrentSection] = useState<Section>('menu');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [soundEnabled, setSoundEnabled] = useState(true);

  const renderMenu = () => (
    <div className="flex flex-col items-center gap-6 p-8">
      <h1 className="text-2xl sm:text-4xl pixel-text text-primary mb-8 text-center">
        RETRO CHESS
      </h1>
      
      <div className="flex flex-col gap-4 w-full max-w-md">
        <button
          onClick={() => setCurrentSection('game')}
          className="w-full px-8 py-4 bg-primary text-primary-foreground pixel-text text-sm hover:bg-primary/80 transition-all hover:scale-105"
        >
          ▶ START GAME
        </button>
        
        <button
          onClick={() => setCurrentSection('rules')}
          className="w-full px-8 py-4 bg-secondary text-secondary-foreground pixel-text text-sm hover:bg-secondary/80 transition-all hover:scale-105"
        >
          📖 RULES
        </button>
        
        <button
          onClick={() => setCurrentSection('tutorial')}
          className="w-full px-8 py-4 bg-secondary text-secondary-foreground pixel-text text-sm hover:bg-secondary/80 transition-all hover:scale-105"
        >
          🎓 TUTORIAL
        </button>
        
        <button
          onClick={() => setCurrentSection('settings')}
          className="w-full px-8 py-4 bg-secondary text-secondary-foreground pixel-text text-sm hover:bg-secondary/80 transition-all hover:scale-105"
        >
          ⚙️ SETTINGS
        </button>
      </div>
    </div>
  );

  const renderRules = () => (
    <div className="p-8 max-w-2xl mx-auto">
      <button
        onClick={() => setCurrentSection('menu')}
        className="mb-6 px-4 py-2 bg-secondary text-secondary-foreground pixel-text text-xs hover:bg-secondary/80"
      >
        ← BACK
      </button>
      
      <h2 className="text-xl sm:text-2xl pixel-text text-primary mb-6">RULES</h2>
      
      <Card className="p-6 bg-card space-y-4">
        <div className="space-y-4 text-xs sm:text-sm pixel-text leading-relaxed">
          <div>
            <div className="text-primary mb-2">♙ PAWN</div>
            <div className="text-muted-foreground">Moves forward 1 square. First move: 2 squares. Captures diagonally.</div>
          </div>
          
          <div>
            <div className="text-primary mb-2">♘ KNIGHT</div>
            <div className="text-muted-foreground">Moves in L-shape: 2+1 squares. Can jump over pieces.</div>
          </div>
          
          <div>
            <div className="text-primary mb-2">♗ BISHOP</div>
            <div className="text-muted-foreground">Moves diagonally any distance.</div>
          </div>
          
          <div>
            <div className="text-primary mb-2">♖ ROOK</div>
            <div className="text-muted-foreground">Moves horizontally or vertically any distance.</div>
          </div>
          
          <div>
            <div className="text-primary mb-2">♕ QUEEN</div>
            <div className="text-muted-foreground">Combines rook and bishop moves.</div>
          </div>
          
          <div>
            <div className="text-primary mb-2">♔ KING</div>
            <div className="text-muted-foreground">Moves 1 square in any direction. Protect at all costs!</div>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderTutorial = () => (
    <div className="p-8 max-w-2xl mx-auto">
      <button
        onClick={() => setCurrentSection('menu')}
        className="mb-6 px-4 py-2 bg-secondary text-secondary-foreground pixel-text text-xs hover:bg-secondary/80"
      >
        ← BACK
      </button>
      
      <h2 className="text-xl sm:text-2xl pixel-text text-primary mb-6">TUTORIAL</h2>
      
      <Card className="p-6 bg-card space-y-6">
        <div className="space-y-4 text-xs sm:text-sm pixel-text leading-relaxed">
          <div>
            <div className="text-primary mb-2">STEP 1: SELECT PIECE</div>
            <div className="text-muted-foreground">Click on your white piece to see available moves.</div>
          </div>
          
          <div>
            <div className="text-primary mb-2">STEP 2: MAKE MOVE</div>
            <div className="text-muted-foreground">Click on highlighted square to move there.</div>
          </div>
          
          <div>
            <div className="text-primary mb-2">STEP 3: AI RESPONDS</div>
            <div className="text-muted-foreground">Computer makes its move automatically.</div>
          </div>
          
          <div>
            <div className="text-primary mb-2">TIPS</div>
            <div className="text-muted-foreground">
              • Control the center<br/>
              • Protect your king<br/>
              • Develop pieces early<br/>
              • Think ahead
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderSettings = () => (
    <div className="p-8 max-w-2xl mx-auto">
      <button
        onClick={() => setCurrentSection('menu')}
        className="mb-6 px-4 py-2 bg-secondary text-secondary-foreground pixel-text text-xs hover:bg-secondary/80"
      >
        ← BACK
      </button>
      
      <h2 className="text-xl sm:text-2xl pixel-text text-primary mb-6">SETTINGS</h2>
      
      <Card className="p-6 bg-card space-y-6">
        <div className="space-y-4">
          <div>
            <div className="text-sm pixel-text mb-3">DIFFICULTY</div>
            <div className="flex flex-col gap-2">
              {(['easy', 'medium', 'hard'] as Difficulty[]).map((level) => (
                <button
                  key={level}
                  onClick={() => setDifficulty(level)}
                  className={`
                    px-4 py-3 pixel-text text-xs transition-all
                    ${difficulty === level 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    }
                  `}
                >
                  {difficulty === level && '► '}{level.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <div className="text-sm pixel-text mb-3">SOUND</div>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`
                px-4 py-3 pixel-text text-xs transition-all w-full
                ${soundEnabled 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-secondary text-secondary-foreground'
                }
              `}
            >
              {soundEnabled ? '🔊 ON' : '🔇 OFF'}
            </button>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderGame = () => (
    <div className="p-4">
      <button
        onClick={() => setCurrentSection('menu')}
        className="mb-4 px-4 py-2 bg-secondary text-secondary-foreground pixel-text text-xs hover:bg-secondary/80"
      >
        ← MENU
      </button>
      
      <ChessBoard difficulty={difficulty} />
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-full">
        {currentSection === 'menu' && renderMenu()}
        {currentSection === 'game' && renderGame()}
        {currentSection === 'rules' && renderRules()}
        {currentSection === 'tutorial' && renderTutorial()}
        {currentSection === 'settings' && renderSettings()}
      </div>
    </div>
  );
}
