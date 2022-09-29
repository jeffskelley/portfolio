varying vec3 vPosition;
// varying vec3 vSurfaceToLight;
// varying vec3 vNormal;

uniform vec3 uOceanLineColor;
uniform vec3 uOceanFillColor;


void main() {
  /**
   * Grid lines
   * adapted from https://madebyevan.com/shaders/grid/
   */
  // Pick a coordinate to visualize in a grid
  vec2 coord = vPosition.xy * 0.5;

  // Compute anti-aliased world-space grid lines
  vec2 grid = abs(fract(coord - 0.5) - 0.5) / fwidth(coord);
  float line = min(grid.x, grid.y);

  // Just visualize the grid lines directly
  float intensity = 1.0 - min(line, 1.0);

  // Apply gamma correction
  intensity = pow(intensity, 1.0 / 2.2);

  // mix between fill and lines
  vec3 color = mix(uOceanFillColor, uOceanLineColor, intensity);

  /**
   * Spotlight
   */
  // vec3 normal = normalize(vNormal);
  // vec3 surfaceToLightDirection = normalize(vSurfaceToLight); // turn it around
  // float light = dot(normal, surfaceToLightDirection);

  // color *= light;

  gl_FragColor = vec4(color, 1.0);
}