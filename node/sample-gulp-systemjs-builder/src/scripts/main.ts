import './lib/ugly-global.js' // Plain javascript defining a global
import { PoorMath } from './lib/poor-math/index.js' // Node.js code
import Greeting from './Greeting.ts' // TypeScript

Greeting.say("Hello, the value of uglyGlobal is '" + uglyGlobal + "' and the value of PI is '" + PoorMath.PI + "'.")
