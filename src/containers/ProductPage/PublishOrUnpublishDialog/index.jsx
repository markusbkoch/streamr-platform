// @flow

import React from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import type { ProductId, Product, ProductState, SmartContractProduct } from '../../../flowtype/product-types'
import { initPublish } from '../../../modules/publishDialog/actions'
import { getProductFromContract } from '../../../modules/contractProduct/actions'
import { productStates } from '../../../utils/constants'
import UnpublishDialog from '../UnpublishDialog'
import PublishDialog from '../PublishDialog'
import { formatPath } from '../../../utils/url'
import links from '../../../links'
import withContractProduct from '../../WithContractProduct'

type StateProps = {
}

type DispatchProps = {
    getProductFromContract: (ProductId) => void,
    initPublish: (ProductId) => void,
    redirectBackToProduct: () => void,
}

export type OwnProps = {
    productId: ProductId,
    product: Product,
    contractProduct: ?SmartContractProduct,
}

type Props = StateProps & DispatchProps & OwnProps

type State = {
    startingState: ?ProductState,
}

class PublishOrUnpublishDialog extends React.Component<Props, State> {
    state = {
        startingState: null,
    }

    componentWillMount() {
        const { product, contractProduct, productId, initPublish: initPublishProp } = this.props

        initPublishProp(productId)

        if (product) {
            // Store the initial state of deployment because it will change in the completion phase
            if (!this.state.startingState) {
                this.setState({
                    startingState: contractProduct ? contractProduct.state : product.state,
                })
            }
        }
    }

    componentWillReceiveProps(nextProps: Props) {
        const { product, contractProduct, redirectBackToProduct } = nextProps

        if (product) {
            // Store the initial state of deployment because it will change in the completion phase
            if (!this.state.startingState || contractProduct) {
                this.setState({
                    startingState: contractProduct ? contractProduct.state : product.state,
                })
            }

            // if product is being deployed or undeployed, redirect to product page
            if (product.state !== productStates.DEPLOYED && product.state !== productStates.NOT_DEPLOYED) {
                redirectBackToProduct()
            }
        }
    }

    render() {
        const { product } = this.props

        if (product) {
            return (this.state.startingState === productStates.DEPLOYED) ?
                <UnpublishDialog {...this.props} /> :
                <PublishDialog {...this.props} />
        }

        return null
    }
}

const mapStateToProps = (): StateProps => ({})

const mapDispatchToProps = (dispatch: Function, ownProps: OwnProps): DispatchProps => ({
    getProductFromContract: (id: ProductId) => dispatch(getProductFromContract(id)),
    initPublish: (id: ProductId) => dispatch(initPublish(id)),
    redirectBackToProduct: () => dispatch(push(formatPath(links.products, ownProps.productId))),
})

export default connect(mapStateToProps, mapDispatchToProps)(withContractProduct(PublishOrUnpublishDialog))