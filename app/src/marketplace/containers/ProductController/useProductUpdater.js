import { useMemo, useContext } from 'react'

import useOnlyIfMountedCallback from '$shared/hooks/useOnlyIfMountedCallback'
import { Context as UndoContext } from '$shared/components/UndoContextProvider'

function productUpdater(fn) {
    return (product) => {
        const nextProduct = fn(product)
        if (nextProduct === null || nextProduct === product) { return product }
        return {
            ...nextProduct,
        }
    }
}

export default function useProductUpdater() {
    const { push, reset } = useContext(UndoContext)

    const updateProduct = useOnlyIfMountedCallback((action, fn, done) => {
        push(action, productUpdater(fn), done)
    }, [push, productUpdater])

    const replaceProduct = useOnlyIfMountedCallback((fn, done) => {
        reset(productUpdater(fn), done)
    }, [push, productUpdater])

    return useMemo(() => ({
        updateProduct,
        replaceProduct,
    }), [updateProduct, replaceProduct])
}
