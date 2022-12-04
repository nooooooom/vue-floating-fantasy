import { autoUpdate, AutoUpdateOptions } from '@floating-ui/dom'
import { computed, unref } from 'vue-demi'
import { createManualEffect, useEffect } from 'vue-reactivity-fantasy'

import { FloatingType, MaybeRef, Nullable, ReferenceType } from './types'

export interface UseAutoUpdateOptions extends Partial<AutoUpdateOptions> {
  /**
   * @default false
   */
  disabled?: boolean
}

/**
 * Automatically updates the position of the floating element when necessary.
 * @see https://floating-ui.com/docs/autoUpdate
 */
export function useAutoUpdate(
  reference: MaybeRef<ReferenceType | Nullable>,
  floating: MaybeRef<FloatingType | Nullable>,
  update: () => void,
  options: MaybeRef<UseAutoUpdateOptions> = {}
) {
  const optionsRef = computed(() => unref(options))

  // Only when options.disabled is not `true`,
  // we will listen to the update of reference and floating and create autoUpdate.
  const autoUpdateEffectControl = createManualEffect(() => {
    return useEffect(
      (onCleanup, [reference, floating]) => {
        if (reference && floating) {
          const stopAutoUpdate = autoUpdate(reference, floating, update, optionsRef.value)
          // cleanup effect
          onCleanup(stopAutoUpdate)
        }
      },
      [() => unref(reference), () => unref(floating)],
      {
        immediate: true
      }
    )
  })

  const cleanupOptionsEffect = useEffect(
    (_, options) => {
      if (!options.disabled) {
        autoUpdateEffectControl.reset()
      } else {
        autoUpdateEffectControl.clear()
      }
    },
    optionsRef,
    {
      immediate: true,
      deep: true
    }
  )

  return () => {
    cleanupOptionsEffect()
    autoUpdateEffectControl.clear()
  }
}
