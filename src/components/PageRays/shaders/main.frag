varying vec2 vUV;

uniform float uTime;

#pragma glslify: snoise2 = require(glsl-noise/simplex/2d)
#define PI 3.1415926538


void main() {
  vec2 v1 = vUV.xy * 2.0 - 1.0;
  vec2 v2 = vec2(-1.0, 1.0);
  float angle = (atan(v2.y,v2.x) - atan(v1.y,v1.x))/ (2. * PI);
  float color = snoise2(vec2((angle - uTime * 0.0001) * 10., uTime * 0.001));
  // float color = sin(angle);
  gl_FragColor = vec4(vec3(color), 1.);
}