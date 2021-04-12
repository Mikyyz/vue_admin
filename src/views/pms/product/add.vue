<template>
    <product-detail :is-edit='false'/>
</template>

<script>
import ProductDetail from './components/ProductDetail'
    export default {
        name: 'addProduct',
        components: {
            ProductDetail
        }
    }
</script>

<style lang="less" scoped>

</style>