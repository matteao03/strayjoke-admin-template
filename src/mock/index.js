import Mock from 'mockjs'
import Dept from './dept.js'
import Menu from './menu.js'
import User from './user.js'
import Role from './role.js'

export default {
  mockData() {
    Mock.mock('/api/login', {
      code: 0,
      msg: 'success',
      data: {
        token: 'fdsjfhjkdshfkldsajfjasdfbjsdkfhsdajfj'
      }
    })

    Mock.mock('/api/user/info', {
      code: 0,
      msg: 'success',
      data: {
        id: '100001',
        name: 'admin',
        roles: ['admin', 'hr', 'yunying'],
        permissions: [
          {
            path: '/system',
            filePath: 'layout/TheLayout',
            type: 'M',
            name: '系统管理',
            meta: { icon: 'menu' },
            children: [
              {
                path: 'user',
                type: 'C',
                name: '用户管理',
                filePath: 'system/user/UserList',
                meta: { icon: 'tickets' }
              },
              {
                path: 'user/profile',
                type: 'C',
                name: '个人中心',
                filePath: 'system/user/Profile',
                meta: { icon: 'tickets', hidden: true }
              },
              {
                path: 'editUser/:data',
                name: '编辑用户',
                filePath: 'system/user/EditUser',
                meta: { props: true, hidden: true }
              },
              {
                path: 'addUser',
                name: '添加用户',
                filePath: 'system/user/AddUser',
                meta: { hidden: true }
              },
              {
                path: 'role',
                name: '角色管理',
                filePath: 'system/role/RoleList'
              },
              {
                path: 'relateUser/:roleId',
                name: '分配用户',
                filePath: 'system/role/RelatedUser',
                meta: { props: true, hidden: true }
              },
              {
                path: 'menu',
                name: '菜单管理',
                filePath: 'system/SystemMenu'
              },
              {
                path: 'dept',
                name: '部门管理',
                filePath: 'system/SystemDept'
              }
            ]
          }
        ]
      }
    })

    Mock.mock('/api/logout', {
      code: 0,
      msg: 'success'
    })

    Dept.mockDeptData()
    Menu.mockMenuData()
    User.mockUserData()
    Role.mockRoleData()
  }
}
