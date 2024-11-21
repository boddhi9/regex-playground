'use client'

import React, { useCallback, useState, useEffect, useRef, useMemo } from 'react'
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
import { Moon, Sun, Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import useDebounce from '@/hooks/use-debounce'

export default function RegexPlayground() {
  const { state, dispatch } = useRegexState()
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMenuOpen(true)
      }
    }
    window.addEventListener('resize', handleResize)
    handleResize()
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const [debouncedRegex, setDebouncedRegex] = useDebounce(state.regex, {
    delay: 1000,
  })

  const handleRegexChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value
      dispatch({ type: 'SET_REGEX', payload: newValue })
      setDebouncedRegex(newValue)
    },
    [dispatch, setDebouncedRegex]
  )

  useEffect(() => {
    if (debouncedRegex) {
      dispatch({ type: 'ADD_TO_HISTORY', payload: debouncedRegex })
    }
  }, [debouncedRegex, dispatch])

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

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
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
        <Card className="w-full shadow-lg rounded-lg overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between p-3 md:p-5 bg-gradient-to-r from-yellow-300 via-pink-400 to-blue-600 dark:from-purple-800 dark:via-black dark:to-indigo-900 text-white rounded-t-lg">
            <CardTitle className="text-xl font-semibold">
              Regex Playground
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
                {isDarkMode ? (
                  <Sun className="size-5" />
                ) : (
                  <Moon className="size-5" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={toggleMenu}
              >
                {menuOpen ? (
                  <X className="size-6" />
                ) : (
                  <Menu className="size-6" />
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-3 md:p-5 bg-white dark:bg-gray-900">
            <div className={`${menuOpen ? 'block' : 'hidden'} md:block`}>
              <Tabs defaultValue="editor" className="space-y-4">
                <TabsList className="flex flex-wrap gap-2 md:grid md:grid-cols-5 overflow-x-auto whitespace-nowrap">
                  <TabsTrigger
                    value="editor"
                    className="hover:bg-teal-200 dark:hover:bg-teal-700 transition rounded-md"
                  >
                    Editor
                  </TabsTrigger>
                  <TabsTrigger
                    value="library"
                    className="hover:bg-teal-200 dark:hover:bg-teal-700 transition rounded-md"
                  >
                    Library
                  </TabsTrigger>
                  <TabsTrigger
                    value="history"
                    className="hover:bg-teal-200 dark:hover:bg-teal-700 transition rounded-md"
                  >
                    History
                  </TabsTrigger>
                  <TabsTrigger
                    value="explainer"
                    className="hover:bg-teal-200 dark:hover:bg-teal-700 transition rounded-md"
                  >
                    Explainer
                  </TabsTrigger>
                  <TabsTrigger
                    value="challenges"
                    className="hover:bg-teal-200 dark:hover:bg-teal-700 transition rounded-md"
                  >
                    Challenges
                  </TabsTrigger>
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
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  )
}
