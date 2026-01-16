"use client"

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-card/30 py-4">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
          <p className="font-medium">Autorzy projektu:</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <span>Patryk Czajka (167191)</span>
            <span className="text-muted-foreground/50">•</span>
            <span>Konrad Przybysz (167196)</span>
            <span className="text-muted-foreground/50">•</span>
            <span>Albert Szymkowiak (167311)</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
