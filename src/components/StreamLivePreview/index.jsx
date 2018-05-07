// @flow

import React, { Component } from 'react'
import StreamrClient from 'streamr-client'
import { Table } from '@streamr/streamr-layout'
import moment from 'moment-timezone'
import stringifyObject from 'stringify-object'
import { throttle } from 'lodash'
import { formatDateTime } from '../../utils/time'
import type { StreamId } from '../../flowtype/stream-types'
import type { ApiKey, User } from '../../flowtype/user-types'

import styles from './streamLivePreview.pcss'

export type DataPoint = {
    data: any,
    metadata: {
        offset: number,
        timestamp: number,
        streamId: StreamId,
    }
}

type Props = {
    streamId: ?StreamId,
    currentUser: ?User,
    apiKey: ?ApiKey,
    selectedDataPoint: ?DataPoint,
    onSelectDataPoint: (DataPoint) => void,
}

type State = {
    visibleData: Array<DataPoint>,
    visibleDataLimit: number,
}

let cachedClient: ?StreamrClient

export class StreamLivePreview extends Component<Props, State> {
    state = {
        visibleData: [],
        visibleDataLimit: 8,
    }

    componentDidMount() {
        if (this.props.apiKey) {
            this.client = this.createClient(this.props.apiKey)
        }
        if (this.client && this.props.streamId) {
            this.subscribe(this.props.streamId)
        }
    }

    componentWillUnmount = () => {
        this.unsubscribe()
    }

    onData = (dataPoint: DataPoint) => {
        this.data.unshift(dataPoint)
        this.data.length = Math.min(this.data.length, this.state.visibleDataLimit)
        this.updateDataToState(this.data)
    }

    dataColumn: ?HTMLTableCellElement = null

    createClient = (apiKey: ?ApiKey): ?StreamrClient => {
        if (apiKey && (!cachedClient || cachedClient.options.apiKey !== apiKey.id)) {
            cachedClient = new StreamrClient({
                url: process.env.STREAMR_WS_URL,
                apiKey: apiKey.id,
                autoconnect: true,
                autoDisconnect: false,
            })
        } else if (!apiKey) {
            return null
        }
        return cachedClient
    }

    subscribe = (streamId: ?StreamId) => {
        if (!streamId) {
            return
        }
        if (this.subscription) {
            this.unsubscribe()
        }
        this.subscription = this.client.subscribe({
            stream: streamId,
            resend_last: this.state.visibleDataLimit,
        }, (data, metadata) => this.onData({
            data,
            metadata,
        }))
    }

    unsubscribe = () => this.client.unsubscribe(this.subscription)

    prettyPrintData = (data: ?{}, compact: boolean = false) => stringifyObject(data, {
        indent: '  ',
        inlineCharacterLimit: compact ? Infinity : 5,
    })

    subscription: any
    data: Array<{}> = []
    client: StreamrClient

    updateDataToState = throttle((data) => {
        this.setState({
            visibleData: [...data],
        })
        if (!this.props.selectedDataPoint && data.length) {
            this.props.onSelectDataPoint(data[0])
        }
    }, 100)

    clearData = () => {
        this.data = []
        this.setState({
            visibleData: [],
        })
    }

    render() {
        const tz = (this.props.currentUser && this.props.currentUser.timezone) || moment.tz.guess()
        return (
            <div className={styles.streamLivePreview}>
                <Table className={styles.dataTable}>
                    <thead>
                        <tr>
                            <th className={styles.timestampColumn}>
                                Timestamp
                            </th>
                            <th
                                ref={(th) => {
                                    this.dataColumn = th
                                }}
                            >
                                Data
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.visibleData.map((d) => (
                            <tr key={d.metadata.offset} onClick={() => this.props.onSelectDataPoint(d)}>
                                <td className={styles.timestampColumn}>
                                    {formatDateTime(d.metadata && d.metadata.timestamp, tz)}
                                </td>
                                <td className={styles.messageColumn}>
                                    <div
                                        className={styles.messagePreview}
                                        style={{
                                            maxWidth: this.dataColumn && this.dataColumn.offsetWidth - 100,
                                        }}
                                    >
                                        {this.prettyPrintData(d.data, true)}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        )
    }
}

export default StreamLivePreview