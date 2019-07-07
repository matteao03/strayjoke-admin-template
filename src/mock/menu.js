import Mock from 'mockjs'

export default {
  mockMenuData() {
    Mock.mock(/api\/menuList/, {
      code: 0,
      msg: 'success',
      data: [
        {
          id: 1,
          pid: 0,
          name: '工作台',
          url: '',
          orderNum: 1,
          perms: '',
          type: 'C',
          visible: 0
        }, {
          id: 2,
          pid: 0,
          name: '客户管理',
          url: '',
          orderNum: 1,
          perms: '',
          type: 'C',
          visible: 0
        }, {
          id: 3,
          pid: 0,
          name: '系统管理',
          url: '',
          orderNum: 1,
          perms: '',
          type: 'M',
          visible: 0,
          children: [{
            id: 31,
            pid: 3,
            name: '用户管理',
            url: '',
            orderNum: 1,
            perms: '',
            type: 'C',
            visible: 0
          }, {
            id: 32,
            pid: 3,
            name: '菜单管理',
            url: '',
            orderNum: 1,
            perms: '',
            type: 'C',
            visible: 0
          }]
        }]
    })
  }
}

