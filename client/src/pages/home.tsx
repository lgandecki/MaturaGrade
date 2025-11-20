import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, CheckCircle, AlertCircle, Share2, PenTool, RefreshCcw, Copy, Check, Maximize2, Minimize2, ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface GradingResult {
  totalScore: number;
  maxTotalScore: number;
  criteria: {
    formalRequirements: {
        points: number; // 0 or 1
        reasons: {
            cardinalError: boolean;
            missingReading: boolean;
            irrelevant: boolean;
            notArgumentative: boolean;
        }
    };
    literaryCompetencies: {
        points: number; // 0-16
        factualErrors: number;
    };
    structure: {
        points: number; // 0-3
    };
    coherence: {
        points: number; // 0-3
        coherenceErrors: number;
    };
    style: {
        points: number; // 0-1
    };
    language: {
        points: number; // 0-7
        languageErrors: number;
    };
    spelling: {
        points: number; // 0-2
        spellingErrors: number;
    };
    punctuation: {
        points: number; // 0-2
        punctuationErrors: number;
    };
  };
  feedback: string;
  errors: string[];
  suggestions: string[];
}

const ScoreBox = ({ 
  value, 
  selected, 
  onClick 
}: { 
  value: number; 
  selected: boolean; 
  onClick?: () => void 
}) => (
  <div 
    className={cn(
      "w-8 h-8 md:w-10 md:h-10 flex items-center justify-center border border-primary/20 text-sm md:text-base font-serif font-medium transition-all",
      selected 
        ? "bg-primary text-primary-foreground ring-2 ring-offset-2 ring-primary" 
        : "bg-white text-primary/60"
    )}
  >
    {value}
  </div>
);

const ErrorCountBox = ({ label, count }: { label: string; count: number }) => (
  <div className="flex flex-col items-center justify-center bg-red-50 border border-red-200 px-2 py-1 min-w-[60px]">
    <span className="text-[10px] uppercase tracking-wider text-red-800 font-semibold text-center leading-tight mb-1">{label}</span>
    <span className="text-lg font-bold text-red-600 font-serif">{count}</span>
  </div>
);

const GradingRow = ({ 
  number, 
  label, 
  score, 
  maxScore, 
  errorLabel,
  errorCount,
  children 
}: { 
  number: string; 
  label: string; 
  score: number; 
  maxScore: number;
  errorLabel?: string;
  errorCount?: number;
  children?: React.ReactNode 
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center gap-4 p-3 md:p-4 bg-white/40 border border-primary/10 rounded-lg mb-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 md:w-1/3">
        <div className="w-10 h-10 bg-primary text-primary-foreground flex items-center justify-center text-lg font-bold font-serif shadow-sm shrink-0">
          {number}
        </div>
        <span className="font-medium text-sm md:text-base leading-tight">{label}</span>
      </div>
      
      <div className="flex flex-wrap items-center gap-1 md:gap-2 flex-1 justify-end">
        {errorLabel && errorCount !== undefined && (
          <div className="mr-2 md:mr-4">
            <ErrorCountBox label={errorLabel} count={errorCount} />
          </div>
        )}
        
        <div className="flex gap-1">
           {Array.from({ length: maxScore + 1 }).map((_, i) => (
            <ScoreBox key={i} value={i} selected={score === i} />
          ))}
        </div>
      </div>
      
      {children && <div className="w-full md:w-auto">{children}</div>}
    </div>
  );
};

const ReasonBox = ({ label, active }: { label: string; active: boolean }) => (
  <div className={cn(
    "text-[10px] uppercase tracking-wide p-2 border text-center leading-tight h-full flex items-center justify-center transition-colors",
    active ? "bg-red-100 border-red-300 text-red-800 font-medium" : "bg-white/50 border-primary/10 text-muted-foreground/50"
  )}>
    {label}
  </div>
);


export default function Home() {
  const [text, setText] = useState("");
  const [isGrading, setIsGrading] = useState(false);
  const [isWritingMode, setIsWritingMode] = useState(false);
  const [result, setResult] = useState<GradingResult | null>(null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const content = reader.result as string;
        setText(content);
        toast({
          title: "Dokument wczytany",
          description: `Wczytano ${file.name}`,
        });
      };
      reader.readAsText(file);
    }
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: {'text/plain': ['.txt'], 'application/markdown': ['.md']} });

  const handleGrade = async () => {
    if (!text.trim()) {
      toast({
        title: "Pusty dokument",
        description: "Wpisz tekst lub wgraj plik, aby ocenić pracę.",
        variant: "destructive"
      });
      return;
    }

    if (isWritingMode) {
      setIsWritingMode(false);
    }

    setIsGrading(true);
    setResult(null);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2500));

    setResult({
      totalScore: 35,
      maxTotalScore: 50,
      criteria: {
        formalRequirements: {
            points: 1,
            reasons: {
                cardinalError: false,
                missingReading: false,
                irrelevant: false,
                notArgumentative: false
            }
        },
        literaryCompetencies: {
            points: 11,
            factualErrors: 1
        },
        structure: {
            points: 3
        },
        coherence: {
            points: 2,
            coherenceErrors: 2
        },
        style: {
            points: 1
        },
        language: {
            points: 5,
            languageErrors: 4
        },
        spelling: {
            points: 2,
            spellingErrors: 0
        },
        punctuation: {
            points: 1,
            punctuationErrors: 3
        }
      },
      feedback: "Dobra praca z kilkoma błędami stylistycznymi. Argumentacja jest spójna, ale brakuje głębszego odwołania do literatury przedmiotu. Zwróć uwagę na interpunkcję w zdaniach wielokrotnie złożonych.",
      errors: [
        "Powtórzenie w akapicie 2: 'jest to'",
        "Błąd interpunkcyjny w zdaniu podrzędnym",
        "Zbyt potoczne sformułowanie: 'fajna sprawa'",
        "Błąd rzeczowy: Wokulski nie był pozytywistą w pełnym tego słowa znaczeniu"
      ],
      suggestions: [
        "Rozbuduj wstęp o kontekst historyczny",
        "Użyj bardziej zróżnicowanego słownictwa (synonimy)",
        "Dodaj cytat potwierdzający tezę z 'Lalki'",
        "Przećwicz stosowanie przecinków przed spójnikami"
      ]
    });
    setIsGrading(false);
  };

  const handleReset = () => {
    setText("");
    setResult(null);
  };

  const handleShare = () => {
    setCopied(true);
    navigator.clipboard.writeText(`Uzyskałem ${result?.totalScore}/${result?.maxTotalScore} punktów z mojej pracy maturalnej! Sprawdź swoją na MaturaGrader.`);
    toast({
      title: "Skopiowano do schowka",
      description: "Link do wyniku został skopiowany.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const enterWritingMode = () => {
    if (!text) setText(" "); // Ensure text state is initialized
    setIsWritingMode(true);
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col items-center max-w-7xl mx-auto relative">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none opacity-30 z-[-1] bg-[radial-gradient(circle_at_50%_120%,rgba(212,175,55,0.15),transparent_50%)]" />

      {/* Full Screen Writing Mode Overlay */}
      <AnimatePresence>
        {isWritingMode && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 10 }}
            className="fixed inset-0 z-50 bg-background flex flex-col items-center overflow-hidden"
            data-testid="writing-mode-overlay"
          >
            {/* Writing Header - Floating */}
            <div className="w-full max-w-6xl px-4 py-4 flex justify-between items-center z-10">
              <Button 
                variant="ghost" 
                onClick={() => setIsWritingMode(false)}
                className="text-muted-foreground hover:text-primary gap-2 hover:bg-white/50"
              >
                <ArrowLeft size={18} /> Wróć
              </Button>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground font-serif italic px-4 py-1 bg-white/50 rounded-full backdrop-blur-sm border border-border/20 shadow-sm">
                <PenTool size={14} />
                Tryb skupienia
              </div>

              <Button 
                onClick={handleGrade}
                className="bg-primary text-white hover:bg-primary/90 gap-2 shadow-md hover:shadow-lg transition-all"
              >
                <Sparkles size={16} />
                Oceń pracę
              </Button>
            </div>

            {/* Writing Area - The Paper Sheet */}
            <div className="flex-1 w-full overflow-y-auto pb-20 px-4 flex justify-center">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="w-full max-w-3xl bg-white shadow-2xl my-4 min-h-[85vh] relative"
              >
                {/* Paper texture/lines overlay (optional, subtle) */}
                <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(transparent_23px,#e5e7eb_24px)] bg-[size:100%_24px] opacity-10 mt-12" />
                
                {/* Left margin line */}
                <div className="absolute left-12 top-0 bottom-0 w-[1px] bg-red-300/30 pointer-events-none hidden md:block" />

                <Textarea 
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Rozpocznij pisanie swojej rozprawki..."
                  className="w-full h-full min-h-[85vh] resize-none py-12 px-8 md:px-16 text-lg md:text-xl leading-[24px] font-serif bg-transparent border-none focus:ring-0 focus:outline-none text-primary placeholder:text-muted-foreground/30 relative z-10"
                  spellCheck={false}
                  autoFocus
                />
              </motion.div>
            </div>

            {/* Writing Footer - Floating */}
            <div className="fixed bottom-6 right-6 md:right-12 z-10">
              <div className="bg-white/80 backdrop-blur-md border border-border shadow-lg rounded-full px-4 py-2 text-xs md:text-sm text-muted-foreground flex gap-4 items-center">
                <span>Zapisano: {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                <div className="w-px h-3 bg-border" />
                <span className="font-medium text-primary">{text.split(/\s+/).filter(w => w.length > 0).length} słów</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="w-full flex justify-between items-center mb-12 mt-4 z-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary text-primary-foreground rounded-xl flex items-center justify-center shadow-lg transform rotate-3">
            <PenTool size={24} strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="text-2xl font-serif font-bold tracking-tight text-primary">MaturaGrader</h1>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">AI Assistant</p>
          </div>
        </div>
        <Button variant="ghost" className="font-serif italic hover:bg-transparent hover:text-accent transition-colors" data-testid="button-about">
          O projekcie
        </Button>
      </header>

      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Input Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4 relative z-0"
        >
          <div className="flex justify-between items-center px-1">
            <h2 className="text-xl font-serif font-medium flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-sans">1</span>
              Twoja praca
            </h2>
            {text && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleReset} 
                className="text-muted-foreground hover:text-destructive hover:bg-destructive/5"
                data-testid="button-reset"
              >
                <RefreshCcw size={14} className="mr-2" />
                Wyczyść
              </Button>
            )}
          </div>

          <div className="relative group rounded-xl overflow-hidden shadow-sm transition-shadow hover:shadow-md border border-border/60 bg-white">
            {/* Scanning Animation Overlay */}
            {isGrading && (
              <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
                 <motion.div
                  className="w-full h-1 bg-accent/50 shadow-[0_0_20px_2px_rgba(212,175,55,0.5)]"
                  initial={{ top: "0%" }}
                  animate={{ top: "100%" }}
                  transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                />
                <div className="absolute inset-0 bg-primary/5 backdrop-blur-[1px]" />
              </div>
            )}

            {!text ? (
              <div
                {...getRootProps()}
                className={`
                  h-[600px] flex flex-col items-center justify-center p-8 text-center cursor-pointer transition-all duration-300
                  ${isDragActive ? "bg-accent/5" : "hover:bg-gray-50/50"}
                `}
                data-testid="dropzone-input"
              >
                <input {...getInputProps()} data-testid="input-file" />
                <div className={`
                  w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-all duration-500
                  ${isDragActive ? "bg-accent text-white scale-110" : "bg-secondary text-muted-foreground group-hover:scale-105"}
                `}
                >
                  <Upload size={32} strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-serif font-medium mb-3 text-primary">Upuść plik tutaj</h3>
                <p className="text-muted-foreground max-w-xs text-sm leading-relaxed mb-8">
                  Obsługujemy pliki tekstowe (.txt, .md).
                  <br />Możesz też wpisać tekst ręcznie.
                </p>
                <Button 
                  variant="outline" 
                  className="border-primary/20 hover:border-primary/50 hover:bg-primary/5 text-primary font-medium px-8" 
                  onClick={(e) => {
                    e.stopPropagation();
                    enterWritingMode();
                  }}
                  data-testid="button-manual-write"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Napisz ręcznie
                </Button>
              </div>
            ) : (
              <div className="relative h-[600px]">
                <div className="absolute top-2 right-2 z-10">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-primary bg-white/50 backdrop-blur-sm"
                    onClick={enterWritingMode}
                    title="Pełny ekran"
                    data-testid="button-expand"
                  >
                    <Maximize2 size={18} />
                  </Button>
                </div>
                <Textarea 
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Zacznij pisać swoją rozprawkę tutaj..."
                  className="h-full resize-none p-8 text-lg leading-relaxed font-serif bg-transparent border-none focus:ring-0 focus:outline-none text-primary/90"
                  spellCheck={false}
                  data-testid="textarea-content"
                />
                <div className="absolute bottom-4 right-4 text-xs font-medium text-muted-foreground/80 bg-secondary/50 px-3 py-1.5 rounded-full backdrop-blur-sm" data-testid="text-word-count">
                  {text.split(/\s+/).filter(w => w.length > 0).length} słów
                </div>
              </div>
            )}
          </div>

          <Button 
            size="lg" 
            className={`
              w-full text-lg h-14 font-serif mt-4 transition-all duration-300
              ${isGrading ? "opacity-80" : "hover:translate-y-[-2px] shadow-lg hover:shadow-xl"}
            `}
            onClick={handleGrade}
            disabled={isGrading || !text}
            data-testid="button-grade"
          >
            {isGrading ? (
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-white rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-white rounded-full animate-bounce delay-75" />
                <span className="w-2 h-2 bg-white rounded-full animate-bounce delay-150" />
                Analizowanie
              </span>
            ) : "Oceń pracę"}
          </Button>
        </motion.div>

        {/* Results Section */}
        <div className="relative z-0">
          <div className="flex justify-between items-center px-1 mb-4">
            <h2 className="text-xl font-serif font-medium flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-sans">2</span>
              Wynik
            </h2>
          </div>

          <AnimatePresence mode="wait">
            {!result ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="h-[600px] flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-border rounded-xl bg-white/20"
                data-testid="container-empty-state"
              >
                <div className="w-24 h-24 bg-muted/30 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle size={40} className="text-muted-foreground/40" />
                </div>
                <h3 className="text-2xl font-serif font-medium mb-3 text-muted-foreground/70">Oczekiwanie na pracę</h3>
                <p className="text-muted-foreground/60 max-w-md leading-relaxed">
                  Tutaj pojawi się szczegółowa analiza Twojej pracy, zawierająca ocenę punktową, listę błędów oraz sugestie poprawek.
                </p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col gap-6 h-full"
                data-testid="container-result"
              >
                <Card className="p-8 bg-white shadow-xl border-none relative overflow-hidden min-h-[600px] flex flex-col">
                  {/* Decorative stamp */}
                  <div className="absolute -top-6 -right-6 w-32 h-32 bg-accent/10 rounded-full blur-2xl pointer-events-none" />
                  
                  <div className="flex justify-between items-start mb-8 border-b border-border pb-6">
                    <div>
                      <p className="text-sm text-muted-foreground uppercase tracking-widest font-bold mb-2">Wynik Maturalny</p>
                      <div className="flex items-baseline gap-3">
                        <span className="text-7xl font-serif font-bold text-primary" data-testid="text-score">{result.totalScore}</span>
                        <span className="text-3xl text-muted-foreground font-light">/ {result.maxTotalScore}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className={`
                        w-20 h-20 rounded-full border-[3px] flex items-center justify-center rotate-12 shadow-sm
                        ${result.totalScore / result.maxTotalScore > 0.7 ? 'border-green-500 text-green-600 bg-green-50' : 'border-accent text-accent-foreground bg-accent/10'}
                      `}>
                        <span className="text-2xl font-bold font-serif" data-testid="text-percentage">{Math.round((result.totalScore / result.maxTotalScore) * 100)}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    {/* 1. Formal Requirements */}
                    <GradingRow 
                        number="1." 
                        label="Spełnienie formalnych warunków polecenia" 
                        score={result.criteria.formalRequirements.points}
                        maxScore={1}
                    >
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2 w-full">
                            <ReasonBox label="Błąd kardynalny" active={result.criteria.formalRequirements.reasons.cardinalError} />
                            <ReasonBox label="Brak lektury" active={result.criteria.formalRequirements.reasons.missingReading} />
                            <ReasonBox label="Nie dotyczy problemu" active={result.criteria.formalRequirements.reasons.irrelevant} />
                            <ReasonBox label="Brak argumentacji" active={result.criteria.formalRequirements.reasons.notArgumentative} />
                        </div>
                    </GradingRow>

                    {/* 2. Literary Competencies - Large Scale */}
                    <div className="flex flex-col gap-4 p-3 md:p-4 bg-white/40 border border-primary/10 rounded-lg mb-4 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                         <div className="flex items-center gap-3 md:w-1/3">
                            <div className="w-10 h-10 bg-primary text-primary-foreground flex items-center justify-center text-lg font-bold font-serif shadow-sm shrink-0">
                              2.
                            </div>
                            <span className="font-medium text-sm md:text-base leading-tight">Kompetencje literackie i kulturowe</span>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <ErrorCountBox label="Błędy rzeczowe" count={result.criteria.literaryCompetencies.factualErrors} />
                            <div className="flex flex-col items-center justify-center bg-white border border-primary/20 px-3 py-1 min-w-[60px] h-full">
                                <span className="text-[10px] uppercase tracking-wider text-primary/60 font-semibold text-center leading-tight mb-1">OGÓŁEM</span>
                                <span className="text-lg font-bold text-primary font-serif">{result.criteria.literaryCompetencies.points}</span>
                            </div>
                          </div>
                      </div>
                      {/* Split scale into two rows for readability on smaller screens or just one wrapped flex */}
                      <div className="flex flex-wrap gap-1 justify-center mt-2">
                        {Array.from({ length: 17 }).map((_, i) => (
                           <ScoreBox key={i} value={i} selected={result.criteria.literaryCompetencies.points === i} />
                        ))}
                      </div>
                    </div>

                    {/* 3a. Structure */}
                    <GradingRow 
                        number="3a" 
                        label="Struktura wypowiedzi" 
                        score={result.criteria.structure.points}
                        maxScore={3}
                    />

                    {/* 3b. Coherence */}
                    <GradingRow 
                        number="3b" 
                        label="Spójność wypowiedzi" 
                        score={result.criteria.coherence.points}
                        maxScore={3}
                        errorLabel="Błędy w spójności"
                        errorCount={result.criteria.coherence.coherenceErrors}
                    />

                    {/* 3c. Style */}
                    <GradingRow 
                        number="3c" 
                        label="Styl wypowiedzi" 
                        score={result.criteria.style.points}
                        maxScore={1}
                    />

                    {/* 4a. Language */}
                    <GradingRow 
                        number="4a" 
                        label="Zakres i poprawność środków językowych" 
                        score={result.criteria.language.points}
                        maxScore={7}
                        errorLabel="Błędy językowe"
                        errorCount={result.criteria.language.languageErrors}
                    />

                    {/* 4b. Spelling */}
                    <GradingRow 
                        number="4b" 
                        label="Poprawność ortograficzna" 
                        score={result.criteria.spelling.points}
                        maxScore={2}
                        errorLabel="Błędy ortograficzne"
                        errorCount={result.criteria.spelling.spellingErrors}
                    />

                    {/* 4c. Punctuation */}
                    <GradingRow 
                        number="4c" 
                        label="Poprawność interpunkcyjna" 
                        score={result.criteria.punctuation.points}
                        maxScore={2}
                        errorLabel="Błędy interpunkcyjne"
                        errorCount={result.criteria.punctuation.punctuationErrors}
                    />
                  </div>
                  
                  <div className="mb-8">
                    <h4 className="font-semibold mb-3 flex items-center gap-2 text-primary">
                      <PenTool size={18} className="text-accent" /> Komentarz egzaminatora
                    </h4>
                    <p className="text-primary/80 italic leading-relaxed border-l-4 border-accent/40 pl-6 py-2 bg-accent/5 rounded-r-lg" data-testid="text-feedback">
                      "{result.feedback}"
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-6 mb-8">
                     <div className="space-y-3">
                        <h4 className="font-semibold text-destructive flex items-center gap-2 text-sm uppercase tracking-wide">
                           <AlertCircle size={16} /> Do poprawy
                        </h4>
                        <ul className="space-y-3" data-testid="list-errors">
                          {result.errors.map((err, i) => (
                            <li key={i} className="text-sm text-primary/80 flex items-start gap-3 bg-red-50/50 p-3 rounded border border-red-100" data-testid={`item-error-${i}`}>
                              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-destructive shrink-0" />
                              {err}
                            </li>
                          ))}
                        </ul>
                     </div>
                     
                     <div className="space-y-3">
                        <h4 className="font-semibold text-green-600 flex items-center gap-2 text-sm uppercase tracking-wide">
                           <CheckCircle size={16} /> Sugestie rozwoju
                        </h4>
                        <ul className="space-y-3" data-testid="list-suggestions">
                          {result.suggestions.map((sugg, i) => (
                            <li key={i} className="text-sm text-primary/80 flex items-start gap-3 bg-green-50/50 p-3 rounded border border-green-100" data-testid={`item-suggestion-${i}`}>
                              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                              {sugg}
                            </li>
                          ))}
                        </ul>
                     </div>
                  </div>

                  <div className="flex gap-4 mt-auto pt-6 border-t border-border">
                    <Button 
                      className="flex-1 bg-primary text-white hover:bg-primary/90 h-12 text-lg font-serif"
                      onClick={handleShare}
                      data-testid="button-share"
                    >
                      {copied ? <Check className="mr-2 h-5 w-5" /> : <Share2 className="mr-2 h-5 w-5" />}
                      {copied ? "Skopiowano!" : "Udostępnij wynik"}
                    </Button>
                    <Button 
                      variant="outline" 
                      className="px-4 h-12 border-primary/20" 
                      onClick={() => toast({ title: "Funkcja niedostępna", description: "Pobieranie PDF będzie dostępne wkrótce." })}
                      data-testid="button-download"
                    >
                      <Copy className="h-5 w-5" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
