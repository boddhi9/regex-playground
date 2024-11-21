'use client'

import { Match, SavedPattern, State } from '@/lib/types'
import { useReducer, useCallback, useEffect } from 'react'

type Action =
  | { type: 'SET_REGEX'; payload: string }
  | { type: 'SET_FLAGS'; payload: string }
  | { type: 'SET_TEXT'; payload: string }
  | { type: 'SET_MATCHES'; payload: Match[] }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_IS_VALID'; payload: boolean }
  | { type: 'SET_SAVED_PATTERNS'; payload: SavedPattern[] }
  | { type: 'SET_SELECTED_PATTERN'; payload: string }
  | { type: 'SET_PATTERN_NAME'; payload: string }
  | { type: 'SET_EXECUTION_TIME'; payload: number | null }
  | { type: 'ADD_TO_HISTORY'; payload: string }

const initialState: State = {
  regex: '',
  flags: 'g',
  text: '',
  isValid: true,
  matches: [],
  error: null,
  savedPatterns: [],
  selectedPattern: '',
  patternName: '',
  executionTime: null,
  regexHistory: [],
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_REGEX':
      return { ...state, regex: action.payload, error: null }
    case 'SET_FLAGS':
      return { ...state, flags: action.payload }
    case 'SET_TEXT':
      return { ...state, text: action.payload }
    case 'SET_MATCHES':
      return { ...state, matches: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    case 'SET_IS_VALID':
      return { ...state, isValid: action.payload }
    case 'SET_SAVED_PATTERNS':
      return { ...state, savedPatterns: action.payload }
    case 'SET_SELECTED_PATTERN':
      return { ...state, selectedPattern: action.payload }
    case 'SET_PATTERN_NAME':
      return { ...state, patternName: action.payload }
    case 'SET_EXECUTION_TIME':
      return { ...state, executionTime: action.payload }
    case 'ADD_TO_HISTORY':
      const historyEntry = Array.isArray(action.payload)
        ? action.payload.flat()
        : action.payload

      return {
        ...state,
        regexHistory: [
          ...(Array.isArray(historyEntry) ? historyEntry : [historyEntry]),
          ...state.regexHistory,
        ]
          .filter((r, index, self) => self.indexOf(r) === index)
          .slice(0, 10),
      }
    default:
      return state
  }
}

export const useRegexState = () => {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    const savedPatterns = localStorage.getItem('savedPatterns')
    if (savedPatterns) {
      dispatch({
        type: 'SET_SAVED_PATTERNS',
        payload: JSON.parse(savedPatterns),
      })
    }
    const regexHistory = localStorage.getItem('regexHistory')
    if (regexHistory) {
      dispatch({ type: 'ADD_TO_HISTORY', payload: JSON.parse(regexHistory) })
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('savedPatterns', JSON.stringify(state.savedPatterns))
  }, [state.savedPatterns])

  useEffect(() => {
    localStorage.setItem('regexHistory', JSON.stringify(state.regexHistory))
  }, [state.regexHistory])

  const updateMatches = useCallback(() => {
    if (!state.regex || !state.text) {
      dispatch({ type: 'SET_MATCHES', payload: [] })
      dispatch({ type: 'SET_IS_VALID', payload: true })
      dispatch({ type: 'SET_EXECUTION_TIME', payload: null })
      return
    }

    let regExp
    try {
      regExp = new RegExp(state.regex, state.flags)
    } catch (err) {
      console.warn('Invalid regex caught:', err)
      dispatch({ type: 'SET_IS_VALID', payload: false })
      dispatch({ type: 'SET_ERROR', payload: (err as Error).message })
      dispatch({ type: 'SET_MATCHES', payload: [] })
      dispatch({ type: 'SET_EXECUTION_TIME', payload: null })
      return
    }

    try {
      const startTime = performance.now()
      const newMatches = getMatches(regExp, state.text)
      const endTime = performance.now()
      dispatch({ type: 'SET_MATCHES', payload: newMatches })
      dispatch({ type: 'SET_IS_VALID', payload: true })
      dispatch({ type: 'SET_ERROR', payload: null })
      dispatch({ type: 'SET_EXECUTION_TIME', payload: endTime - startTime })
    } catch (err) {
      dispatch({ type: 'SET_IS_VALID', payload: false })
      dispatch({ type: 'SET_ERROR', payload: (err as Error).message })
      dispatch({ type: 'SET_MATCHES', payload: [] })
      dispatch({ type: 'SET_EXECUTION_TIME', payload: null })
    }
  }, [state.regex, state.flags, state.text])

  useEffect(() => {
    updateMatches()
  }, [updateMatches])

  return { state, dispatch, updateMatches }
}

function getMatches(regex: RegExp, text: string): Match[] {
  const matches: Match[] = []
  let match: RegExpExecArray | null
  while ((match = regex.exec(text)) !== null) {
    matches.push({ index: match.index, value: match[0] })
    if (!regex.global) break
  }
  return matches
}

export const escapeRegExp = (string: string): string => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
