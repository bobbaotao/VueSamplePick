<template>
  <el-menu v-bind:default-active="activeIndex" class="el-menu-demo" mode="horizontal"
            v-bind:router="false" v-on:select="handleSelect">
    <el-menu-item index="Home" >Random pick Report</el-menu-item>
    <el-menu-item index="TED" >Travel Expense Report</el-menu-item>
  </el-menu>
</template>

<script>
  export default {
    name: "TopNav",
    data () {
      return {
      }
    },
    props: ['activeIndex'],
    methods: {
      handleSelect(key, keyPath) {
       switch (key) {
         case "Home":
           this.$router.push({name: 'TravelExpenseList'});
           break;
         case "TED":
          this.$router.push({name: 'TEReport'});
           break
         default:
           break;
       }
     }
    }
  }
</script>

<style scoped="scoped">
</style>
