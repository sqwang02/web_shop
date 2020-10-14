<template> 
  <product-detail :is-edit='true'></product-detail>
</template>
<script>
  import nextProductDetail from './components/nextProductDetail'
  export default {
    name: 'updateNextProduct',
    components: { nextProductDetail }
  }
</script>
<style>
</style>
