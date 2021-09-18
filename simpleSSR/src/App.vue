<template>
  <h1>Hello world</h1>
  <h2>
    <span>{{sum}}</span>
    <button @click="num1++">num1++</button>
    <hello-world></hello-world>
  </h2>
</template>

<script>
import {ref,computed} from 'vue'
import HelloWorld from './components/HelloWorld.vue'
export default {
  setup(){
    const num1 = ref(1)
    const num2 = ref(2)
    const sum = computed(()=> num1.value + num2.value)
    console.log(sum, '1111111')
    return {num1,num2,sum}
  },
  components: {
    HelloWorld
  }
}
</script>