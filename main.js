import "/styles/index.scss";

import e01 from "/pages/e01";
import e02 from "/pages/e02";
// import e03 from "/pages/e03";
import e04 from "/pages/e04";
import Framework from "/classes/Framework";

class App extends Framework {
  constructor() {
    super();
    requestAnimationFrame(this.update.bind(this));
  }

  createPages() {
    this.pages = {
      e01: new e01(),
      e02: new e02(),
      // e03: new e03(),
      e04: new e04(),
    };
    this.page = this.pages[this.template];
    document.body.style.display = "";
  }

  update() {
    this.page?.update && this.page.update();
    this.canvas?.update();
    requestAnimationFrame(this.update.bind(this));
  }
}

new App();
