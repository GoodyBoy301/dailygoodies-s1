import LongPage from "/classes/LongPage";
import gsap from "gsap";
import { transit } from "./animations";
import * as dat from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import fontFile from "./playfair display_regular.json?url";

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
  MeshBasicMaterial,
  Group,
} from "three";
import Image from "../../classes/Image";

export default class e04 extends LongPage {
  constructor() {
    super({
      element: ".home",
      id: "e01",
      elements: {
        models: "[data-fixed] .models__item",
        images: "[data-fixed] .model__image",
      },
    });
  }

  /** Life Cycle */
  async create() {
    this.mousePosition = new Vector2(0, 0);
    this.mouseClip = new Vector2(0, 0);

    super.create();
    this.createGeometry();
    this.createMesh();
    this.createGallery();
    this.placeMesh();

    this.reCalculate({ scroll: {} });
    this.gui = new dat.GUI();

    this.rotateImages();
    this.controls = new OrbitControls(Canvas.camera, Canvas.canvas);

    // this.gui
    //   .add(this.geometry, "curveSegments", 0.0, 32, 0.1)
    //   .name("curveSegments");
  }

  reCalculate() {
    this.gallery?.forEach((gallery) => gallery.reCalculate());
  }
  update() {
    this.controls?.update();
    super.update();
    if (!this.material) return;
    this.material.uniforms.uMouse.value = this.mousePosition;
  }

  rotateImages() {
    this.elements.images.forEach((element) => {
      element.style.transform = `rotateZ(${element.attributes["data-rotation"].value}deg)`;
    });
  }

  createGallery() {
    this.gallery = [];
    this.elements.images.forEach((image) => {
      this.gallery.push(
        new Image(this.geometry, image, this.mesh, vertexShader, fragmentShader)
      );
    });
  }

  /** WebGL */
  createFont() {
    return new Promise((resolve, reject) => {
      const fontLoader = new FontLoader();
      fontLoader.load(fontFile, (font) => {
        this.font = font;
        resolve();
      });
    });
  }

  createGeometry() {
    this.geometry = new PlaneGeometry(1, 1, 128, 128);
  }
  createMesh() {
    // this.mesh = new Mesh(this.geometry, this.material);
    this.mesh = new Group();
  }

  placeMesh() {
    if (!this.mesh) return;

    this.gallery?.forEach((gallery) => gallery.placeMesh());

    !this.isMobile && Canvas.scene.add(this.mesh);
  }

  addEventListeners() {
    super.addEventListeners();
    this.elements.models.forEach((model, index) => {
      model.onmouseenter = () => {
        this.gallery[index].animation?.play();
        this.elements.models[index].style.opacity = "1";
      };
      model.onmouseleave = () => {
        this.gallery[index].animation?.reverse();
        this.elements.models[index].style.opacity = "0";
      };
    });

    this.elements.models.forEach((model) => {
      // model.onmouseleave = () => console.log(1);
    });
  }
}
