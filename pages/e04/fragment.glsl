precision highp float;

uniform sampler2D uTexture;
uniform float uOpacity;
uniform float uTimeline;
uniform vec2 uMouse;
uniform vec4 uClip;

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
  // vec2 mouse = vec2(uMouse.x, 1.0 - uMouse.y);
  vec4 clip = uClip;

  uv-=0.5;

  if (uv.x < clip.x || uv.x > clip.y || uv.y < clip.z || uv.y > clip.w){
    discard;
  }
  
  uv+=0.5;
  // uv*=2.0;

    float r = uTimeline;


  vec4 texture = texture2D(uTexture, uv);
  
  if (uv.x < r){
    texture.x =0.3;
    texture.y =0.3;
    texture.z =0.3;
  }else if (uv.x < (3.0 * r / 2.0)){
    texture -= 0.05;
  }

  gl_FragColor = vec4(texture.xyz, uOpacity);
}