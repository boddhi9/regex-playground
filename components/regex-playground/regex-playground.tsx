'use client'

import React, { useCallback, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useRegexState } from './use-regex-state'
import { RegexInput } from './components/regex-input'
import { TestStringInput } from './components/test-string-input'
import { MatchesDisplay } from './components/matches-display'
import { PatternLibrary, commonPatterns } from './components/pattern-library'
import { RegexHistory } from './components/regex-history'
import { RegexExplainer } from './components/regex-explainer'
import { RegexChallenges } from './components/regex-challenges'
import { Button } from '@/components/ui/button'
import { Moon, Sun } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function RegexPlayground() {
  const { state, dispatch } = useRegexState()
  const [isDarkMode, setIsDarkMode] = useState(false)

  const handleRegexChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch({ type: 'SET_REGEX', payload: e.target.value })
      dispatch({ type: 'ADD_TO_HISTORY', payload: e.target.value })
    },
    [dispatch]
  )

  const handleFlagsChange = useCallback(
    (checked: boolean, flag: string) => {
      dispatch({
        type: 'SET_FLAGS',
        payload: checked ? state.flags + flag : state.flags.replace(flag, ''),
      })
    },
    [state.flags, dispatch]
  )

  const handleTextChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      dispatch({ type: 'SET_TEXT', payload: e.target.value })
    },
    [dispatch]
  )

  const handleSavePattern = useCallback(() => {
    if (state.regex && state.patternName) {
      dispatch({
        type: 'SET_SAVED_PATTERNS',
        payload: [
          ...state.savedPatterns,
          { name: state.patternName, regex: state.regex, flags: state.flags },
        ],
      })
      dispatch({ type: 'SET_PATTERN_NAME', payload: '' })
    }
  }, [
    state.regex,
    state.patternName,
    state.flags,
    state.savedPatterns,
    dispatch,
  ])

  const handleLoadPattern = useCallback(
    (pattern: string) => {
      if (pattern === 'default') {
        dispatch({ type: 'SET_REGEX', payload: '' })
        dispatch({ type: 'SET_FLAGS', payload: 'g' })
      } else {
        const selectedPattern = state.savedPatterns.find(
          (p) => p.name === pattern
        )
        if (selectedPattern) {
          dispatch({ type: 'SET_REGEX', payload: selectedPattern.regex })
          dispatch({ type: 'SET_FLAGS', payload: selectedPattern.flags })
        } else if (pattern in commonPatterns) {
          dispatch({
            type: 'SET_REGEX',
            payload: commonPatterns[pattern].regex,
          })
          dispatch({ type: 'SET_FLAGS', payload: 'g' })
        }
      }
      dispatch({ type: 'SET_SELECTED_PATTERN', payload: pattern })
    },
    [state.savedPatterns, dispatch]
  )

  const handleDeletePattern = useCallback(
    (patternName: string) => {
      dispatch({
        type: 'SET_SAVED_PATTERNS',
        payload: state.savedPatterns.filter((p) => p.name !== patternName),
      })
    },
    [state.savedPatterns, dispatch]
  )

  const handleCopyRegex = useCallback(() => {
    navigator.clipboard.writeText(state.regex)
  }, [state.regex])

  const handleGenerateRandomString = useCallback(() => {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const length = Math.floor(Math.random() * 50) + 50 // Random length between 50 and 100
    let result = ''
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    dispatch({ type: 'SET_TEXT', payload: result })
  }, [dispatch])

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle('dark')
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className={`w-full max-w-lg md:max-w-2xl lg:max-w-4xl mx-auto ${isDarkMode ? 'dark' : ''}`}
      >
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between p-2 md:p-4">
            <CardTitle>Regex Playground</CardTitle>
            <Button variant="outline" size="icon" onClick={toggleDarkMode}>
              {isDarkMode ? (
                <Sun className="size-5" />
              ) : (
                <Moon className="size-5" />
              )}
            </Button>
          </CardHeader>
          <CardContent className="p-2 md:p-4">
            <Tabs defaultValue="editor" className="space-y-4">
              <TabsList className="flex flex-wrap gap-2 md:grid md:grid-cols-5 overflow-x-auto whitespace-nowrap">
                <TabsTrigger value="editor">Editor</TabsTrigger>
                <TabsTrigger value="library">Library</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
                <TabsTrigger value="explainer">Explainer</TabsTrigger>
                <TabsTrigger value="challenges">Challenges</TabsTrigger>
              </TabsList>
              <TabsContent value="editor" className="space-y-4">
                <RegexInput
                  regex={state.regex}
                  flags={state.flags}
                  isValid={state.isValid}
                  error={state.error}
                  onRegexChange={handleRegexChange}
                  onFlagsChange={handleFlagsChange}
                  onCopyRegex={handleCopyRegex}
                />
                <TestStringInput
                  text={state.text}
                  onTextChange={handleTextChange}
                  onGenerateRandomString={handleGenerateRandomString}
                />
                <MatchesDisplay
                  text={state.text}
                  matches={state.matches}
                  executionTime={state.executionTime}
                />
              </TabsContent>
              <TabsContent value="library">
                <PatternLibrary
                  savedPatterns={state.savedPatterns}
                  selectedPattern={state.selectedPattern}
                  patternName={state.patternName}
                  onLoadPattern={handleLoadPattern}
                  onDeletePattern={handleDeletePattern}
                  onPatternNameChange={(e) =>
                    dispatch({
                      type: 'SET_PATTERN_NAME',
                      payload: e.target.value,
                    })
                  }
                  onSavePattern={handleSavePattern}
                />
              </TabsContent>
              <TabsContent value="history">
                <RegexHistory
                  history={state.regexHistory}
                  onSelectRegex={(regex) =>
                    dispatch({ type: 'SET_REGEX', payload: regex })
                  }
                />
              </TabsContent>
              <TabsContent value="explainer">
                <RegexExplainer regex={state.regex} />
              </TabsContent>
              <TabsContent value="challenges">
                <RegexChallenges />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  )
}
