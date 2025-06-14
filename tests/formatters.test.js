import { describe, it, expect } from 'vitest'
import { formatearMoneda } from '../src/utils/formatters'

describe('formatearMoneda', () => {
  it('formats number to Quetzal currency', () => {
    expect(formatearMoneda(1234.56)).toBe('Q 1,234.56')
  })
})
