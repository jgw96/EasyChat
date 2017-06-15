<template>
  <div id="app">
    <header>
      <span>EasyChat</span>
    </header>
    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
body {
  margin: 0;
  font-family: sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

header {
  background: #03A9F4;
  color: white;
  height: 56px;
  line-height: 56px;
  padding-left: 15px;
  font-size: 1.4rem;
  font-weight: 500;
}
</style>
