// @flow

import { productStates } from '../utils/constants'

import type { CategoryId } from './category-types'
import type { StreamIdList, StreamId } from './stream-types'
import type { Currency, NumberString, TimeUnit } from './common-types'
import type { Address } from './web3-types'

export type ProductId = string
export type ProductState = $Keys<typeof productStates>

export type Product = {
    key?: string,
    id: ?ProductId,
    name: string,
    description: string,
    owner: string,
    imageUrl: ?string,
    thumbnailUrl: ?string,
    state?: ProductState,
    created?: Date,
    updated?: Date,
    category: ?CategoryId,
    streams: StreamIdList,
    previewStream: ?StreamId,
    previewConfigJson?: ?string,
    minimumSubscriptionInSeconds?: number,
    ownerAddress: Address,
    beneficiaryAddress: Address,
    pricePerSecond: NumberString,
    priceCurrency: Currency,
    timeUnit?: ?TimeUnit,
    isFree?: boolean,
}

export type EditProduct = {
    id: ProductId,
    name: string,
    description: string,
    imageUrl?: string,
    category: CategoryId,
    streams: StreamIdList,
    previewStream: StreamId,
    previewConfigJson: string,
    state?: ProductState,
    beneficiaryAddress: Address,
    pricePerSecond: NumberString,
    priceCurrency: Currency,
    minimumSubscriptionInSeconds?: number,
    isFree?: boolean,
}

export type SmartContractProduct = {
    id: ProductId,
    name: $ElementType<Product, 'name'>,
    ownerAddress: $ElementType<Product, 'ownerAddress'>,
    beneficiaryAddress: $ElementType<Product, 'beneficiaryAddress'>,
    pricePerSecond: $ElementType<Product, 'pricePerSecond'>,
    priceCurrency: $ElementType<Product, 'priceCurrency'>,
    minimumSubscriptionInSeconds: $ElementType<Product, 'minimumSubscriptionInSeconds'>,
    state: $ElementType<Product, 'state'>,
}

export type Subscription = {
    productId: ProductId,
    endTimestamp: number
}

export type ProductIdList = Array<ProductId>

export type ProductList = Array<Product>

export type ProductEntities = {
    [ProductId]: Product,
}

export type SmartContractProductEntities = {
    [ProductId]: SmartContractProduct,
}

export type SearchFilter = string

export type CategoryFilter = CategoryId

export type SortByFilter = string

export type MaxPriceFilter = NumberString

export type AnyFilter = SearchFilter | CategoryFilter | SortByFilter

export type Filter = {
    search: ?SearchFilter,
    categories: ?CategoryFilter,
    sortBy: ?SortByFilter,
    maxPrice: ?MaxPriceFilter,
}
