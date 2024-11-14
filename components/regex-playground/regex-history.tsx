import React from 'react'
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

interface RegexHistoryProps {
  history: string[]
  onSelectRegex: (regex: string) => void
}

export function RegexHistory({ history, onSelectRegex }: RegexHistoryProps) {
  return (
    <ScrollArea className="h-[300px]">
      <div className="space-y-2 pr-4">
        {history.map((regex, index) => (
          <Button
            key={index}
            variant="outline"
            className="w-full justify-start"
            onClick={() => onSelectRegex(regex)}
          >
            {regex}
          </Button>
        ))}
      </div>
    </ScrollArea>
  )
}