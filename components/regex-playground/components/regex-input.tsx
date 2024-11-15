import React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Copy } from 'lucide-react'

type RegexInputProps = {
  regex: string
  flags: string
  isValid: boolean
  error: string | null
  onRegexChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onFlagsChange: (checked: boolean, flag: string) => void
  onCopyRegex: () => void
}

export const RegexInput = ({
  regex,
  flags,
  isValid,
  error,
  onRegexChange,
  onFlagsChange,
  onCopyRegex,
}: RegexInputProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="regex">Regular Expression</Label>
        <div className="flex items-center space-x-2">
          <Input
            id="regex"
            value={regex}
            onChange={onRegexChange}
            className={`mt-1 grow ${isValid ? '' : 'border-red-500'}`}
            placeholder="Enter your regex here"
          />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={onCopyRegex}>
                  <Copy className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Copy regex</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
      <div className="flex space-x-4">
        <Label className="flex items-center space-x-2">
          <Switch
            checked={flags.includes('g')}
            onCheckedChange={(checked) => onFlagsChange(checked, 'g')}
          />
          <span>Global</span>
        </Label>
        <Label className="flex items-center space-x-2">
          <Switch
            checked={flags.includes('i')}
            onCheckedChange={(checked) => onFlagsChange(checked, 'i')}
          />
          <span>Case Insensitive</span>
        </Label>
        <Label className="flex items-center space-x-2">
          <Switch
            checked={flags.includes('m')}
            onCheckedChange={(checked) => onFlagsChange(checked, 'm')}
          />
          <span>Multiline</span>
        </Label>
      </div>
    </div>
  )
}
