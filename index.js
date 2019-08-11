/*
 * Package: thanos-gauntlet
 * Github: https://github.com/itibbers/thanos-gauntlet
 * Usage:
 *   import Gauntlet from 'the-infinity-gauntlet'
 *   let gauntlet = new Gauntlet(ele)
 *   gauntlet.snap()
 *   gauntlet.back()
 */

import html2canvas from 'html2canvas'

class Gauntlet {
  constructor(elementName) {
    if (!elementName) {
      throw new Error('What should I snap it away? [no element]')
    }
    // all elements
    this.ele = document.querySelectorAll(elementName)
    // count of dom faded away
    this.count = 16
    // duration of animation
    this.duration = '1.5s'
    // status of boy fading
    this.status = false
    // is faded
    this.faded = false
    this.canvas = null
  }

  // Snap to fade and back
  async snap() {
    this.faded ? this.back() : this.fade()
  }

  // I love you three thousand
  async fade() {
    if (this.status && !this.faded) {
      return
    }
    this.status = true

    let n = 0
    let arr = [...new Array(this.ele.length).keys()]
    arr.sort(() => Math.random() - 0.5)

    const helper = async () => {
      const el = this.ele[arr.pop()]
      const frames = await this._createFrames(el)
      await this._paint(el, frames)
      if (++n < this.ele.length / 2) {
        helper()
      }
    }
    await helper()
    this.status = false
    this.faded = true
  }

  // Welcome back
  back() {
    if (this.status && this.faded) {
      return
    }
    this.status = true
    this.ele.forEach(el => el.style.visibility = 'visible')
    this.status = false
    this.faded = false
  }

  // element to image frames
  async _createFrames(ele) {
    this.canvas = await html2canvas(ele)
    const ctx = this.canvas.getContext('2d')
    const {
      width,
      height
    } = this.canvas

    // 获取 canvas 的像素数据
    const originalFrame = ctx.getImageData(0, 0, width, height)
    // 循环创建多个像素对象，注意像素对象默认是透明的。
    const frames = []
    for (let i = 0; i < this.count; i++) {
      frames[i] = ctx.createImageData(width, height)
    }

    // 将原始的像素数据，随机分散到多个canvas上面，粒子化
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        // 随机获取 像素对象
        const frameIndex = Math.floor(Math.random() * this.count)
        // 当前的像素位置：通过 x、y计算出当前遍历到哪个像素点，实际就是从左到右,一行一行的遍历
        const pixelIndex = 4 * (y * width + x)
        // 一个像素 rgba  ，所以需要设置 4 个值
        for (let z = 0; z < 4; z++) {
          frames[frameIndex].data[pixelIndex + z] = originalFrame.data[pixelIndex + z]
        }
      }
    }
    return frames
  }

  // paint frames
  _paint(el, frames) {
    return new Promise((resolve, reject) => {
      let parentNode = el.parentNode
      let {
        top,
        left
      } = this._getOffset(el)

      // 遍历像素对象，将像素对象填充到画布上面
      const canvasNodes = frames.map((item, i) => {
        const node = this.canvas.cloneNode(true)
        node.getContext('2d').putImageData(item, 0, 0)
        Object.assign(node.style, {
          position: 'absolute',
          top: `${top}px`,
          left: `${left}px`,
          userSelect: 'none',
          pointerEvents: 'none',
          transition: `transform ${this.duration} ease-out ${i / this.count}s, opacity ${this.duration} ease-out`,
          transform: 'rotate(0deg) translate(0px)',
          opacity: 1
        })
        node.className = 'bye-my-friends'
        parentNode.appendChild(node)
        node.focus()
        return node
      })

      el.style.visibility = 'hidden'

      let count = 0
      // 对粒子添加动画，完整图像开始消散
      canvasNodes.forEach((item, i) => {
        item.addEventListener('transitionend', () => {
          item.remove()
          if (++count === canvasNodes.length) {
            this.status = false
            this.faded = true
            resolve()
          }
        })
        Object.assign(item.style, {
          transform: `rotate(${20 * (Math.random() - 0.5)}deg) translate(${200 * (Math.random() - 0.5)}px, ${20 * (Math.random() - 0.5)}px)`,
          opacity: 0
        })
      })
    })
  }

  _getOffset(el) {
    el = el.getBoundingClientRect()
    return {
      width: el.width,
      height: el.height,
      left: el.left + document.documentElement.scrollLeft,
      top: el.top + document.documentElement.scrollTop
    }
  }
}

export default Gauntlet
