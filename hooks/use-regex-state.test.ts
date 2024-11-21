import { renderHook, act, waitFor } from '@testing-library/react'
import { Match } from '@/lib/types'
import { useRegexState } from './use-regex-state'

describe('useRegexState hook', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('initializes with default state', () => {
    const { result } = renderHook(() => useRegexState())

    expect(result.current.state.regex).toBe('')
    expect(result.current.state.flags).toBe('g')
    expect(result.current.state.text).toBe('')
    expect(result.current.state.isValid).toBe(true)
    expect(result.current.state.matches).toEqual([])
    expect(result.current.state.error).toBeNull()
    expect(result.current.state.savedPatterns).toEqual([])
    expect(result.current.state.selectedPattern).toBe('')
    expect(result.current.state.patternName).toBe('')
    expect(result.current.state.executionTime).toBeNull()
    expect(result.current.state.regexHistory).toEqual([])
  })

  it('dispatches SET_REGEX action correctly', () => {
    const { result } = renderHook(() => useRegexState())

    act(() => {
      result.current.dispatch({ type: 'SET_REGEX', payload: 'test' })
    })

    expect(result.current.state.regex).toBe('test')
    expect(result.current.state.error).toBeNull()
  })

  it('dispatches SET_FLAGS action correctly', () => {
    const { result } = renderHook(() => useRegexState())

    act(() => {
      result.current.dispatch({ type: 'SET_FLAGS', payload: 'i' })
    })

    expect(result.current.state.flags).toBe('i')
  })

  it('updates matches correctly with valid regex and text', () => {
    const { result } = renderHook(() => useRegexState())

    act(() => {
      result.current.dispatch({ type: 'SET_REGEX', payload: '\\btest\\b' })
      result.current.dispatch({
        type: 'SET_TEXT',
        payload: 'This is a test string for testing.',
      })
      result.current.updateMatches()
    })

    const expectedMatches: Match[] = [{ index: 10, value: 'test' }]
    expect(result.current.state.matches).toEqual(expectedMatches)
    expect(result.current.state.isValid).toBe(true)
    expect(result.current.state.error).toBeNull()
    expect(result.current.state.executionTime).not.toBeNull()
  })

  it('handles regex errors gracefully', async () => {
    const { result } = renderHook(() => useRegexState())

    act(() => {
      result.current.dispatch({ type: 'SET_REGEX', payload: '[' })
    })

    act(() => {
      result.current.updateMatches()
    })

    await waitFor(() => {
      expect(result.current.state.matches).toEqual([])
    })
  })

  it('saves and loads saved patterns from localStorage', () => {
    const savedPatterns = [{ name: 'pattern1', regex: '\\d+', flags: 'g' }]
    localStorage.setItem('savedPatterns', JSON.stringify(savedPatterns))

    const { result } = renderHook(() => useRegexState())

    expect(result.current.state.savedPatterns).toEqual(savedPatterns)
  })

  it('adds to regex history correctly and limits to 10 entries', () => {
    const { result } = renderHook(() => useRegexState())

    act(() => {
      for (let i = 0; i < 15; i++) {
        result.current.dispatch({
          type: 'ADD_TO_HISTORY',
          payload: `regex${i}`,
        })
      }
    })

    expect(result.current.state.regexHistory.length).toBe(10)
    expect(result.current.state.regexHistory).toEqual(
      expect.arrayContaining(['regex14', 'regex13'])
    )
  })
})
