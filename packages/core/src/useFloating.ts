import { computePosition, ComputePositionConfig, ComputePositionReturn } from '@floating-ui/dom'
import { ComputedRef, ref, unref } from 'vue-demi'
import { createManualEffect, MaybeRef, useEffect, useTransformState } from 'vue-reactivity-fantasy'

import { FloatingType, Nullable, ReferenceType, UseFloatingData } from './types'
import { deepEqual } from './utils/deepEqual'

export interface UseFloatingOptions extends Omit<Partial<ComputePositionConfig>, 'platform'> {
  /**
   * @default false
   */
  disabled?: boolean
}

const defaultOptions = {
  strategy: 'absolute',
  placement: 'bottom'
} as const

export interface UseFloatingReturn {
  data: ComputedRef<UseFloatingData>
  update: () => void
  stop: () => void
}

/**
 * Uue hooks based on `computePosition`.
 * @see https://floating-ui.com/docs/computePosition
 */
export function useFloating(
  reference: MaybeRef<ReferenceType | Nullable>,
  floating: MaybeRef<FloatingType | Nullable>,
  userOptions: MaybeRef<UseFloatingOptions> = {}
): UseFloatingReturn {
  const optionsRef = useTransformState(userOptions, (userOptions) => {
    return {
      ...defaultOptions,
      ...userOptions,
      middleware: userOptions.middleware && [...userOptions.middleware] // for patch
    }
  })

  const computePositionReturnRef = ref<ComputePositionReturn>()

  const floatingDataRef = useTransformState(
    computePositionReturnRef,
    (computedPositionReturn) => {
      const { value: options } = optionsRef
      return {
        // Setting these to `null` will allow the consumer to determine if
        // `computePosition()` has run yet
        x: null,
        y: null,
        middlewareData: {},
        strategy: options.strategy,
        placement: options.placement,
        ...computedPositionReturn
      }
    },
    false
  )

  const update = () => {
    const referenceEl = unref(reference)
    const floatingEl = unref(floating)
    if (referenceEl && floatingEl) {
      computePosition(referenceEl, floatingEl, optionsRef.value).then((returnData) => {
        if (!deepEqual(computePositionReturnRef.value, returnData)) {
          computePositionReturnRef.value = returnData
        }
      })
    }
  }

  const updateEffectControl = createManualEffect(() => {
    return useEffect(
      () => {
        update()
      },
      [() => unref(reference), () => unref(floating)],
      {
        immediate: true
      }
    )
  })

  const cleanupOptionsEffect = useEffect(
    (_, options, lastOptions) => {
      if (deepEqual(options, lastOptions)) {
        return
      }

      if (!options.disabled) {
        updateEffectControl.reset()
      } else {
        updateEffectControl.clear()
      }
    },
    optionsRef,
    {
      immediate: true,
      deep: true
    }
  )

  return {
    data: floatingDataRef,
    update,
    stop: () => {
      cleanupOptionsEffect()
      updateEffectControl.clear()
    }
  }
}
