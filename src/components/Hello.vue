<template>
  <div class="hello">
    <video autoplay ref="localVideo" class="local"></video>
    
    <video v-if="chooseRoom" autoplay ref="remotesVideos" class="remote"></video>
  
    <transition name="fadeIn" enter-active-class="animated fadeIn">
      <div class="muteBlock" v-if="chooseRoom && !muted">
        <button class="muteButton" v-on:click="mute">
          Mute
        </button>
      </div>
    </transition>
  
    <transition name="fadeIn" enter-active-class="animated fadeIn">
      <div class="muteBlock" v-if="muted">
        <button class="muteButton" v-on:click="unmute">
          unmute
        </button>
      </div>
    </transition>
  
    <transition appear name="slideIn" enter-active-class="animated slideInLeft" leave-active-class="animated fadeOut">
      <div v-if="!chooseRoom" class="inputBlock">
        <input type="text" placeholder="Room name" v-model="roomName"></input>
      </div>
    </transition>
  
    <transition appear name="slideIn" enter-active-class="animated slideInLeft" leave-active-class="animated fadeOut">
      <div class="buttonBlock" v-if="!chooseRoom">
        <button class="callButton" v-on:click="startCall">
          Start Call
        </button>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'hello',
  data() {
    return {
      webrtc: null,
      chooseRoom: false,
      roomName: null,
      muted: false
    }
  },
  mounted: function () {
    this.webrtc = new SimpleWebRTC({
      // the id/element dom element that will hold "our" video
      localVideoEl: this.$refs.localVideo,
      // the id/element dom element that will hold remote videos
      remoteVideosEl: '',
      // immediately ask for camera access
      autoRequestMedia: true
    });
  },
  methods: {
    startCall: function () {
      console.log(this.roomName);
      this.chooseRoom = true;

      requestIdleCallback(() => {
        this.webrtc.joinRoom(this.roomName);

        const waitingToast = this.$toasted.show('Waiting...');

        this.webrtc.on('videoAdded', (video, peer) => {
          waitingToast.goAway();
          console.log('video added', peer);
          this.$refs.remotesVideos.srcObject = peer.stream;

          this.connectionHandler(peer);

          setTimeout(() => {
            this.$toasted.show('Connected...', { duration: 1500 });
          }, 700);
        });
      });

      this.listeners();
    },
    listeners: function () {
      this.webrtc.on('iceFailed', () => {
        this.$toasted.show('Local connection failure...', { duration: 1500 });
      });

      this.webrtc.on('connectivityError', () => {
        this.$toasted.show('Remote connection failure...', { duration: 1500 });
      });
    },
    connectionHandler: function (peer) {
      peer.pc.on('iceConnectionStateChange', (event) => {
        switch (peer.pc.iceConnectionState) {
          case 'disconnected':
            this.$toasted.show('Disconnected...', { duration: 1500 });
            this.chooseRoom = false;
            break;
          case 'closed':
            this.$toasted.show('Disconnected...', { duration: 1500 });
            this.chooseRoom = false;
            break;
        }
      })
    },
    mute: function () {
      this.webrtc.mute();
      this.muted = true;
    },
    unmute: function () {
      this.webrtc.unmute();
      this.muted = false;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.local {
  position: fixed;
  height: 120px;
  position: fixed;
  bottom: 0;
  right: 0;
}

.remote {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  object-fit: cover;
  height: 100%;
  z-index: -99;
}

.callButton {
  border: none;
  color: white;
  background: #03A9F4;
  text-transform: uppercase;
  font-weight: bolder;
  flex: 0.8;
  font-size: 1.4rem;
  padding: 10px;
  border-radius: 5px;
}

.buttonBlock {
  display: flex;
  margin-top: 4rem;
  justify-content: center;
  will-change: opacity;
}

.inputBlock {
  margin-top: 40px;
  display: flex;
  justify-content: center;
}

input[type="text"] {
  display: block;
  margin: 0;
  width: 100%;
  font-family: sans-serif;
  font-size: 18px;
  appearance: none;
  box-shadow: none;
  border-radius: none;
  flex: 0.8;
  padding: 10px;
  border: none;
  border-bottom: solid 2px #c9c9c9;
  transition: border 0.3s;
}

input[type="text"]:focus {
  outline: none;
  border-bottom: solid 2px #03A9F4;
}

.muteButton {
  color: white;
  text-transform: uppercase;
  background: #03A9F4;
  border: none;
  font-weight: bolder;
  font-size: 1.2rem;
  margin-top: 10px;
  margin-left: 10px;
  height: 2.5rem;
  width: 8rem;
  position: fixed;
  bottom: 10px;
}
</style>
