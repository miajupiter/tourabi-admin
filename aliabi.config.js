'use strict'

/** AliAbi Project config file
 * We can use this config to implement easily another similars projects.
 * Another explanation: We fuck this project and get more babies.
*/

const aliabiConfig = {
  name: "TourAbi",
  title: "TourAbi Admin Panel", // page title and project long name
  meta: {
    description: "TourAbi Admin Panel - The world's best tour portal"
  },
  hiddenSignature:()=>(
    <ul className='hidden'>
      <li><a href="https://miajupiter.com">developed by miajupiter</a></li>
      <li><a href="http://mrtek.com.tr/">MrTEK Yazilim Evi</a></li>
    </ul>
  )
}


export default aliabiConfig