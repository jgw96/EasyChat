<template>
  <div class="hello">

    <video ref="localVideo" class="remote"></video>
    
    <video v-if="chooseRoom" ref="remotesVideos" class="remote"></video>
  
      <div class="muteBlock" v-if="chooseRoom && !muted">
        <ion-button color='primary' clear class="muteButton" v-on:click="mute">
          Mute
        </ion-button>
      </div>

      <ion-button color='danger' class="disconnectButton" v-on:click="disconnect" v-if="chooseRoom">
        Disconnect
      </ion-button>
  
      <div class="muteBlock" v-if="muted">
        <ion-button color='danger' clear class="muteButton" v-on:click="unmute">
          unmute
        </ion-button>
      </div>
      
      <section id='first-block' v-if="!chooseRoom">
      <div class="inputBlock">
        <input ref='roomInput' type="text" placeholder="Room name" v-model="roomName"></input>
        <ion-icon id="share" name='share' v-on:click="share"></ion-icon>
      </div>
  
      <div class="buttonBlock">
        <ion-button color='dark' class="callButton" v-on:click="startCall">
          Start Call
        </ion-button>
      </div>
      </section>

  </div>
</template>

<script>
export default {
  name: "hello",
  data() {
    return {
      webrtc: null,
      chooseRoom: false,
      roomName: null,
      muted: false,
      waitingToast: null
    };
  },
  mounted: function() {
    this.webrtc = new SimpleWebRTC({
      // the id/element dom element that will hold "our" video
      localVideoEl: this.$refs.localVideo,
      // the id/element dom element that will hold remote videos
      remoteVideosEl: "",
      // immediately ask for camera access
      autoRequestMedia: true
    });
  },
  methods: {
    startCall: function() {
      this.chooseRoom = true;

      this.doCall();

      this.listeners();
    },
    doCall: function() {
      this.webrtc.joinRoom(this.roomName);
      this.store(this.roomName);
      console.log(this.roomName);

      this.$refs.localVideo.classList.remove("remote");
      this.$refs.localVideo.classList.add("local");

      this.waitingToast = this.$toasted.show("Waiting...");

      this.webrtc.on("videoAdded", (video, peer) => {
        this.waitingToast.goAway();
        console.log("video added", peer);
        this.$refs.remotesVideos.srcObject = peer.stream;

        this.connectionHandler(peer);

        setTimeout(() => {
          this.$toasted.show("Connected...", { duration: 1500 });
        }, 700);
      });
    },
    listeners: function() {
      this.webrtc.on("iceFailed", () => {
        this.$toasted.show("Local connection failure...", { duration: 1500 });
      });

      this.webrtc.on("connectivityError", () => {
        this.$toasted.show("Remote connection failure...", { duration: 1500 });
      });
    },
    connectionHandler: function(peer) {
      peer.pc.on("iceConnectionStateChange", event => {
        switch (peer.pc.iceConnectionState) {
          case "disconnected":
          case "closed":
            console.log("disconnected");
            this.$toasted.show("Disconnected...", { duration: 1500 });
            this.chooseRoom = false;

            this.$refs.localVideo.classList.remove("local");
            this.$refs.localVideo.classList.add("remote");
            break;
        }
      });
    },
    mute: function() {
      this.webrtc.mute();
      this.muted = true;
    },
    unmute: function() {
      this.webrtc.unmute();
      this.muted = false;
    },
    disconnect: function() {
      this.webrtc.disconnect();
      this.waitingToast.goAway();

      this.chooseRoom = false;
    },
    share: function(e) {
      if (navigator.share) {
        navigator
          .share({
            title: "Video Chat",
            text: `You have been invited to a chat. Join ${this.roomName}`,
            url: window.location.href
          })
          .then(() => console.log("Successful share"))
          .catch(error => console.log("Error sharing", error));
      } else {
        this.$refs.roomInput.select();
      }
    },
    store: function(room) {
      if (!localStorage.getItem('rooms')) {
        localStorage.setItem('rooms', JSON.stringify([room]));
      } else {
        const rooms = JSON.parse(localStorage.getItem('rooms'));
        rooms.push(room);
        localStorage.setItem('rooms', JSON.stringify(rooms));
      }
    }
  }
};
</script>

<style>
#share {
  font-size: 2.5em;
  position: absolute;
  right: 20px;
  top: 28px;
}

#first-block {
  padding: 2em;
  background: white;
  box-shadow: 0px -8px 16px rgba(0, 0, 0, 0.1), 0px -3px 6px rgba(0, 0, 0, 0.08);
  position: absolute;
  bottom: 0px;
  width: 100%;
}

.local {
  position: fixed;
  height: 120px;
  position: fixed;
  bottom: 0;
  right: 0;
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
  border-bottom: solid 2px #03a9f4;
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

.buttonBlock {
  display: flex;
  margin-top: 4rem;
  justify-content: center;
  will-change: opacity;
}

.inputBlock {
  display: flex;
  justify-content: center;
}

.callButton > button {
  width: 20em;
}

.muteButton {
  position: fixed;
  bottom: 10px;
}

.disconnectButton {
  position: fixed;
  top: 74px;
  left: 15px;
}
</style>
