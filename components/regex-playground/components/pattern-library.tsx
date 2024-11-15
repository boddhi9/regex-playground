import React from 'react'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Trash } from 'lucide-react'
import { SavedPattern } from '@/lib/types'

type PatternLibraryProps = {
  savedPatterns: SavedPattern[]
  selectedPattern: string
  patternName: string
  onLoadPattern: (pattern: string) => void
  onDeletePattern: (patternName: string) => void
  onPatternNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSavePattern: () => void
}

export const commonPatterns: {
  [key: string]: { regex: string; description: string }
} = {
  email: {
    regex: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$',
    description: 'Matches most email addresses',
  },
  phoneNumber: {
    regex: '^\\+?\\d{10,14}$',
    description: 'Matches phone numbers with optional + prefix',
  },
  url: {
    regex:
      'https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)',
    description: 'Matches URLs',
  },
  ipAddress: {
    regex: '\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b',
    description: 'Matches IPv4 addresses',
  },
  date: {
    regex: '\\d{4}-\\d{2}-\\d{2}',
    description: 'Matches dates in YYYY-MM-DD format',
  },
}

export const PatternLibrary = ({
  savedPatterns,
  selectedPattern,
  patternName,
  onLoadPattern,
  onDeletePattern,
  onPatternNameChange,
  onSavePattern,
}: PatternLibraryProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="patternSelect">Select a pattern</Label>
        <Select onValueChange={onLoadPattern} value={selectedPattern}>
          <SelectTrigger id="patternSelect">
            <SelectValue placeholder="Choose a pattern" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Choose a pattern</SelectItem>
            {Object.entries(commonPatterns).map(([key, value]) => (
              <SelectItem key={key} value={key}>
                {key} - {value.description}
              </SelectItem>
            ))}
            {savedPatterns.map((pattern) => (
              <SelectItem key={pattern.name} value={pattern.name}>
                {pattern.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <h3 className="font-semibold">Saved Patterns</h3>
        {savedPatterns.map((pattern) => (
          <div
            key={pattern.name}
            className="flex items-center justify-between p-2 bg-secondary rounded-md"
          >
            <span>{pattern.name}</span>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onLoadPattern(pattern.name)}
              >
                Load
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDeletePattern(pattern.name)}
              >
                <Trash className="size-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center space-x-2">
        <Input
          value={patternName}
          onChange={onPatternNameChange}
          placeholder="Pattern name"
        />
        <Button onClick={onSavePattern}>Save Pattern</Button>
      </div>
    </div>
  )
}
