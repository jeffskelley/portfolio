import Home from 'components/PageHome'
import SynthwaveOcean from 'components/PageSynthwaveOcean'
import LiquidText from 'components/PageLiquidText'
import DrawToReveal from 'components/PageDrawToReveal'
import DripMask from 'components/PageDripMask'
import GradientCircles from 'components/PageGradientCircles'

import BambooAlbumGrid from 'components/PageBambooAlbumGrid'
import BambooStickerPeel from 'components/PageBambooStickerPeel'

const routes = [
  { name: 'home', path: '/', component: Home },

  { name: 'albumGrid', path: '/album-grid', component: BambooAlbumGrid },
  { name: 'liquidText', path: '/liquid-text', component: LiquidText },
  { name: 'drawToReveal', path: '/draw-to-reveal', component: DrawToReveal },
  {
    name: 'dripMask',
    path: '/drip-mask',
    component: DripMask,
  },
  { name: 'gradientCircles', path: '/gradient-circles', component: GradientCircles },

  // not added to main yet
  { name: 'bambooStickerPeel', path: '/bamboo-sticker-peel', component: BambooStickerPeel },

  // 3d
  { name: 'synthwaveOcean', path: '/synthwave-ocean', component: SynthwaveOcean },
]

export default routes
