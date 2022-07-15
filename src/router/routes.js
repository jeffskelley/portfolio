import Home from 'components/PageHome'
import SynthwaveOcean from 'components/PageSynthwaveOcean'
import LiquidText from 'components/PageLiquidText'
import DrawToReveal from 'components/PageDrawToReveal'
import DripMask from 'components/PageDripMask'
import AlbumGrid from 'components/PageAlbumGrid'
import GradientCircles from 'components/PageGradientCircles'

const routes = [
  { name: 'home', path: '/', component: Home },

  // 2d
  { name: 'liquidText', path: '/liquid-text', component: LiquidText },
  { name: 'drawToReveal', path: '/draw-to-reveal', component: DrawToReveal },
  {
    name: 'dripMask',
    path: '/drip-mask',
    component: DripMask,
    // meta: { hasLightBackground: true },
  },

  { name: 'albumGrid', path: '/album-grid', component: AlbumGrid },
  { name: 'gradientCircles', path: '/gradient-circles', component: GradientCircles },

  // 3d
  { name: 'synthwaveOcean', path: '/synthwave-ocean', component: SynthwaveOcean },
]

export default routes
