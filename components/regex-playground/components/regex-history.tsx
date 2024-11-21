import React from 'react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import useUUIDs from '@/hooks/use-uuid'
import { Card, CardContent } from '@/components/ui/card'

type RegexHistoryProps = {
  history: string[]
  onSelectRegex: (regex: string) => void
}

export const RegexHistory = ({ history, onSelectRegex }: RegexHistoryProps) => {
  const memoizedUUIDs = useUUIDs(history)
  if (!history.length)
    return (
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">Regex History</h3>
          <p className="text-gray-500">
            No history yet. Start typing a regex to see it here.
          </p>
        </CardContent>
      </Card>
    )
  return (
    <ScrollArea className="h-[300px]">
      <div className="space-y-2 pr-4">
        {history.map((regex, index) => (
          <Button
            key={memoizedUUIDs[index]}
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
