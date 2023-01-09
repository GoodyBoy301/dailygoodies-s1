import LongPage from "/classes/LongPage";
import gsap from "gsap";
import { clamp, lerp, pixelToRem } from "/utils/math";
import Reveal from "/classes/Reveal";
import SplitType from "split-type";

import fragmentShader from "./fragment.glsl?raw";
import vertexShader from "./vertex.glsl?raw";
import {
  Mesh,
  PlaneGeometry,
  ShaderMaterial,
  TextureLoader,
  sRGBEncoding,
  Vector2,
} from "three";

export default class e01 extends LongPage {
  constructor() {
    super({
      element: ".home",
      id: "e01",
      elements: {
        wrapper: "#app",
        images: ".gallery__image",
      },
    });
  }

  /** Life Cycle */
  create() {
    this.mousePosition = new Vector2(0, 0);

    super.create();
    // this.reCalculate({ scroll: {} });
    // this.placeMesh();
    // // new SplitType(".home__work__title");
    // new Reveal({
    //   elements: {},
    //   threshold: this.isMobile ? 1 : 0.2,
    // });
  }
  // reCalculate() {
  //   super.reCalculate;
  //   this.isMobile = innerWidth < 768;
  //   this.mousePosition = { x: 0, y: 0 };
  //   this.image = this.elements.images[0];
  //   this.bounds = this.image.getBoundingClientRect();
  //   this.width = this.bounds.width / innerWidth;
  //   this.height = this.bounds.height / innerHeight;
  //   this.y =
  //     (innerHeight / 2 - this.bounds.top - this.bounds.height / 2) /
  //     innerHeight;
  //   this.x =
  //     -(innerWidth / 2 - this.bounds.left - this.bounds.width / 2) / innerWidth;
  //   this.initialx = -(innerWidth / 2 - this.bounds.left) / innerWidth;
  //   this.finalx =
  //     -(innerWidth / 2 - this.bounds.left) / innerWidth + this.width;

  //   if (!this.mesh) return;
  //   this.mesh.scale.x = this.width * Canvas.viewport.width;
  //   this.mesh.scale.y = this.height * Canvas.viewport.height;
  //   this.mesh.position.x = this.x * Canvas.viewport.width;
  //   this.mesh.position.y = this.y * Canvas.viewport.height;
  // }
  // update() {
  //   super.update();
  //   if (!this.material) return;
  //   this.material.uniforms.uTime.value = Canvas.time.elapsed;
  //   this.material.uniforms.uMouse.value = this.mousePosition;
  // }

  // /** WebGL */
  // createTexture() {
  //   Canvas.textures = [];
  //   return new Promise((resolve, reject) => {
  //     const textureLoader = new TextureLoader();
  //     preloadables.textures["e01"].forEach((src, index) => {
  //       textureLoader.load(src, (texture) => {
  //         const map = texture;
  //         // map.flipY = false;
  //         map.encoding = sRGBEncoding;
  //         Canvas.textures[index] = texture;
  //         this.createWebGL();
  //         if (Canvas.textures.length === 3) {
  //           resolve();
  //         }
  //       });
  //     });
  //   });
  // }
  // createGeometry() {
  //   this.geometry = new PlaneGeometry(1, 1, 32, 32);
  // }
  // createMaterial() {
  //   if (!Canvas.textures) return;
  //   const texture0 = Canvas.textures[0];
  //   const texture1 = Canvas.textures[1];
  //   const texture2 = Canvas.textures[2];
  //   this.material = new ShaderMaterial({
  //     vertexShader,
  //     fragmentShader,
  //     transparent: true,
  //     uniforms: {
  //       uTexture: { value: texture1 },
  //       // uTexture: { value: texture0 },
  //       uTexture2: { value: texture1 },
  //       uTime: { value: 0 },
  //       uOpacity: { value: 1 },
  //       uShade: { value: 1 },
  //       uMouse: {
  //         value: this.mousePosition,
  //       },
  //     },
  //   });
  // }
  // createMesh() {
  //   this.mesh = new Mesh(this.geometry, this.material);
  // }

  // placeMesh() {
  //   if (!this.mesh) return;
  //   // !this.isMobile && Canvas.scene.add(this.mesh);
  //   console.log(this.mesh);

  //   this.mesh.scale.y = this.height * Canvas.viewport.height;
  //   this.mesh.position.y = this.y * Canvas.viewport.height;

  //   this.predestroy();
  // }

  // onMouseMove({ clientX, clientY }) {
  //   this.mousePosition.x = clientX / this.bounds.width;
  //   this.mousePosition.y = clientY / this.bounds.height;
  // }

  // addEventListeners() {
  //   super.addEventListeners();
  //   this.elements.images.forEach(
  //     (image) => (image.onmousemove = this.onMouseMove.bind(this))
  //   );
  // }
}
