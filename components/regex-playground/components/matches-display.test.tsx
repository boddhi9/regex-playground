import React from 'react'
import { render } from '@testing-library/react'
import { Match } from '@/lib/types'
import { highlightMatches } from './matches-display'

describe('highlightMatches', () => {
  it('highlights matches correctly within the text', () => {
    const text = 'The quick brown fox jumps over the lazy dog.'
    const matches: Match[] = [
      { index: 4, value: 'quick' },
      { index: 16, value: 'fox' },
    ]

    const highlighted = highlightMatches(text, matches)
    const { container } = render(<div>{highlighted}</div>)

    expect(container).toHaveTextContent(
      'The quick brown fox jumps over the lazy dog.'
    )

    const marks = container.querySelectorAll('mark')
    expect(marks).toHaveLength(2)
    expect(marks[0]).toHaveTextContent('quick')
    expect(marks[0]).toHaveClass('bg-yellow-200')
    expect(marks[1]).toHaveTextContent('fox')
    expect(marks[1]).toHaveClass('bg-yellow-200')
  })

  it('preserves text before and after matches', () => {
    const text = 'Hello world!'
    const matches: Match[] = [{ index: 6, value: 'world' }]

    const highlighted = highlightMatches(text, matches)
    const { container } = render(<div>{highlighted}</div>)

    expect(container).toHaveTextContent('Hello world!')
    const marks = container.querySelectorAll('mark')
    expect(marks).toHaveLength(1)
    expect(marks[0]).toHaveTextContent('world')
  })

  it('handles no matches gracefully', () => {
    const text = 'No matches here.'
    const matches: Match[] = []

    const highlighted = highlightMatches(text, matches)
    const { container } = render(<div>{highlighted}</div>)

    expect(container).toHaveTextContent(text)
    expect(container.querySelector('mark')).toBeNull()
  })

  it('handles text ending after the last match correctly', () => {
    const text = 'Pattern at the end match'
    const matches: Match[] = [{ index: 17, value: 'match' }]

    const highlighted = highlightMatches(text, matches)
    const { container } = render(<div>{highlighted}</div>)

    const marks = container.querySelectorAll('mark')
    expect(marks).toHaveLength(1)
    expect(marks[0]).toHaveTextContent('match')
  })

  it('handles overlapping matches correctly', () => {
    const text = 'abcabc'
    const matches: Match[] = [
      { index: 0, value: 'abc' },
      { index: 3, value: 'abc' },
    ]

    const highlighted = highlightMatches(text, matches)
    const { container } = render(<div>{highlighted}</div>)

    const marks = container.querySelectorAll('mark')
    expect(marks).toHaveLength(2)
    expect(marks[0]).toHaveTextContent('abc')
    expect(marks[1]).toHaveTextContent('abc')
  })
})
