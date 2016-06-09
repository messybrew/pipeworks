import JSRocket from './services/jsRocket';
import {AUDIO_PATH, ROW_RATE} from './constants'
import TrackSynchronizer from './synchronizer/trackSynchronizer';
import { Pipe, Camera, Cog } from './scene/controlledEntities';
import Renderer from './render/renderer';
import audio from "./static/testsong.mp3";

class Demo {

  constructor() {
    this.playing = false;
    this.audio = new Audio();
    const syncDevice = new JSRocket.SyncDevice();
    syncDevice.on('play', () => this.play());
    syncDevice.on('pause', () => this.pause());
    syncDevice.on('update', (time) => this.setTime(time));
    syncDevice.on('ready', () => this.init());
    this.trackSynchronizer = new TrackSynchronizer(syncDevice);
    // Test entities, move to actual scene when implemented
    const controlledEntities = [
      new Pipe('p1', this.trackSynchronizer),
      new Pipe('p2', this.trackSynchronizer),
      new Camera('cam', this.trackSynchronizer),
      new Cog('cog', this.trackSynchronizer),
    ];

    this.renderer = new Renderer();

    syncDevice.init();
  }

  init() {
    console.log("Demo init");
    this.trackSynchronizer.init();
    this.prepareAudio();
  }

  prepareAudio() {
    console.log("prepare audio");
    this.audio.src = audio;
    this.audio.load();
    this.audio.preload = true;
    this.audio.addEventListener('canplay', () => {this.onAudioReady()});
  }

  onAudioReady(){
    console.log("on audio ready");
  }

  update(time) {
    this.trackSynchronizer.setTime(time);
  }

  render(context) {
    console.log(context);
    this.renderer.render({}, context);
  }

  togglePlay() {
    this.playing = !this.playing;
  }

  play() {
    this.playing = true;
    this.audio.play();
    console.log("Play");
  }

  pause() {
    this.playing = false;
    this.audio.pause();
    console.log("Pause");
  }

  setTime(time) {
    console.log("Setting time");
    this.audio.currentTime = time / ROW_RATE;
    this.trackSynchronizer.setTime(time);
  }
}

export default new Demo();
