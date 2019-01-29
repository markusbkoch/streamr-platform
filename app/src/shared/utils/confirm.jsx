// @flow

import React from 'react'
import { render, unmountComponentAtNode } from 'react-dom'

import ConfirmDialog, { type Properties } from '$shared/components/ConfirmDialog'

const removeElementReconfirm = () => {
    const target = document.getElementById('shared-confirm-alert')

    if (target) {
        unmountComponentAtNode(target)

        if (target.parentNode) {
            target.parentNode.removeChild(target)
        }
    }
}

const confirmDialog = (props: Properties): Promise<boolean> => new Promise((resolve: Function) => {
    const divTarget = document.createElement('div')
    divTarget.id = 'shared-confirm-alert'

    if (document.body) {
        document.body.appendChild(divTarget)

        render(<ConfirmDialog
            onAccept={() => {
                removeElementReconfirm()
                resolve(true)
            }}
            onReject={() => {
                removeElementReconfirm()
                resolve(false)
            }}
            {...props}
        />, divTarget)
    }
})

export default confirmDialog
