<script setup lang="ts">

import { computed, ref, watchEffect } from 'vue'
import {setGlobalTheme} from '@/theme/themeStyleProvider'

defineProps<{ msg: string }>()

// 测试 pinia 、 持久化
import { useTestStore } from '@/store/modules/test'
const countStore = useTestStore()
const count = computed(()=>{
  return countStore.getTest
})
const increment = () =>{
  countStore.increment()
}


const globalTheme = ref(false)

watchEffect(() => {
  setGlobalTheme(globalTheme.value ? 'dark' : 'light')
})



</script>

<template>

<var-radio
  v-model="globalTheme"
>

<template #unchecked-icon>
    <var-icon name="heart-half-full" size="24px"/>
  </template>
  <template #checked-icon>
    <var-icon name="heart" size="24px"/>
  </template>

</var-radio>
<var-space :size="[10, 10]">
    <var-button>默认按钮</var-button>
    <var-button type="primary">主要按钮</var-button>
    <var-button type="info">信息按钮</var-button>
    <var-button type="success">成功按钮</var-button>
    <var-button type="warning">警告按钮</var-button>
    <var-button type="danger">危险按钮</var-button>
</var-space>


  <div class="text-on-primary bg-primary text-md">hello</div>
  <div class="text-on-primary-container bg-primary-container text-lg">world</div>
  <div class="bg-primary sm:bg-info md:bg-warning lg:bg-danger xl:bg-success">varlet</div>

  <h1>{{ msg }}</h1>

  <div class="card">
    <button type="button" @click="increment">count is {{ count }}</button>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
  </div>

  <p>
    Check out
    <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank"
      >create-vue</a
    >, the official Vue + Vite starter
  </p>
  <p>
    Install
    <a href="https://github.com/johnsoncodehk/volar" target="_blank">Volar</a>
    in your IDE for a better DX
  </p>
  <p class="read-the-docs">Click on the Vite and Vue logos to learn more</p>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
