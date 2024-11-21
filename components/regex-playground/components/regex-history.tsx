import React from 'react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import useUUIDs from '@/hooks/use-uuid'
import { Card, CardContent } from '@/components/ui/card'
import { Trash } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

type RegexHistoryProps = {
  history: string[]
  onSelectRegex: (regex: string) => void
  onClearHistory: () => void
  onDeleteRegex: (regex: string) => void
}

export const RegexHistory = ({
  history,
  onSelectRegex,
  onClearHistory,
  onDeleteRegex,
}: RegexHistoryProps) => {
  const memoizedUUIDs = useUUIDs(history)

  const handleSelectRegex = (event: React.MouseEvent<HTMLButtonElement>) => {
    const regexValue = event.currentTarget.textContent || ''
    onSelectRegex(regexValue)
    toast({
      title: 'Regex has been loaded.',
    })
  }

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
    <div className="relative">
      <ScrollArea className="h-[300px]">
        <div className="space-y-2 pr-4">
          {history.map((regex, index) => (
            <div
              key={memoizedUUIDs[index]}
              className="flex items-center justify-between p-2 bg-secondary rounded-md"
            >
              <Button
                variant="outline"
                className="flex-1 justify-start truncate"
                onClick={handleSelectRegex} // Now correctly typed for button clicks
              >
                {regex}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="ml-2"
                onClick={() => onDeleteRegex(regex)}
              >
                <Trash className="size-4" />
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="absolute bottom-0 right-0 p-4">
        <Button onClick={onClearHistory} variant="destructive">
          Clear All
        </Button>
      </div>
    </div>
  )
}
