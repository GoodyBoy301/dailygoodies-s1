import gsap from "gsap";
import {
  DoubleSide,
  Mesh,
  ShaderMaterial,
  sRGBEncoding,
  TextureLoader,
  Vector4,
} from "three";

export default class Image {
  constructor(geometry, image, scene, vertexShader, fragmentShader) {
    this.geometry = geometry;
    this.image = image;
    this.scene = scene;
    this.vertexShader = vertexShader;
    this.fragmentShader = fragmentShader;
    this.clip = new Vector4(0, 0, 0, 0);
  }

  reCalculate() {
    this.isMobile = innerWidth < 768;
    this.image = this.image;
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

  createTexture() {
    return new Promise((resolve, reject) => {
      const textureLoader = new TextureLoader();
      textureLoader.load(this.image.getAttribute("src"), (texture) => {
        const map = texture;
        map.encoding = sRGBEncoding;
        this.texture = map;
        resolve();
      });
    });
  }

  async createMaterial() {
    await this.createTexture();
    this.material = new ShaderMaterial({
      vertexShader: this.vertexShader,
      fragmentShader: this.fragmentShader,
      transparent: true,
      side: DoubleSide,
      uniforms: {
        uTexture: { value: this.texture },
        uTimeline: { value: 0.0 },
        uOpacity: { value: 0.0 },
        uTime: { value: 0.5 },
        uClip: { value: this.clip },
      },
    });
    this.createAnimation();
  }

  createMesh() {
    if (this.mesh) return;
    this.mesh = new Mesh(this.geometry, this.material);
  }

  async placeMesh() {
    await this.createMaterial();
    this.createMesh();
    !this.isMobile && this.scene.add(this.mesh);

    this.mesh.scale.x = this.width * Canvas.viewport.width;
    this.mesh.scale.y = this.height * Canvas.viewport.height;
    this.mesh.position.x = this.x * Canvas.viewport.width;
    this.mesh.position.y = this.y * Canvas.viewport.height;
    this.mesh.rotation.z =
      Math.PI * (this.image.attributes["data-rotation"].value / -180);
  }

  createAnimation() {
    this.enterAnimation = gsap
      .timeline({ paused: true })
      .fromTo(
        this.material.uniforms.uClip.value,
        {
          x: 0,
          y: 0,
          z: -0.25,
          w: -0.25,
          duration: 0.1,
          delay: -0.2,
        },
        {
          x: -0.5,
          y: 0.5,
          z: -0.5,
          w: 0.5,
          duration: 0.3,
          delay: 0.1,
        }
      )
      .fromTo(
        this.material.uniforms.uTimeline,
        {
          value: 0,
          duration: 0.1,
        },
        {
          value: Math.PI * 0.025,
          duration: 0.5,
          delay: 0.5,
        }
      );

    this.leaveAnimation = gsap
      .timeline({ paused: true })
      .to(this.material.uniforms.uClip.value, {
        x: 0,
        y: 0,
        z: -0.25,
        w: -0.25,
        duration: 0.02,
      });

    this.fadeIn = () => {
      this.scene.add(this.mesh);
      gsap.to(this.material.uniforms.uOpacity, {
        value: 1,
        duration: 0.02,
      });
    };
    this.fadeOut = () => {
      this.scene.remove(this.mesh);
      gsap.set(this.material.uniforms.uOpacity, {
        value: 0,
      });
    };
  }
}
