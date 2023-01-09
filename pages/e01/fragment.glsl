precision highp float;

uniform sampler2D uTexture;
uniform sampler2D uTexture2;
uniform float uOpacity;
uniform float uShade;
uniform float uTime;
uniform vec2 uMouse;

varying vec2 vUv;

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
  float time = uTime * 0.0005;
  vec2 mouse = vec2(uMouse.x, 1.0 - uMouse.y);
  uv-=0.5;
  // uv*=0.5;
  float distortion = fbm(5.5 * uv);
  // mouse*=2.0;
  vec4 clip = vec4(mouse.x - 0.15, mouse.x + 0.15, mouse.y - 0.05, mouse.y + 0.05);
  clip-=vec4(mix(0.0, 0.5, uv.x), mix(0.0, 0.5, uv.x), mix(0.0, 0.5, uv.y), mix(0.0, 1.0, uv.y));

uv*=distortion*2.5;
  uv+=0.5;

  vec4 texture2 = texture2D(uTexture2, vUv);
  if (uv.x < clip.x || uv.x > clip.y || uv.y < clip.z || uv.y > clip.w){
    uv = vUv;
    // discard;
  }else{
    texture2 /= 0.25;
  }
  // uv*=0.5;

  vec4 hover = texture2D(uTexture, uv);
  // hover*=5.0;
  vec4 text = mix(texture2, hover, 0.65);
  gl_FragColor = vec4(text.xyz * uShade, uOpacity);
}