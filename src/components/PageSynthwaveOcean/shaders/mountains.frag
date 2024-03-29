varying vec3 vPosition;
uniform vec3 uLineColor;

void main() {
  // Pick a coordinate to visualize in a grid
  vec2 coord = vPosition.xy * 0.5;

  // Compute anti-aliased world-space grid lines
  vec2 grid = abs(fract(coord - 0.5) - 0.5) / fwidth(coord);
  float line = min(grid.x, grid.y);

  // Just visualize the grid lines directly
  float intensity = 1.0 - min(line, 1.0);

  // Apply gamma correction
  intensity = pow(intensity, 1.0 / 2.2);

  // mix between
  gl_FragColor = mix(vec4(0.0), vec4(uLineColor, 1.0), intensity);
}