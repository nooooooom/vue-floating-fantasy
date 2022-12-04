# vue-floating-fantasy

vue-floating-fantasy is hooks and vue component library based on [Floating UI](https://floating-ui.com) implementation for Vue 2 & 3.

## Install

### Vue hooks positioning engine

Use with Vue Composition API ([view docs](https://vuejs.org/api/reactivity-core.html)).

```shell
npm i @vue-floating-fantasy/core
```

### Vue position components

🏗️ In construction...

## Quick start

```ts
import { useFloating, ReferenceType, FloatingType } from '@vue-floating-fantasy/core'

const referenceRef = ref<ReferenceType>()
const floatingRef = ref<FloatingType>()

const { 
  data,   // return value form computed position
  update, // force computed position
  stop    // stop watch options change
} = useFloating(referenceRef, floatingRef)

const floatingStyleRef = computed(() => {
  const floatingData = data.value
  return {
    position: floatingData.strategy,
    top: `${floatingData.y}px`,
    left: `${floatingData.x}px`
  }
})

onBeforeUnmount(stop)
```

`useFloating` is designed to recalculate the position only when any of the `referenceRef`, `floatingRef`, `optionsRef` changes, if you want it to update automatically when the DOM position changes, you can use ` useAutoUpdate`

```ts
import { useAutoUpdate } from '@vue-floating-fantasy/core'

const stopAutoUpdate = useAutoUpdate(referenceRef, floatingRef, update)

onBeforeUnmount(stopAutoUpdate)

```

## License

MIT
