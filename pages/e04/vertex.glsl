uniform float uTime;
uniform float uTimeline;

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


// void main(){
//   vUv = uv;
//   // float wind = uTime * 0.002;
//   float wind = 0.002;
//   vec4 modelPosition = modelMatrix * vec4(position, 1.0);
//   float radius = 1.0;
//   float temp = modelPosition.x;
//   // if (uv.x < 0.125){

//   // // modelPosition.x = smoothstep(0.125, 0.25, 0.125 - sin(temp));
//   // // modelPosition.x =  sin(temp);
//   // modelPosition.x -= cos(temp) * 0.79;
//   // }
//   modelPosition.z -= smoothstep(0.0, 1.0 - cos( temp), 1.0);
//   modelPosition.z += 1.0;
//   // if (uv.x < 0.25){

//   // modelPosition.x = smoothstep(0.125, 0.25, 0.125 - sin(temp));
//   // modelPosition.x =  sin(temp);
//   modelPosition.x =  uv.x;
//   // }
//   modelPosition.x += 2.0;
//   // modelPosition.x+= 0.125;
//   // modelPosition.z =  radius*sin( modelPosition.x);
//   // modelPosition.z = sin(modelPosition.x);
//   // modelPosition.z -= sin(modelPosition.y  - wind) * 0.2;
//   gl_Position = projectionMatrix * viewMatrix * modelPosition;
// }


// void main(){
//   vUv = uv;
//   float wind = uTime * 0.2;
//   vec4 modelPosition = modelMatrix * vec4(position, 1.0);
//   // if (uv.x < 0.25){

//   // // modelPosition.y += sin(modelPosition.z * 5.0 - wind) * 0.2;
//   // // modelPosition.y += sin(modelPosition.x - wind) * 0.2;
//   // }else {
//   // // modelPosition.y += modelPosition.z * 5.0 - wind * 0.02;
//   // float x = modelPosition.x;

//   // }
//   // float delta = 1.0;
//   // vec3 p = position.xyz;
//   // float new_x = p.x * cos(delta) - p.z*sin(delta);
//   // float new_z = p.z * cos(delta) - p.x*sin(delta);
//   // modelPosition = vec4(new_x, p.y, new_z, 1.0);

//   gl_Position = projectionMatrix * viewMatrix * modelPosition;
// }


void main(){
  vUv = uv;
 
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  float r = uTimeline;

  if (uv.x < r){
    modelPosition.z += cos(modelPosition.x * 5.0) * r;  
    // modelPosition.z += cos(modelPosition.x * 5.0) * uTimeline;  
    modelPosition.x -= (r - uv.x) * ( - sin(modelPosition.x * (4.3)) - 1.0); 
    // modelPosition.x += (0.125 - uv.x) * (1.0 - sin(modelPosition.x * (75.0 * uTimeline)) - 1.25); 
    // modelPosition.x += sin(modelPosition.z * 15.0); 
    modelPosition.z += 1.0 * r;  
  } else {
    // modelPosition.z -= uTimeline;  

  }
 

  gl_Position = projectionMatrix * viewMatrix * modelPosition;
}