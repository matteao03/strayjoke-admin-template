import Mock from 'mockjs'
import Dept from './dept.js'
import Menu from './menu.js'
import User from './user.js'
import Role from './role.js'
import Dict from './dict.js'
import Post from './post.js'
import Log from './log.js'

export default {
  mockData() {
    Mock.mock(/api\/login/, {
      msg:"登录成功",
      data:{
        token:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1NjM1MDU3ODUsInVzZXJJZCI6MSwibG9naW5OYW1lIjoiYWRtaW4iLCJyYW5kb20iOiIyNDc2Njg3MjM0MzUxNzg3MTMiLCJleHAiOjE1NjM1MDYwODV9.cE1p842KVgffe8DE0oS497aolWIJgVRr2TvaADfOA84"
      }
    })

    Mock.mock(/api\/auth\/info/, {
      msg:"success",
      data:{
        roles:["admin"],
        posts:[],
        id:1,
        loginName:"admin",
        deptName:null,
        deptId:null,
        name:"管理员",
        phone:"17717935764",
        email:"matteao_03@163.com",
        sex:"0",
        status:"0",
        avatar:""
      }
    })

    Mock.mock('/api/logout', {
      msg: 'success'
    })

    Mock.mock('/api/auth/permissions', {
      "msg":"success",
      "data":{
          menuPermissions:[
            {
              "type":"M",
              "icon":"menu",
              "id":1,
              "name":"系统管理",
              "orderNum":1,
              "path":"",
              "filePath":"",
              "pid":0,
              "children":[]
            }
          ],
          btnPermissions:[
            "system:user:search",
            "system:menu:add",
            
          ],
          
        }
    })

    Dept.mockDeptData()
    Menu.mockMenuData()
    User.mockUserData()
    Role.mockRoleData()
    Post.mockPostData()
    Log.mockOperLogData()
    Dict.mockDictData()
  }
}
