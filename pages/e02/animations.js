import gsap from "gsap";

export function transit(index, fromDown = true) {
  gsap.fromTo(
    this.elements.galleries[index],
    {
      y: fromDown ? "100vh" : "-100vh",
    },
    {
      y: 0,
    }
  );
  gsap.fromTo(
    this.elements.infos[index],
    {
      opacity: 0.5,
    },
    {
      opacity: 1,
    }
  );
  gsap.to(this.elements.infos[Math.floor(index / 3)], { opacity: 0 });
  gsap.set(this.elements.infos[Math.floor(index / 3)], {
    opacity: 1,
    delay: 0.5,
  });
  this.material.uniforms.uTexture.value = Canvas.textures[index % 3];
}
