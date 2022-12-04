import { Ref } from 'vue-demi'
import type { ComputePositionReturn, VirtualElement } from '@floating-ui/dom'

export type MaybeRef<T> = T | Ref<T>

export type Nullable = null | undefined

export type ReferenceType = Element | VirtualElement

export type FloatingType = HTMLElement

export type UseFloatingData = Omit<ComputePositionReturn, 'x' | 'y'> & {
  x: number | null
  y: number | null
}
