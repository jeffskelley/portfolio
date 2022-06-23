// adapted from: https://madebyevan.com/shaders/grid/

varying vec3 vPosition;
varying vec2 vUV;
uniform vec3 uOceanColor;

void main() {
  // Pick a coordinate to visualize in a grid
  vec2 coord = vPosition.xy;

  // Compute anti-aliased world-space grid lines
  vec2 grid = abs(fract(coord - 0.5) - 0.5) / fwidth(coord);
  float line = min(grid.x, grid.y);

  // Just visualize the grid lines directly
  float color = 1.0 - min(line, 1.0);

  // Apply gamma correction
  color = pow(color, 1.0 / 2.2);
  gl_FragColor = vec4(color * uOceanColor, 1.0);
}