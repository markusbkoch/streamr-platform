import React from 'react'
import { MemoryRouter, Switch } from 'react-router-dom'
import { mount } from 'enzyme'

import UserpagesRouter from '$mp/../app/Userpages'

/* eslint-disable react/prop-types */
jest.mock('$userpages/components/DashboardPage/List', () => ({
    __esModule: true,
    default: () => (
        <div>Dashboard list</div>
    ),
}))
jest.mock('$userpages/components/CanvasPage/List', () => ({
    __esModule: true,
    default: () => (
        <div>Canvas list</div>
    ),
}))
jest.mock('$userpages/components/StreamPage/Show', () => ({
    __esModule: true,
    default: ({ match }) => (
        <div>Stream {match.params.id} page</div>
    ),
}))
jest.mock('$userpages/components/StreamPage/List', () => ({
    __esModule: true,
    default: () => (
        <div>Stream list</div>
    ),
}))
jest.mock('$userpages/components/StreamLivePreview', () => ({
    __esModule: true,
    default: ({ match }) => (
        <div>Stream {match.params.id} preview</div>
    ),
}))
jest.mock('$userpages/components/TransactionPage/List', () => ({
    __esModule: true,
    default: () => (
        <div>Transaction list</div>
    ),
}))
jest.mock('$userpages/components/ProfilePage', () => ({
    __esModule: true,
    default: () => (
        <div>Profile page</div>
    ),
}))
jest.mock('$userpages/components/PurchasesPage', () => ({
    __esModule: true,
    default: () => (
        <div>Purchases page</div>
    ),
}))
jest.mock('$userpages/components/ProductsPage', () => ({
    __esModule: true,
    default: () => (
        <div>Products page</div>
    ),
}))
jest.mock('$userpages/components/ProductsPage/Stats', () => ({
    __esModule: true,
    default: ({ match }) => (
        <div>Product {match.params.id} stats</div>
    ),
}))
jest.mock('$userpages/components/ProductsPage/Members', () => ({
    __esModule: true,
    default: ({ match }) => (
        <div>Product {match.params.id} members</div>
    ),
}))
jest.mock('$mp/containers/EditProductPage', () => ({
    __esModule: true,
    default: ({ match }) => (
        <div>Product {match.params.id} editor</div>
    ),
}))
jest.mock('$mp/components/ErrorPageView', () => ({
    __esModule: true,
    default: () => (
        <div>Error page</div>
    ),
}))
jest.mock('$auth/utils/userAuthenticated', () => ({
    __esModule: true,
    userIsAuthenticated: (component) => component,
}))
/* eslint-enable react/prop-types */

describe('Userpages Routes', () => {
    let oldCommunityProductsFlag

    beforeEach(() => {
        oldCommunityProductsFlag = process.env.COMMUNITY_PRODUCTS
    })

    afterEach(() => {
        process.env.COMMUNITY_PRODUCTS = oldCommunityProductsFlag
    })

    describe('With community product (COMMUNITY_PRODUCTS=on)', () => {
        it('shows product editor', () => {
            process.env.COMMUNITY_PRODUCTS = 'on'
            const el = mount((
                <MemoryRouter
                    initialEntries={['/core/products/123/edit']}
                >
                    <Switch>
                        {UserpagesRouter()}
                    </Switch>
                </MemoryRouter>
            ))

            expect(el.text()).toBe('Product 123 editor')
        })

        it('shows the data union stats page', () => {
            process.env.COMMUNITY_PRODUCTS = 'on'
            const el = mount((
                <MemoryRouter
                    initialEntries={['/core/products/123/stats']}
                >
                    <Switch>
                        {UserpagesRouter()}
                    </Switch>
                </MemoryRouter>
            ))

            expect(el.text()).toBe('Product 123 stats')
        })

        it('shows the data union members page', () => {
            process.env.COMMUNITY_PRODUCTS = 'on'
            const el = mount((
                <MemoryRouter
                    initialEntries={['/core/products/123/members']}
                >
                    <Switch>
                        {UserpagesRouter()}
                    </Switch>
                </MemoryRouter>
            ))

            expect(el.text()).toBe('Product 123 members')
        })
    })

    describe('With community product (COMMUNITY_PRODUCTS="")', () => {
        it('does not show the product editor', () => {
            process.env.COMMUNITY_PRODUCTS = ''
            const el = mount((
                <MemoryRouter
                    initialEntries={['/core/products/123/edit']}
                >
                    <Switch>
                        {UserpagesRouter()}
                    </Switch>
                </MemoryRouter>
            ))

            expect(el.text()).toBe('Stream list')
        })

        it('shows the data union stats page', () => {
            process.env.COMMUNITY_PRODUCTS = ''
            const el = mount((
                <MemoryRouter
                    initialEntries={['/core/products/123/stats']}
                >
                    <Switch>
                        {UserpagesRouter()}
                    </Switch>
                </MemoryRouter>
            ))

            expect(el.text()).toBe('Stream list')
        })

        it('shows the data union members page', () => {
            process.env.COMMUNITY_PRODUCTS = ''
            const el = mount((
                <MemoryRouter
                    initialEntries={['/core/products/123/members']}
                >
                    <Switch>
                        {UserpagesRouter()}
                    </Switch>
                </MemoryRouter>
            ))

            expect(el.text()).toBe('Stream list')
        })
    })
})
