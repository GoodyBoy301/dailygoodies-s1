import LongPage from "/classes/LongPage";
import gsap from "gsap";
import { transit } from "./animations";
import * as dat from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import fragmentShader from "./fragment.glsl?raw";
import vertexShader from "./vertex.glsl?raw";
import {
  Mesh,
  PlaneGeometry,
  ShaderMaterial,
  TextureLoader,
  sRGBEncoding,
  Vector2,
  DoubleSide,
} from "three";

export default class e01 extends LongPage {
  constructor() {
    super({
      element: ".home",
      id: "e01",
      elements: {
        galleries: ".gallery",
        infos: ".gallery__info",
        images: ".gallery__image",
        switches: ".gallery__nav__item",
      },
    });
  }

  /** Life Cycle */
  async create() {
    this.mousePosition = new Vector2(0, 0);
    this.mouseClip = new Vector2(0, 0);

    super.create();
    this.reCalculate({ scroll: {} });
    this.gui = new dat.GUI();

    await this.createTexture();
    this.createMaterial();
    this.createGeometry();
    this.createMesh();
    this.placeMesh();

    this.gui
      .add(this.material.uniforms.uTimeline, "value", 0.0, Math.PI * 0.1, 0.001)
      .name("timeline");
    this.controls = new OrbitControls(Canvas.camera, Canvas.canvas);
  }

  reCalculate() {
    super.reCalculate;
    this.isMobile = innerWidth < 768;
    this.mousePosition = { x: 0, y: 0 };
    this.image = this.elements.images[1];
    this.bounds = this.image.getBoundingClientRect();
    this.width = this.bounds.width / innerWidth;
    this.height = this.bounds.height / innerHeight;
    this.y =
      (innerHeight / 2 - this.bounds.top - this.bounds.height / 2) /
      innerHeight;
    this.x =
      -(innerWidth / 2 - this.bounds.left - this.bounds.width / 2) / innerWidth;
    this.initialx = -(innerWidth / 2 - this.bounds.left) / innerWidth;
    this.finalx =
      -(innerWidth / 2 - this.bounds.left) / innerWidth + this.width;

    if (!this.mesh) return;
    this.mesh.scale.x = this.width * Canvas.viewport.width;
    this.mesh.scale.y = this.height * Canvas.viewport.height;
    this.mesh.position.x = this.x * Canvas.viewport.width;
    this.mesh.position.y = this.y * Canvas.viewport.height;
  }
  update() {
    this.controls?.update();
    super.update();
    if (!this.material) return;
    this.material.uniforms.uMouse.value = this.mousePosition;
  }

  /** WebGL */
  createTexture() {
    Canvas.textures = [];
    let loaded = 0;
    return new Promise((resolve, reject) => {
      const textureLoader = new TextureLoader();
      this.elements.images.forEach((element, index) => {
        textureLoader.load(element.getAttribute("src"), (texture) => {
          const map = texture;
          map.encoding = sRGBEncoding;
          Canvas.textures[index] = texture;
          loaded++;
          if (loaded === 3) resolve();
        });
      });
    });
  }
  createGeometry() {
    this.geometry = new PlaneGeometry(1, 1, 128, 128);
  }
  createMaterial() {
    if (!Canvas.textures) return;
    this.material = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      side: DoubleSide,
      uniforms: {
        uTexture: { value: Canvas.textures[0] },
        uTimeline: { value: 0.0 },
        uMouse: {
          value: this.mousePosition,
        },
        uClip: {
          value: this.mouseClip,
        },
        uTime: { value: 0.5 },
      },
    });
  }
  createMesh() {
    this.mesh = new Mesh(this.geometry, this.material);
  }

  placeMesh() {
    if (!this.mesh) return;
    !this.isMobile && Canvas.scene.add(this.mesh);

    this.mesh.scale.x = this.width * Canvas.viewport.width;
    this.mesh.scale.y = this.height * Canvas.viewport.height;
    this.mesh.position.x = this.x * Canvas.viewport.width;
    this.mesh.position.y = this.y * Canvas.viewport.height;
    // this.mesh.rotation.y = Math.PI / 2;
  }

  onMouseMove({ clientX, clientY }) {
    this.mousePosition.x = clientX / this.bounds.width;
    this.mousePosition.y = clientY / this.bounds.height;
  }

  zPlace(x, y, z) {
    this.elements.galleries[0].style["z-index"] = x;
    this.elements.galleries[1].style["z-index"] = y;
    this.elements.galleries[2].style["z-index"] = z;
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

  addEventListeners() {
    super.addEventListeners();
    this.elements.images.forEach((image) => {
      image.onmouseenter = () => {
        gsap.to(this.material?.uniforms.uClip.value, { x: 0.15, y: 0.05 });
      };
    });

    this.elements.images.forEach((image) => {
      image.onmouseleave = () => {
        gsap.to(this.material?.uniforms.uClip.value, { x: 0, y: 0 });
      };
    });

    this.elements.images.forEach(
      (image) => (image.onmousemove = this.onMouseMove.bind(this))
    );

    this.elements.switches.forEach((element, index) => {
      if (index === 0 || index === 4 || index === 8) return;
      element.onclick = () => this.onSwitch.bind(this)(index);
    });
  }
}
