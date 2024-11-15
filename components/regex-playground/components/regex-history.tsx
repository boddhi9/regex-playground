import React from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

type RegexHistoryProps = {
  history: string[]
  onSelectRegex: (regex: string) => void
}

export const RegexHistory = ({ history, onSelectRegex }: RegexHistoryProps) => {
  return (
    <ScrollArea className="h-[300px]">
      <div className="space-y-2 pr-4">
        {history.map((regex) => (
          <Button
            key={uuidv4()}
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
