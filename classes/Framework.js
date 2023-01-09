import Preloader from "/components/Preloader";
import Canvas from "/components/Canvas";

export default class Framework {
  constructor() {
    this.reCalculate({ scroll: {} });
    this.createCanvas();
    // this.createPreloader();
    this.createContent();
    this.addEventListeners();
    if (!this.preloader) this.onPreloaded();
  }

  reCalculate() {
    this.isMobile = innerWidth < 768;
    this.canvas?.reCalculate({ scroll: {} });
  }

  createPreloader() {
    this.preloader = new Preloader();
    this.preloader.addEventListener("preloaded", this.onPreloaded.bind(this));
  }
  onPreloaded() {
    this.createPages();
    this.page.create();
  }

  createCanvas() {
    this.canvas = new Canvas();
  }

  createContent() {
    this.content =
      document.querySelector(".content") || document.querySelector("#app");
    this.template =
      this.content.getAttribute("data-template") ||
      this.content.getAttribute("data-page");
  }

  onResize() {
    this.reCalculate && this.reCalculate({ scroll: {} });
    this.page.reCalculate && this.page.reCalculate({ scroll: {} });
  }

  addEventListeners() {
    window.addEventListener("resize", this.onResize.bind(this));
  }
}
