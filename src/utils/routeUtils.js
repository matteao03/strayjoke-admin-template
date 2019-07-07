/**
 * https://github.com/sunlandong/dynamicRouter/blob/master/src/utils/MenuUtils.js
 *
 * sunlandong
 */

// 把字符串转化成懒加载方法
function lazyLoading(name) {
  return () => import(`@/views/${name}.vue`)
}

// 递归生成菜单
function generateMenu(routes, data) {
  data.forEach((item) => {
    const menu = Object.assign({}, item)
    if (menu.type === 'M') {
      menu.filePath = 'layout/TheDefault'
    }

    if (menu.filePath) {
      menu.component = lazyLoading(menu.filePath)
    }

    if (menu.meta && menu.meta.prop) {
      menu.prop = menu.meta.prop
    }
    if (menu.meta && menu.meta.hidden) {
      menu.hidden = menu.meta.hidden
    }
    if (item.children) {
      menu.children = []
      generateMenu(menu.children, item.children)
    }
    routes.push(menu)
  })
}

export default generateMenu
