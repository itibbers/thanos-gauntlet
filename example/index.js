import Gauntlet from 'thanos-gauntlet'

const gauntlet = new Gauntlet('.info')

let thanosSnap = document.querySelector('#thanos-snap')
let thanosTime = document.querySelector('#thanos-time')

thanosSnap.addEventListener('animationend', () => {
  thanosSnap.classList.remove('thanos-animation')
  gauntlet.snap()
})
thanosSnap.onclick = () => {
  thanosSnap.classList.add('thanos-animation')
}

thanosTime.addEventListener('animationend', () => {
  thanosTime.classList.remove('thanos-animation')
  gauntlet.snap()
})
thanosTime.onclick = () => {
  thanosTime.classList.add('thanos-animation')
}

let btn = document.querySelector('#btn')
btn.onclick = () => gauntlet.snap()
