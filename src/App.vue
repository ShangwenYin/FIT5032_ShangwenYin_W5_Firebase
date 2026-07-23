<script setup>
import JSONLab from './components/JSONLab.vue'
import BHeader from './components/BHeader.vue'
</script>

<template>
  <header>
    <BHeader />
  </header>

  <main>
    <!-- <JSONLab /> -->
    <router-view></router-view>
  </main>
</template>

<style>
.container {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  max-width: 80vw;
  margin: 0 auto;
  padding: 20px;
  border-radius: 10px;
}
</style>
