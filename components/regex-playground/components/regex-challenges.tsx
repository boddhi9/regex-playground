import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

const challenges = [
  {
    description: "Match all words that start with 'a' or 'A'",
    testString: 'Apple and banana are fruits. An aardvark is an animal.',
    solution: '\\b[aA]\\w+',
  },
  {
    description: 'Match all valid email addresses',
    testString: 'Contact us at info@example.com or support@company.co.uk',
    solution: '\\b[\\w.%-]+@[\\w.-]+\\.[a-zA-Z]{2,4}\\b',
  },
  {
    description: 'Match all dates in the format DD/MM/YYYY',
    testString: 'Important dates: 25/12/2023, 01/01/2024, 14/02/2024',
    solution: '\\b\\d{2}/\\d{2}/\\d{4}\\b',
  },
]

export function RegexChallenges() {
  const [currentChallenge, setCurrentChallenge] = useState(0)
  const [userRegex, setUserRegex] = useState('')
  const [result, setResult] = useState('')

  const handleSubmit = () => {
    try {
      const regex = new RegExp(userRegex, 'g')
      const matches = challenges[currentChallenge].testString.match(regex)
      const expectedMatches = challenges[currentChallenge].testString.match(
        new RegExp(challenges[currentChallenge].solution, 'g')
      )

      if (
        matches &&
        expectedMatches &&
        matches.length === expectedMatches.length &&
        matches.every((match, i) => match === expectedMatches[i])
      ) {
        setResult('Correct! Well done!')
      } else {
        setResult('Not quite right. Try again!')
      }
    } catch (error) {
      setResult('Invalid regex. Please check your syntax.')
      console.error(error)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Regex Challenge</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>{challenges[currentChallenge].description}</p>
        <p>Test string: {challenges[currentChallenge].testString}</p>
        <div className="space-y-2">
          <Label htmlFor="user-regex">Your Regex:</Label>
          <Input
            id="user-regex"
            value={userRegex}
            onChange={(e) => setUserRegex(e.target.value)}
            placeholder="Enter your regex here"
          />
        </div>
        <Button onClick={handleSubmit}>Submit</Button>
        {result && <p className="font-semibold">{result}</p>}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() =>
              setCurrentChallenge((prev) => (prev > 0 ? prev - 1 : prev))
            }
            disabled={currentChallenge === 0}
          >
            Previous Challenge
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              setCurrentChallenge((prev) =>
                prev < challenges.length - 1 ? prev + 1 : prev
              )
            }
            disabled={currentChallenge === challenges.length - 1}
          >
            Next Challenge
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
