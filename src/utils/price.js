// @flow

import BN from 'bignumber.js'

import type { TimeUnit, Currency, NumberString } from '../flowtype/common-types'

import { timeUnits, currencies } from './constants'
import { toSeconds, getAbbreviation } from './time'

export const priceForTimeUnits = (pricePerSecond: NumberString | BN, timeAmount: number, timeUnit: TimeUnit): BN => {
    const seconds = toSeconds(timeAmount, timeUnit)
    return BN(pricePerSecond).multipliedBy(seconds)
}

export const pricePerSecondFromTimeUnit = (pricePerTimeUnit: BN, timeUnit: TimeUnit): BN => (
    BN(pricePerTimeUnit)
        .dividedBy(toSeconds(1, timeUnit))
)

/**
 * Convert DATA to USD.
 * @param data Number of DATA to convert.
 * @param dataPerUsd Number of DATA units per 1 USD.
 */
export const dataToUsd = (data: BN, dataPerUsd: BN): BN => BN(data).dividedBy(dataPerUsd)

/**
 * Convert USD to DATA.
 * @param usd Number of USD to convert.
 * @param dataPerUsd Number of DATA units per 1 USD.
 */
export const usdToData = (usd: BN, dataPerUsd: BN): BN => BN(usd).multipliedBy(dataPerUsd)

/**
 * Convert amount between fromCurrency and toCurrency.
 * @param amount Amount of units to convert.
 * @param dataPerUsd Number of DATA units per 1 USD.
 * @param fromCurrency Input currency.
 * @param toCurrency Output currency.
 */
export const convert = (amount: BN, dataPerUsd: BN, fromCurrency: Currency, toCurrency: Currency): BN => {
    if (fromCurrency === toCurrency) {
        return amount
    }
    const calc = fromCurrency === currencies.DATA ? dataToUsd : usdToData
    return calc(amount, dataPerUsd)
}

/**
 * Make sure the amount is a non-negative number.
 * @param amount Number to sanitize.
 */
export const sanitize = (amount: BN): BN => (BN(amount).isNaN() ? BN(0) : BN.max(BN(0), amount))

/**
 * Limit the number of fraction digits.
 * @param value Amount to limit.
 * @param maxDigits Max. number of fraction digits.
 */
export const formatAmount = (value: BN, maxDigits: ?number): BN => {
    if (typeof maxDigits === 'number' && maxDigits >= 0) {
        return BN(sanitize(value).decimalPlaces(maxDigits))
    }
    return value
}

export const arePricesEqual = (first: NumberString, second: NumberString) => BN(first).isEqualTo(second)

/**
 * Gets most relevant time unit for given price per second.
 * @param pricePerSecond Price per second.
 */
export const getMostRelevantTimeUnit = (pricePerSecond: BN): TimeUnit => {
    // Go from smallest time unit to the largest and see when we get a value bigger than 1.
    // This should be the most relevant unit for the user.
    const guesses = Object
        .keys(timeUnits)
        .filter((unit) => toSeconds(1, unit).multipliedBy(pricePerSecond).isGreaterThanOrEqualTo(1))

    return guesses[0] || timeUnits.second
}

/**
 * Formats given price to a human readable string
 * @param pricePerSecond Price per second.
 * @param currency Currency.
 * @param maxDigits Max. number of fraction digits. If omitted, no rounding will be applied.
 * @param timeUnit TimeUnit to use. If omitted, the most relevant time unit is calculated.
 */
export const formatPrice = (pricePerSecond: BN, currency: Currency, maxDigits?: number, timeUnit?: TimeUnit): string => {
    const actualTimeUnit = timeUnit || getMostRelevantTimeUnit(pricePerSecond)
    const price = priceForTimeUnits(pricePerSecond, 1, actualTimeUnit)
    const timeUnitAbbreviation = getAbbreviation(actualTimeUnit)
    const roundedPrice = maxDigits !== undefined ? formatAmount(price, maxDigits) : price
    return `${roundedPrice} ${currency} / ${timeUnitAbbreviation}`
}