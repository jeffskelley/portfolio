float roundedBoxSDF(vec2 CenterPosition, vec2 Size, float Radius) {
  // from https://iquilezles.org/articles/distfunctions
  return length(max(abs(CenterPosition) - Size + Radius, 0.0)) - Radius;
}


float roundedBox2D(vec2 uv, float radius) {
  // adapted from https://www.shadertoy.com/view/WtdSDs
  // The scale of the rectangle
  vec2 size = vec2(1.0, 1.0);
  // the location of the rectangle (bottom left corner)
  vec2 location = vec2(0.0, 0.0);
  // How soft the edges should be (higher is softer)
  float edgeSoftness = 1.0;
  // Calculate distance to edge
  float distance = roundedBoxSDF(uv.xy - location - (size / 2.0), size / 2.0, radius);
  // Smooth the result (free antialiasing)
  float smoothedAlpha = 1.0 - smoothstep(0.0, edgeSoftness * 0.01, distance);

  return smoothedAlpha;
}

#pragma glslify: export(roundedBox2D)
