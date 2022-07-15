vec2 brownConradyDistortion(in vec2 uv, in float k1, in float k2) {
  // distortion function from https://www.shadertoy.com/view/wtBXRz
  uv = uv * 2.0 - 1.0;	// brown conrady takes [-1:1]

  // positive values of K1 give barrel distortion, negative give pincushion
  float r2 = uv.x * uv.x + uv.y * uv.y;
  uv *= 1.0 + k1 * r2 + k2 * r2 * r2;

  // tangential distortion (due to off center lens elements)
  // is not modeled in this function, but if it was, the terms would go here

  uv = (uv * .5 + .5);	// restore -> [0:1]
  return uv;
}

#pragma glslify: export(brownConradyDistortion)