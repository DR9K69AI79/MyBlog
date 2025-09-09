import { h } from 'hastscript'
import { visit } from 'unist-util-visit'

export function rehypeImage(options = {}) {
  const base = typeof options.base === 'string' ? options.base : '/'

  const addBase = (src) => {
    if (!src || typeof src !== 'string') return src
    if (/^(https?:)?\/\//i.test(src) || src.startsWith('data:')) return src
    if (base !== '/' && (src === base || src.startsWith(base + '/'))) return src
    const normalized = src.startsWith('/') ? src : `/${src}`
    return base === '/' ? normalized : `${base}${normalized}`
  }

  const buildImage = (node) => {
    const imgProps = node.properties || {}
    if (imgProps.src) {
      imgProps.src = addBase(imgProps.src)
    }
    if (imgProps.srcset) {
      imgProps.srcset = String(imgProps.srcset)
        .split(',')
        .map((entry) => {
          const [url, descriptor] = entry.trim().split(/\s+/, 2)
          return [addBase(url), descriptor].filter(Boolean).join(' ')
        })
        .join(', ')
    }
    return h('img', { ...imgProps, loading: 'lazy' })
  }

  const buildFigure = (node) => {
    let imgTitle = node.properties?.title
    if (imgTitle) imgTitle = String(imgTitle).trim()
    return h('figure', null, [buildImage(node), imgTitle ? h('figcaption', imgTitle) : null])
  }

  return function (tree) {
    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName === 'p' && node.children.length === 1) {
        const child = node.children[0]
        if (child.tagName === 'img') {
          parent.children[index] = buildFigure(child)
        }
      } else if (node.tagName === 'img') {
        parent.children[index] = buildImage(node)
      }
    })
  }
}
