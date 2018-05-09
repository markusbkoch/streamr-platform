// @flow

import { createSelector } from 'reselect'
import BN from 'bignumber.js'

import type { UserState, StoreState } from '../../flowtype/store-state'
import type { User, ApiKey } from '../../flowtype/user-types'
import type { ErrorInUi } from '../../flowtype/common-types'
import type { Web3AccountList } from '../../flowtype/web3-types'

import { selectAccountId } from '../web3/selectors'
import { selectProduct } from '../product/selectors'

const selectUserState = (state: StoreState): UserState => state.user

export const selectFetchingApiKey: (StoreState) => boolean = createSelector(
    selectUserState,
    (subState: UserState): boolean => (subState.fetchingApiKey !== null ? !!subState.fetchingApiKey : true),
)

export const selectApiKey: ((state: StoreState) => ?ApiKey) = createSelector(
    selectUserState,
    (subState: UserState): ?ApiKey => subState.apiKey,
)

export const selectUserData: ((state: StoreState) => ?User) = createSelector(
    selectUserState,
    (subState: UserState): ?User => subState.user,
)

export const selectApiKeyError: (StoreState) => ?ErrorInUi = createSelector(
    selectUserState,
    (subState: UserState): ?ErrorInUi => subState.apiKeyError,
)

export const selectFetchingWeb3Accounts: (StoreState) => boolean = createSelector(
    selectUserState,
    (subState: UserState): boolean => subState.fetchingWeb3Accounts,
)

export const selectWeb3Accounts: (StoreState) => ?Web3AccountList = createSelector(
    selectUserState,
    (subState: UserState): ?Web3AccountList => subState.web3Accounts,
)

export const selectWeb3AccountsError: (StoreState) => ?ErrorInUi = createSelector(
    selectUserState,
    (subState: UserState): ?ErrorInUi => subState.web3AccountsError,
)

export const selectProductSharePermission = (state: StoreState): boolean => state.user.productPermissions.share

export const selectProductEditPermission = (state: StoreState): boolean => state.user.productPermissions.write

export const selectProductPublishPermission = createSelector([
    selectProduct,
    selectAccountId,
    selectProductSharePermission,
], (product, ownerAddress, canShare): boolean => {
    const isProductFree = (!!product && (product.isFree === false || BN(product.pricePerSecond).isEqualTo(0)))
    if (isProductFree) {
        return canShare
    }
    return canShare && !!(
        product &&
        product.ownerAddress &&
        product.ownerAddress === ownerAddress
    )
})

export const selectFetchingExternalLogin: (StoreState) => boolean = createSelector(
    selectUserState,
    (subState: UserState): boolean => subState.fetchingExternalLogin,
)