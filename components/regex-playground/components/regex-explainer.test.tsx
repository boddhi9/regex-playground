import React from 'react'
import { render, screen } from '@testing-library/react'
import { RegexExplainer } from './regex-explainer'

describe('RegexExplainer', () => {
  it('renders a list of explanations for a regex string', () => {
    const regex = '^hello.*world$'
    render(<RegexExplainer regex={regex} />)

    expect(
      screen.getByText('Matches the start of the line')
    ).toBeInTheDocument()
    expect(
      screen.getByText('Matches any character except newline')
    ).toBeInTheDocument()
    expect(
      screen.getByText('Matches 0 or more of the preceding character')
    ).toBeInTheDocument()
    expect(screen.getByText('Matches the end of the line')).toBeInTheDocument()
  })

  it('renders a fallback message when no explanations are available', () => {
    const regex = ''
    render(<RegexExplainer regex={regex} />)

    expect(
      screen.getByText('No explanation available for the given regex.')
    ).toBeInTheDocument()
  })

  it('renders special characters explanations', () => {
    const regex = '\\d+'
    render(<RegexExplainer regex={regex} />)

    expect(screen.getByText('Special character: \\d')).toBeInTheDocument()
    expect(
      screen.getByText('Matches 1 or more of the preceding character')
    ).toBeInTheDocument()
  })
})
