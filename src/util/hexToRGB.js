export default function hexToRGB(hex) {
  /**
   * @input hex: 0xffffff
   * @return rgb: [1.0, 1.0, 1.0]
   */
  const bigint = parseInt(hex, 10)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255

  return [r, g, b]
}
