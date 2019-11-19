// @flow

import type { ErrorInUi, PayloadAction } from '$shared/flowtype/common-types'
import type { CommunityId } from '$mp/flowtype/product-types'

export type CommunityIdAction = PayloadAction<{
    id: CommunityId,
}>
export type CommunityIdActionCreator = (CommunityId) => CommunityIdAction

export type CommunityIdsAction = PayloadAction<{
    ids: Array<CommunityId>,
}>
export type CommunityIdsActionCreator = (Array<CommunityId>) => CommunityIdsAction

export type CommunityErrorAction = PayloadAction<{
    id: CommunityId,
    error: ErrorInUi
}>
export type CommunityErrorActionCreator = (id: CommunityId, error: ErrorInUi) => CommunityErrorAction

export type CommunityStatsErrorAction = PayloadAction<{
    error: ErrorInUi
}>
export type CommunityStatsErrorActionCreator = (error: ErrorInUi) => CommunityStatsErrorAction
