import "/styles/index.scss";

import e01 from "/pages/e01";
import e02 from "/pages/e02";
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
    };
    this.page = this.pages[this.template];
  }

  update() {
    this.page?.update && this.page.update();
    this.canvas?.update();
    requestAnimationFrame(this.update.bind(this));
  }
}

new App();
