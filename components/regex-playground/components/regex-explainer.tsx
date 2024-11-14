import React from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Card, CardContent } from '@/components/ui/card'

type RegexExplainerProps = {
  regex: string
}

export function RegexExplainer({ regex }: RegexExplainerProps) {
  const explainRegex = (regex: string) => {
    const explanations: string[] = []

    if (regex.startsWith('^'))
      explanations.push('Matches the start of the line')
    if (regex.endsWith('$')) explanations.push('Matches the end of the line')

    regex.replace(/\\.|\[.*?\]|$$\?:.*?$$|$$.*?$$|\w+|./g, (match) => {
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
          } else if (match.length > 1 && match.startsWith('\\')) {
            explanations.push(`Special character: ${match}`)
          }
      }
      return match
    })

    return explanations
  }

  const explanations = explainRegex(regex)

  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold mb-4">Regex Explanation</h3>
        <ul className="list-disc pl-5 space-y-2">
          {explanations.map((explanation) => (
            <li key={uuidv4()}>{explanation}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
