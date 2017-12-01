
<template>
  <div class="rooms">

    <ion-list>
      <ion-item v-for="room in rooms">
        <ion-label>
          <h2>Room: {{room}}</h2>

          <ion-buttons>
            <ion-button clear color="primary">Start a Call</ion-button>
          </ion-buttons>
        </ion-label>
      </ion-item>
    </ion-list>

  </div>
</template>

<script>
export default {
  name: "rooms",
  data() {
    return {
      rooms: null
    };
  },
  created: function() {
    if (localStorage.getItem('rooms') !== undefined) {
      this.rooms = JSON.parse(localStorage.getItem('rooms'));
      console.log(this.rooms);
    }
  },
  methods: {
    
  }
};
</script>

<style>
 .rooms {
   margin-top: 4em;
 }

  ion-buttons {
    display: flex;
    justify-content: flex-end;
  }
</style>
