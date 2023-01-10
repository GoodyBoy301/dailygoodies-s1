precision highp float;

uniform sampler2D uTexture;
uniform vec2 uMouse;
uniform vec2 uClip;

varying vec2 vUv;

/** fbm - 2d */
#define NUM_OCTAVES 5

float rand(vec2 n){
  return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float noise(vec2 p){
  vec2 ip = floor(p);
  vec2 u = fract(p);
  u = u*u*(3.0-2.0*u);

  float res = mix(
    mix(rand(ip), rand(ip+vec2(1.0,0.0)), u.x),
    mix(rand(ip+vec2(0.0,1.0)), rand(ip+vec2(1.0,1.0)), u.x),
    u.y
  );
  return res*res;
}

float fbm(vec2 x) {
  float v = 0.0;
  float a = 0.5;
  vec2 shift = vec2(100);
  //Rotate to reduce axial bias
  mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));
  for (int i = 0; i < NUM_OCTAVES; ++i) {
    v += a * noise(x);
    x = rot * x * 2.0 + shift;
    a*= 0.5;
  }
  return v;
}





void main(){
  vec2 uv = vUv;
  vec2 mouse = vec2(uMouse.x, 1.0 - uMouse.y);
  vec4 clip = vec4(mouse.x - uClip.x, mouse.x + uClip.x, mouse.y - uClip.y, mouse.y + uClip.y);

  uv-=0.5;
  clip-=vec4(mix(0.0, 0.5, uv.x), mix(0.0, 0.5, uv.x), mix(0.0, 0.5, uv.y), mix(0.0, 0.5, uv.y));

  float distortion = fbm(3.0 * vec2(uv.x, uv.y - 0.5));

  uv*=distortion*2.5;
  uv+=0.5;

  vec4 texture = texture2D(uTexture, vUv);
  vec4 white = vec4(1.0);
  vec4 black = vec4(0.0, 0.0, 0.0, 1.0);

  float offset = 0.1;
  float average = texture.r + texture.g + texture.b / 3.0;
  if (average <= 0.5 - offset){
    texture = mix(black, texture + offset, 0.35);
  } else {
    texture = mix(white, texture + offset, 0.35);
  }
  
  if (uv.x < clip.x || uv.x > clip.y || uv.y < clip.z || uv.y > clip.w){
    discard;
  }

  gl_FragColor = texture;
}