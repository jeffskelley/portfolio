import Home from 'components/PageHome'
import SynthwaveMountains from 'components/PageSynthwaveMountains'
import SynthwaveOcean from 'components/PageSynthwaveOcean'

const routes = [
  { name: 'home', path: '/', component: Home },

  { name: 'synthwaveMountains', path: '/synthwave-mountains', component: SynthwaveMountains },
  { name: 'synthwaveOcean', path: '/synthwave-ocean', component: SynthwaveOcean },
]

export default routes
