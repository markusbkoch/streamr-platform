// @flow

import React, { useCallback, useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { replace } from 'connected-react-router'

import useProduct from '$mp/containers/ProductController/useProduct'
import useModal from '$shared/hooks/useModal'
import { selectUserData } from '$shared/modules/user/selectors'
import { addFreeProduct } from '$mp/modules/purchase/actions'

import ProductDetails from '$mp/components/ProductPage/ProductDetails'
import HeroComponent from '$mp/components/Hero'
import { isDataUnionProduct, isPaidProduct } from '$mp/utils/product'
import {
    selectSubscriptionIsValid,
    selectContractSubscription,
} from '$mp/modules/product/selectors'
import { ImageTile } from '$shared/components/Tile'
import { isAddressWhitelisted } from '$mp/modules/contractProduct/services'
import useWeb3Status from '$shared/hooks/useWeb3Status'

import routes from '$routes'

import styles from './hero.pcss'

const Hero = () => {
    const dispatch = useDispatch()
    const product = useProduct()
    const { api: purchaseDialog } = useModal('purchase')
    const { api: requestAccessDialog } = useModal('requestWhitelistAccess')

    const userData = useSelector(selectUserData)
    const isLoggedIn = userData !== null
    const isDataUnion = !!(product && isDataUnionProduct(product))
    const isProductSubscriptionValid = useSelector(selectSubscriptionIsValid)
    const subscription = useSelector(selectContractSubscription)
    const { account } = useWeb3Status()
    const [isWhitelisted, setIsWhitelisted] = useState(null)

    const productId = product.id
    const productContact = product.contact
    const isPaid = isPaidProduct(product)
    const isWhitelistEnabled = product.requiresWhitelist

    const onPurchase = useCallback(async () => {
        if (isLoggedIn) {
            if (isPaid) {
                if (isWhitelistEnabled && !isWhitelisted) {
                    await requestAccessDialog.open({
                        contactAddress: productContact,
                    })
                    return
                }
                // Paid product has to be bought with Metamask
                await purchaseDialog.open({
                    productId,
                })
            } else {
                // Free product can be bought directly
                dispatch(addFreeProduct(productId || ''))
            }
        } else {
            dispatch(replace(routes.auth.login({
                redirect: routes.marketplace.product({
                    id: productId,
                }),
            })))
        }
    }, [productId, dispatch, isLoggedIn, purchaseDialog, isPaid, isWhitelistEnabled, isWhitelisted, requestAccessDialog, productContact])

    useEffect(() => {
        const loadWhitelistStatus = async () => {
            if (isWhitelistEnabled && productId && account) {
                const whitelisted = await isAddressWhitelisted(productId, account)
                setIsWhitelisted(whitelisted)
            }
        }

        loadWhitelistStatus()
    }, [productId, account, isWhitelistEnabled])

    return (
        <HeroComponent
            className={styles.hero}
            product={product}
            leftContent={
                <ImageTile
                    alt={product.name}
                    src={product.imageUrl}
                    showDataUnionBadge={isDataUnion}
                />
            }
            rightContent={
                <ProductDetails
                    product={product}
                    isValidSubscription={!!isProductSubscriptionValid}
                    productSubscription={subscription}
                    onPurchase={onPurchase}
                    isWhitelisted={isWhitelisted}
                />
            }
        />
    )
}

export default Hero
