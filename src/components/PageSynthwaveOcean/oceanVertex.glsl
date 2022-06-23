#pragma glslify: snoise2 = require(glsl-noise/simplex/3d)

uniform float uTime;
varying vec2 vUV;
varying vec3 vPosition;

const float displaceDelta = 0.3;
const float noiseDensity = 10.0;
const float speed = 0.0007;

void main() {
  vUV = uv;
  vPosition = position;

  float noise = snoise2(vec3(vec2(uv * noiseDensity), uTime * speed));
  vec3 displacement = vec3(0.0, 0.0, noise);
  vec3 displacedPosition = position + normal * displacement * displaceDelta;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(displacedPosition, 1.0);
}