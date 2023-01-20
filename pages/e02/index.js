import * as dat from "dat.gui";
import gsap from "gsap";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { transit } from "./animations";
import audiourl from "./sway-sped-up-version.mp3?url";
import LongPage from "/classes/LongPage";

import { clamp, lerp, map } from "/utils/math";

export default class e02 extends LongPage {
  constructor() {
    super({
      element: ".home",
      id: "e01",
      elements: {
        button: ".unstarted",
        bar: ".bar",
        volumeControl: "section",
        icons: "svg",
      },
    });
  }

  /** Life Cycle */
  async create() {
    this.createAudio();
    this.mousePosition = {
      target: 0,
      current: 0,
      previous: 0,
      previousClamp: 0,
    };

    super.create();
  }
  createAudio() {
    const audio = new Audio(audiourl);
    audio.setAttribute("muted", true);
    this.audio = audio;
    audio.volume = 1;
    audio.loop = true;
  }

  reCalculate() {
    this.bounds = this.elements.volumeControl.getBoundingClientRect();
    super.reCalculate;
  }

  update() {
    this.mousePosition.current = lerp(
      this.mousePosition.current,
      this.mousePosition.target,
      0.3
    );
    if (!this.isDown) return;
    const target = this.mousePosition.target;
    const width =
      map(target, 0, 1, -0.175, 1.175) < 0.004
        ? 0
        : target > 0.98
        ? 100
        : clamp(4, 100, this.mousePosition.current * 100);
    this.audio.volume = Math.abs(target / 100);
    this.elements.bar.style.width = `${width}%`;

    this.mousePosition.clamp = Math.round(this.mousePosition.target * 4);

    if (this.mousePosition.clamp !== this.mousePosition.previousClamp) {
      this.elements.icons.forEach((icon, index) => {
        if (index === this.mousePosition.clamp) {
          icon.style.opacity = 1;
        } else {
          icon.style.opacity = 0;
        }
      });
    }
    this.mousePosition.previousClamp = this.mousePosition.clamp;
  }

  onMouseMove(event) {
    const clientX = event.clientX || event.touches[0]?.clientY;
    if (event.touches) {
      this.mousePosition.target =
        (clientX - this.bounds.top) / this.bounds.height;
    } else {
      this.mousePosition.target =
        (clientX - this.bounds.left) / this.bounds.width;
    }
    if (this.isDown) {
      this.elements.volumeControl.style.cursor = "ew-resize";
    }
  }

  onMouseDown(event) {
    this.isDown = true;
  }

  onMouseUp() {
    this.isDown = false;
    this.elements.volumeControl.style.cursor = "pointer";
  }

  onSwitch(index) {
    if (index === 3) {
      transit.bind(this)(0, false);
      this.zPlace(2, 1, 0);
    } else if (index === 6) {
      transit.bind(this)(0, false);
      this.zPlace(2, 0, 1);
    } else if (index === 1) {
      transit.bind(this)(1, true);
      this.zPlace(1, 2, 0);
    } else if (index === 7) {
      transit.bind(this)(1, false);
      this.zPlace(0, 2, 1);
    } else if (index === 2) {
      transit.bind(this)(2, true);
      this.zPlace(1, 0, 2);
    } else if (index === 5) {
      transit.bind(this)(2, true);
      this.zPlace(0, 1, 2);
    }
  }

  start() {
    this.elements.button.onclick = () => {};
    this.audio.play();
    this.elements.button.className = "";
    this.reCalculate();
  }

  addEventListeners() {
    this.elements.button.onclick = this.start.bind(this);
    this.elements.volumeControl.onmousedown = this.onMouseDown.bind(this);
    this.elements.volumeControl.ontouchstart = this.onMouseDown.bind(this);
    this.elements.volumeControl.onmouseup = this.onMouseUp.bind(this);
    this.elements.volumeControl.ontouchend = this.onMouseUp.bind(this);
    this.elements.volumeControl.onmouseleave = this.onMouseUp.bind(this);
    this.elements.volumeControl.onmousemove = this.onMouseMove.bind(this);
    this.elements.volumeControl.ontouchmove = this.onMouseMove.bind(this);
  }
}
