import Mock from 'mockjs'

export default {
  mockMenuData() {
    Mock.mock(/api\/menuList/, {
      msg:"success",
      data:[
        {id:1,pid:0,name:"系统管理",orderNum:1,path:"",perms:"",type:"M",visible:"0",isPublic:"0",menuIcon:"menu",method:"1"},
      ]
    })
  }
}

