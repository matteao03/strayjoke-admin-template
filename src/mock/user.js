import Mock from 'mockjs'

export default {
  mockUserData() {
    Mock.mock(/api\/userList/, {
      code: 0,
      msg: 'success',
      data: [
        {
          id: 1,
          createTime: '2016-05-02',
          name: '赵飞亚',
          loginName: 'admin',
          dept: '运维支持部',
          phone: '17521512593',
          status: 0
        },
        {
          id: 2,
          createTime: '2016-05-02',
          name: '赵飞亚',
          loginName: 'admin',
          dept: '运维支持部',
          phone: '17521512593',
          status: 0
        },
        {
          id: 3,
          createTime: '2016-05-02',
          name: '赵飞亚',
          loginName: 'admin',
          dept: '运维支持部',
          phone: '17521512593',
          status: 1
        },
        {
          id: 4,
          createTime: '2016-05-02',
          name: '赵飞亚',
          loginName: 'admin',
          dept: '运维支持部',
          phone: '17521512593',
          status: 1
        },
        {
          id: 5,
          createTime: '2016-05-02',
          name: '赵飞亚',
          loginName: 'admin',
          dept: '运维支持部',
          phone: '17521512593',
          status: 0
        },
        {
          id: 4,
          createTime: '2016-05-02',
          name: '赵飞亚',
          loginName: 'admin',
          dept: '运维支持部',
          phone: '17521512593',
          status: 1
        },
        {
          id: 4,
          createTime: '2016-05-02',
          name: '赵飞亚',
          loginName: 'admin',
          dept: '运维支持部',
          phone: '17521512593',
          status: 1
        },
        {
          id: 4,
          createTime: '2016-05-02',
          name: '赵飞亚',
          loginName: 'admin',
          dept: '运维支持部',
          phone: '17521512593',
          status: 1
        },
        {
          id: 4,
          createTime: '2016-05-02',
          name: '赵飞亚',
          loginName: 'admin',
          dept: '运维支持部',
          phone: '17521512593',
          status: 1
        },
        {
          id: 4,
          createTime: '2016-05-02',
          name: '赵飞亚',
          loginName: 'admin',
          dept: '运维支持部',
          phone: '17521512593',
          status: 1
        }]
    })
  }
}
