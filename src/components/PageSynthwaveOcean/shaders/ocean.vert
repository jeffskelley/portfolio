#pragma glslify: snoise2 = require(glsl-noise/simplex/3d)

uniform float uTime;

varying vec2 vUV;
varying vec3 vPosition;
varying vec3 vNormal;
varying vec3 vFragPos;

const float displaceDelta = 0.75;
const float speed = 0.0005;
const vec2 noiseDensity = vec2(40.0, 10.0);

void main() {
  vUV = uv;
  vPosition = position;

  float noise = snoise2(vec3(uv * noiseDensity, uTime * speed));
  vec3 displacement = vec3(0.0, 0.0, noise);
  vec3 displacedPosition = position + normal * displacement * displaceDelta;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(displacedPosition, 1.0);
  vNormal = normal;
  vFragPos = vec3(modelMatrix * vec4(position, 1.0));
}