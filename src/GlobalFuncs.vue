<template>

</template>


<script>

import Vue from 'vue'


Vue.prototype.$getIPAddress = async function() {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.log("error???")
    console.error(error);
  }
}
/* 
Vue.mixin({
  methods: {
    async getIP() {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            return data.ip;
        } catch (error) {
            console.error(error);
        }
    }
  }
}); */



</script>

<style>
</style>