varying vec2 vUV;
uniform sampler2D tPositionVelocity;

void main() {
  vUV = uv;
  // vec4 initialPosition = texture2D(tPositionVelocity, vUV);
  // vec3 newPosition = vec3(initialPosition.x, initialPosition.y, 0.0);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}