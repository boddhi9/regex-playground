import React from 'react'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

interface TestStringInputProps {
  text: string
  onTextChange: (_e: React.ChangeEvent<HTMLTextAreaElement>) => void
  onGenerateRandomString: () => void
}

export function TestStringInput({
  text,
  onTextChange,
  onGenerateRandomString,
}: TestStringInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="text">Test String</Label>
      <Textarea
        id="text"
        value={text}
        onChange={onTextChange}
        className="mt-1"
        placeholder="Enter your test string here"
        rows={5}
      />
      <Button onClick={onGenerateRandomString} variant="outline">
        Generate Random String
      </Button>
    </div>
  )
}
