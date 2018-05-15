<template>
  <transition name="fade">
    <router-view></router-view>
  </transition>
</template>

<script>
    // With shell.openExternal(url) is how
    // external urls must be handled, not href
    //const shell = require('electron').shell    
    export default {
       data(){
           return {}
       },
       mounted(){
           this.appShow()
       },
       methods:{
            appShow(){
           }
       }
    }
</script>

<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s
}
.fade-enter, .fade-leave-active {
  opacity: 0
}
</style>