let trackList = {
  "1":{
    name: "Plume",
    url: "caravan_palace_plume.mp3"
  },
  "2":{
    name: "Moonshine",
    url: "caravan_palace_moonshine.mp3"
  },
  "3":{
    name: "Melancolia",
    url: "caravan_palace_melancolia.mp3"
  },
}

export default class Audio {
  constructor() {
    this.audioNode = document.querySelector("#audio");
    this.source = this.audioNode.querySelector("source");
    this.tracks = Object.values(trackList);
    this.started = false;
    this.audioNode.onended = () => {
      console.log("Song has ended")
      this.nextTrack();
    };
    this.tracksetEvent = new Event("trackset");
  }
  start() {
    if (!this.started) {
      this.setTrack(0);
      this.started = true;
      console.log("audio started");
    }
  }
  setTrack(id) {
    if (id < 0) { 
      id = this.tracks.length - 1;
    } else if (id > this.tracks.length - 1) {
      id = 0;
    }
    this.currentTrackIndex = id;
    this.source.src = this.getCurrentTrack().url;
    this.audioNode.load();
    this.audioNode.play();
    this.audioNode.dispatchEvent(this.tracksetEvent);

    console.log("track setted " + this.currentTrackIndex);
  }
  getCurrentTrack() {
    return this.tracks[this.currentTrackIndex];
  }
  nextTrack() {
    this.setTrack(this.currentTrackIndex + 1);
  }
  previousTrack() {
    this.setTrack(this.currentTrackIndex - 1);
  }
}
