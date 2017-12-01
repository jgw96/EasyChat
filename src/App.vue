<template>
  <div id="app">
    <ion-app>
    <ion-header>
      <ion-toolbar color='dark'>
        <ion-title>IonChat</ion-title>

        <router-link to="/rooms">
          <ion-icon id="people" name='people'></ion-icon>
        </router-link>
      </ion-toolbar>
    </ion-header>
    
    <router-view></router-view>

    </ion-app>
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

#app {
  height: 100%;
}

#people {
  fill: white;
  position: absolute;
  font-size: 2.5em;
  right: 15px;
  top: 15px;
}
</style>
