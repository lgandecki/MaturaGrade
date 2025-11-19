import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, CheckCircle, AlertCircle, Share2, PenTool, RefreshCcw, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface GradingResult {
  score: number;
  maxScore: number;
  feedback: string;
  errors: string[];
  suggestions: string[];
}

export default function Home() {
  const [text, setText] = useState("");
  const [isGrading, setIsGrading] = useState(false);
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

    setIsGrading(true);
    setResult(null);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2500));

    setResult({
      score: 14,
      maxScore: 20,
      feedback: "Dobra praca z kilkoma błędami stylistycznymi. Argumentacja jest spójna, ale brakuje głębszego odwołania do literatury przedmiotu.",
      errors: [
        "Powtórzenie w akapicie 2: 'jest to'",
        "Błąd interpunkcyjny w zdaniu podrzędnym",
        "Zbyt potoczne sformułowanie: 'fajna sprawa'"
      ],
      suggestions: [
        "Rozbuduj wstęp o kontekst historyczny",
        "Użyj bardziej zróżnicowanego słownictwa",
        "Dodaj cytat potwierdzający tezę"
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
    navigator.clipboard.writeText(`Uzyskałem ${result?.score}/${result?.maxScore} punktów z mojej pracy maturalnej! Sprawdź swoją na MaturaGrader.`);
    toast({
      title: "Skopiowano do schowka",
      description: "Link do wyniku został skopiowany.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col items-center max-w-7xl mx-auto relative">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none opacity-30 z-[-1] bg-[radial-gradient(circle_at_50%_120%,rgba(212,175,55,0.15),transparent_50%)]" />

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
                    setText(" "); // Trigger text mode
                  }}
                  data-testid="button-manual-write"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Napisz ręcznie
                </Button>
              </div>
            ) : (
              <div className="relative h-[600px]">
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
                <Card className="p-8 lg:p-10 bg-white shadow-xl border-none relative overflow-hidden min-h-[600px] flex flex-col">
                  {/* Decorative stamp */}
                  <div className="absolute -top-6 -right-6 w-32 h-32 bg-accent/10 rounded-full blur-2xl pointer-events-none" />
                  
                  <div className="flex justify-between items-start mb-8 border-b border-border pb-6">
                    <div>
                      <p className="text-sm text-muted-foreground uppercase tracking-widest font-bold mb-2">Wynik Maturalny</p>
                      <div className="flex items-baseline gap-3">
                        <span className="text-7xl font-serif font-bold text-primary" data-testid="text-score">{result.score}</span>
                        <span className="text-3xl text-muted-foreground font-light">/ {result.maxScore}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className={`
                        w-20 h-20 rounded-full border-[3px] flex items-center justify-center rotate-12 shadow-sm
                        ${result.score / result.maxScore > 0.7 ? 'border-green-500 text-green-600 bg-green-50' : 'border-accent text-accent-foreground bg-accent/10'}
                      `}>
                        <span className="text-2xl font-bold font-serif" data-testid="text-percentage">{Math.round((result.score / result.maxScore) * 100)}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-8">
                    <h4 className="font-semibold mb-3 flex items-center gap-2 text-primary">
                      <PenTool size={18} className="text-accent" /> Komentarz egzaminatora
                    </h4>
                    <p className="text-primary/80 italic leading-relaxed border-l-4 border-accent/40 pl-6 py-2 bg-accent/5 rounded-r-lg" data-testid="text-feedback">
                      "{result.feedback}"
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-6 mb-8 overflow-y-auto pr-2 custom-scrollbar">
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
