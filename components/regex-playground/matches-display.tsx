import React from 'react'
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Match } from '@/lib/types'

type MatchesDisplayProps = {
  text: string
  matches: Match[]
  executionTime: number | null
}

export function MatchesDisplay({ text, matches, executionTime }: MatchesDisplayProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label>Matches</Label>
        <Card className="mt-1 p-2 min-h-[100px] max-h-[200px] overflow-auto">
          {highlightMatches(text, matches)}
        </Card>
      </div>
      <div className="flex justify-between items-center">
        <p>Number of matches: {matches.length}</p>
        {executionTime !== null && (
          <p>Execution time: {executionTime.toFixed(2)} ms</p>
        )}
      </div>
    </div>
  )
}

function highlightMatches(text: string, matches: Match[]): React.ReactNode {
  let lastIndex = 0
  const elements: React.ReactNode[] = []

  matches.forEach((match, i) => {
    if (match.index > lastIndex) {
      elements.push(text.slice(lastIndex, match.index))
    }
    elements.push(
      <mark key={i} className="bg-yellow-200 dark:bg-yellow-800">
        {match.value}
      </mark>
    )
    lastIndex = match.index + match.value.length
  })

  if (lastIndex < text.length) {
    elements.push(text.slice(lastIndex))
  }

  return elements
}