import conformToMask from '../../src/utils/conformToMask'

describe('conformToMask', () => {
  describe('when the value is null or undefined', () => {
    it('returns the previous conformed value', () => {
      const currencyFormat = { decimalSymbol: '.', prefix: '$', suffix: '' }
      expect(conformToMask(undefined, currencyFormat, '$1')).toEqual({ conformedValue: '$1' })
      expect(conformToMask(null, currencyFormat, '$1')).toEqual({ conformedValue: '$1' })
    })
  })

  describe('when the value is invalid', () => {
    it('returns an empty value', () => {
      const currencyFormat = { decimalSymbol: '.', prefix: '$', suffix: '' }

      expect(conformToMask('', currencyFormat, '$1')).toEqual({ conformedValue: '' })
      expect(conformToMask(' ', currencyFormat, '$1')).toEqual({ conformedValue: '' })
      expect(conformToMask('foo', currencyFormat, '$1')).toEqual({ conformedValue: '' })
      expect(conformToMask('$', currencyFormat, '$1')).toEqual({ conformedValue: '' })
      expect(conformToMask('$a', currencyFormat, '$1')).toEqual({ conformedValue: '' })
    })
  })

  describe('when the fraction is invalid', () => {
    it('returns the previous conformed value', () => {
      const currencyFormat = { decimalSymbol: '.', prefix: '$', suffix: '' }

      expect(conformToMask('1.', currencyFormat, '$1')).toEqual({ conformedValue: '$1' })
      expect(conformToMask('1..', currencyFormat, '$1')).toEqual({ conformedValue: '$1' })
      expect(conformToMask('1.a', currencyFormat, '$1')).toEqual({ conformedValue: '$1' })
    })
  })

  describe('when a invalid negative value is about to being entered', () => {
    it('returns the previous conformed value', () => {
      expect(conformToMask('-$a', { decimalSymbol: '.', prefix: '$', suffix: '' }, '$1')).toEqual({ conformedValue: '$1' })
      expect(conformToMask('-a $', { decimalSymbol: '.', prefix: '', suffix: ' $' }, '$1')).toEqual({ conformedValue: '$1' })
    })
  })

  describe('when the value is negative and the prefixed currency symbol is deleted', () => {
    it('returns an empty value', () => {
      expect(conformToMask('-', { decimalSymbol: '.', prefix: '$', suffix: '' }, '-$')).toEqual({ conformedValue: '' })
    })
  })

  describe('when the value is incomplete', () => {
    describe('the currency symbol is hidden', () => {
      it('returns the expected value', () => {
        const currencyFormat = {
          decimalSymbol: '.',
          thousandsSeparatorSymbol: ',',
          prefix: '',
          suffix: '',
          maxFractionDigits: 2
        }

        expect(conformToMask('-', currencyFormat)).toEqual({ conformedValue: '-' })
        expect(conformToMask('1.', currencyFormat)).toEqual({ conformedValue: '1.' })
        expect(conformToMask('1234.', currencyFormat)).toEqual({ conformedValue: '1234.' })
        expect(conformToMask('1,234.', currencyFormat)).toEqual({ conformedValue: '1,234.' })
        expect(conformToMask('-1.', currencyFormat)).toEqual({ conformedValue: '-1.' })
        expect(conformToMask('-1234.', currencyFormat)).toEqual({ conformedValue: '-1234.' })
        expect(conformToMask('-1,234.', currencyFormat)).toEqual({ conformedValue: '-1,234.' })
        expect(conformToMask('.', currencyFormat)).toEqual({ conformedValue: '0.' })
        expect(conformToMask('.1', currencyFormat)).toEqual({ conformedValue: '0.1' })
        expect(conformToMask('.1.234', currencyFormat)).toEqual({ conformedValue: '0.12' })
        expect(conformToMask('-.', currencyFormat)).toEqual({ conformedValue: '-0.' })
        expect(conformToMask('-.1', currencyFormat)).toEqual({ conformedValue: '-0.1' })
        expect(conformToMask('-.1.234', currencyFormat)).toEqual({ conformedValue: '-0.12' })
      })
    })

    describe('the currency symbol is prefixed', () => {
      it('returns the expected value', () => {
        const currencyFormat = {
          decimalSymbol: '.',
          thousandsSeparatorSymbol: ',',
          prefix: '$',
          suffix: '',
          maxFractionDigits: 2
        }

        expect(conformToMask('-', currencyFormat)).toEqual({ conformedValue: '-$' })
        expect(conformToMask('-', currencyFormat, '-$')).toEqual({ conformedValue: '' })
        expect(conformToMask('1.', currencyFormat)).toEqual({ conformedValue: '$1.' })
        expect(conformToMask('1234.', currencyFormat)).toEqual({ conformedValue: '$1234.' })
        expect(conformToMask('1,234.', currencyFormat)).toEqual({ conformedValue: '$1,234.' })
        expect(conformToMask('-1.', currencyFormat)).toEqual({ conformedValue: '-$1.' })
        expect(conformToMask('-1234.', currencyFormat)).toEqual({ conformedValue: '-$1234.' })
        expect(conformToMask('-1,234.', currencyFormat)).toEqual({ conformedValue: '-$1,234.' })
        expect(conformToMask('.', currencyFormat)).toEqual({ conformedValue: '$0.' })
        expect(conformToMask('.1', currencyFormat)).toEqual({ conformedValue: '$0.1' })
        expect(conformToMask('.1.234', currencyFormat)).toEqual({ conformedValue: '$0.12' })
        expect(conformToMask('-.', currencyFormat)).toEqual({ conformedValue: '-$0.' })
        expect(conformToMask('-.1', currencyFormat)).toEqual({ conformedValue: '-$0.1' })
        expect(conformToMask('-.1.234', currencyFormat)).toEqual({ conformedValue: '-$0.12' })
      })
    })

    describe('the currency symbol is suffixed', () => {
      it('returns the expected value', () => {
        const currencyFormat = {
          decimalSymbol: '.',
          thousandsSeparatorSymbol: ',',
          prefix: '',
          suffix: ' $',
          maxFractionDigits: 2
        }

        expect(conformToMask('-', currencyFormat)).toEqual({ conformedValue: '- $' })
        expect(conformToMask('1.', currencyFormat)).toEqual({ conformedValue: '1. $' })
        expect(conformToMask('1234.', currencyFormat)).toEqual({ conformedValue: '1234. $' })
        expect(conformToMask('1,234.', currencyFormat)).toEqual({ conformedValue: '1,234. $' })
        expect(conformToMask('-1.', currencyFormat)).toEqual({ conformedValue: '-1. $' })
        expect(conformToMask('-1234.', currencyFormat)).toEqual({ conformedValue: '-1234. $' })
        expect(conformToMask('-1,234.', currencyFormat)).toEqual({ conformedValue: '-1,234. $' })
        expect(conformToMask('.', currencyFormat)).toEqual({ conformedValue: '0. $' })
        expect(conformToMask('.1', currencyFormat)).toEqual({ conformedValue: '0.1 $' })
        expect(conformToMask('.1.234', currencyFormat)).toEqual({ conformedValue: '0.12 $' })
        expect(conformToMask('-.', currencyFormat)).toEqual({ conformedValue: '-0. $' })
        expect(conformToMask('-.1', currencyFormat)).toEqual({ conformedValue: '-0.1 $' })
        expect(conformToMask('-.1.234', currencyFormat)).toEqual({ conformedValue: '-0.12 $' })
      })
    })

    describe('no fraction digits are allowed', () => {
      it('returns the expected value', () => {
        const currencyFormat = {
          decimalSymbol: null,
          thousandsSeparatorSymbol: ',',
          prefix: '',
          suffix: '',
          maxFractionDigits: 0
        }

        expect(conformToMask('-', currencyFormat)).toEqual({ conformedValue: '-' })
        expect(conformToMask('1.', currencyFormat)).toEqual({ conformedValue: 1, numberOfFractionDigits: 0 })
        expect(conformToMask('1234.', currencyFormat)).toEqual({ conformedValue: 1234, numberOfFractionDigits: 0 })
        expect(conformToMask('1,234.', currencyFormat)).toEqual({ conformedValue: 1234, numberOfFractionDigits: 0 })
        expect(conformToMask('-1.', currencyFormat)).toEqual({ conformedValue: -1, numberOfFractionDigits: 0 })
        expect(conformToMask('-1234.', currencyFormat)).toEqual({ conformedValue: -1234, numberOfFractionDigits: 0 })
        expect(conformToMask('-1,234.', currencyFormat)).toEqual({ conformedValue: -1234, numberOfFractionDigits: 0 })
        expect(conformToMask('.', currencyFormat)).toEqual({ conformedValue: '' })
        expect(conformToMask('.1', currencyFormat)).toEqual({ conformedValue: 1, numberOfFractionDigits: 0 })
        expect(conformToMask('.1.234', currencyFormat)).toEqual({ conformedValue: 1234, numberOfFractionDigits: 0 })
        expect(conformToMask('-.', currencyFormat)).toEqual({ conformedValue: '' })
        expect(conformToMask('-.1', currencyFormat)).toEqual({ conformedValue: -1, numberOfFractionDigits: 0 })
        expect(conformToMask('-.1.234', currencyFormat)).toEqual({ conformedValue: -1234, numberOfFractionDigits: 0 })
      })
    })
  })

  describe('when value conforms to the mask', () => {
    it('returns the expected result', () => {
      const currencyFormat = { decimalSymbol: '.', prefix: '$', suffix: '', maxFractionDigits: 4 }

      expect(conformToMask('1', currencyFormat)).toEqual({ conformedValue: 1, numberOfFractionDigits: 0 })
      expect(conformToMask('1,2', currencyFormat)).toEqual({ conformedValue: 12, numberOfFractionDigits: 0 })
      expect(conformToMask('1.2', currencyFormat)).toEqual({ conformedValue: 1.2, numberOfFractionDigits: 1 })
      expect(conformToMask('1.232323', currencyFormat)).toEqual({ conformedValue: 1.2323, numberOfFractionDigits: 4 })
      expect(conformToMask(0, currencyFormat)).toEqual({ conformedValue: 0, numberOfFractionDigits: 0 })
      expect(conformToMask(-1, currencyFormat)).toEqual({ conformedValue: -1, numberOfFractionDigits: 0 })
      expect(conformToMask(1.2, currencyFormat)).toEqual({ conformedValue: 1.2, numberOfFractionDigits: 1 })
      expect(conformToMask(1.232323, currencyFormat)).toEqual({ conformedValue: 1.2323, numberOfFractionDigits: 4 })
      expect(conformToMask('0', currencyFormat)).toEqual({ conformedValue: 0, numberOfFractionDigits: 0 })
      expect(conformToMask('-0', currencyFormat)).toEqual({ conformedValue: -0, numberOfFractionDigits: 0 })
    })
  })
})
