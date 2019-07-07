
// 递归获取部门名称
export function recursiveObj(id, data) {
  for (let i = 0, len = data.length; i < len; i++) {
    if (data[i].id === id) {
      return data[i].name
    }
    if (data[i].children && data[i].children.length > 0) {
      const name = recursiveObj(id, data[i].children)
      if (name) {
        return name
      }
    }
  }
}

// 判断是否拥有该权限
export function hasPermission(resources, permission) {
  let result = false
  if (resources && resources.length > 0) {
    result = resources.some((item) => {
      return new RegExp(item).test(permission)
    })
  }
  return result
}

// js对象深拷贝
export function deepCopy(obj) {
  // 只拷贝对象
  if (typeof obj !== 'object') return
  // 根据obj的类型判断是新建一个数组还是一个对象
  var newObj = obj instanceof Array ? [] : {}
  for (var key in obj) {
    // 遍历obj,并且判断是obj的属性才拷贝
    if (obj.hasOwnProperty(key)) {
      // 判断属性值的类型，如果是对象递归调用深拷贝
      newObj[key] = typeof obj[key] === 'object' ? deepCopy(obj[key]) : obj[key]
    }
  }
  return newObj
}

// 判断是否渲染btn
export function isRenderBtn(resources, btn, id) {
  let result = false
  if (id === 1) {
    result = true
  } else {
    if (resources && resources.length > 0) {
      result = resources.some((item) => {
        return btn === item
      })
    }
  }
  return result
}
