// @flow

import React from 'react'
import classNames from 'classnames'
import { Row, Col } from '@streamr/streamr-layout'

import TimeUnitSelector from '../TimeUnitSelector'
import AmountEditor from '../AmountEditor'
import { currencies } from '../../../../utils/constants'
import type { Currency, TimeUnit } from '../../../../flowtype/common-types'
import FixedPriceSelector from './FixedPriceSelector'

import styles from './paymentRateEditor.pcss'

export type PaymentRateChange = {
    amount?: ?number,
    timeUnit?: TimeUnit,
}

type Props = {
    amount: ?number,
    dataPerUsd: number,
    timeUnit: TimeUnit,
    priceCurrency: Currency,
    className?: string,
    onPricePerSecondChange: (number) => void,
    onPriceUnitChange: (TimeUnit) => void,
    onPriceCurrencyChange: (Currency) => void,
}

const PaymentRateEditor = ({
    className,
    timeUnit,
    amount,
    dataPerUsd,
    priceCurrency,
    onPricePerSecondChange,
    onPriceCurrencyChange,
    onPriceUnitChange,
}: Props) => (
    <div className={classNames(styles.editor, className)}>
        <Row>
            <Col xs={5}>
                <AmountEditor
                    amount={amount}
                    dataPerUsd={dataPerUsd}
                    currency={priceCurrency}
                    onChange={onPricePerSecondChange}
                />
                <FixedPriceSelector
                    onValue={currencies.USD}
                    offValue={currencies.DATA}
                    value={priceCurrency}
                    onChange={onPriceCurrencyChange}
                />
            </Col>
            <Col xs={2}>Per</Col>
            <Col xs={5}>
                <TimeUnitSelector
                    selected={timeUnit}
                    onChange={onPriceUnitChange}
                />
            </Col>
        </Row>
    </div>
)

export default PaymentRateEditor
