import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import useUUIDs from '@/hooks/use-uuid'

type RegexExplainerProps = {
  regex: string
}

export const RegexExplainer = ({ regex }: RegexExplainerProps) => {
  const explainRegex = (regex: string): string[] => {
    const explanations: string[] = []

    if (regex.startsWith('^')) {
      explanations.push('Matches the start of the line')
    }
    if (regex.endsWith('$')) {
      explanations.push('Matches the end of the line')
    }

    regex.replace(/\\.|\[.*?\]|\(\?:.*?\)|\(.*?\)|\w+|./g, (match) => {
      switch (match) {
        case '.':
          explanations.push('Matches any character except newline')
          break
        case '*':
          explanations.push('Matches 0 or more of the preceding character')
          break
        case '+':
          explanations.push('Matches 1 or more of the preceding character')
          break
        case '?':
          explanations.push('Matches 0 or 1 of the preceding character')
          break
        default:
          if (match.startsWith('[') && match.endsWith(']')) {
            explanations.push(
              `Matches any single character in the set: ${match}`
            )
          } else if (match.startsWith('(') && match.endsWith(')')) {
            explanations.push(`Grouping: ${match}`)
          } else if (match.startsWith('\\')) {
            explanations.push(`Special character: ${match}`)
          }
      }
      return match
    })

    return explanations
  }

  const explanations = explainRegex(regex)
  const memoizedUUIDs = useUUIDs(explanations)

  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold mb-4">Regex Explanation</h3>
        {explanations.length > 0 ? (
          <ul className="list-disc pl-5 space-y-2">
            {explanations.map((explanation, index) => (
              <li key={memoizedUUIDs[index]}>{explanation}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">
            No explanation available for the given regex.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
