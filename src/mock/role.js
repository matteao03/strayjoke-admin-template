import Mock from 'mockjs'

export default {
  mockRoleData() {
    Mock.mock(/api\/roleList/, {
      code: 0,
      msg: 'success',
      data: [
        {
          createTime: '2016-05-02',
          name: '管理员',
          rolekey: 'admin',
          id: 1,
          roleSort: 1,
          status: 0
        },
        {
          createTime: '2016-05-02',
          name: '运营',
          rolekey: 'yunying',
          id: 1,
          roleSort: 1,
          status: 0
        },
        {
          createTime: '2016-05-02',
          name: '人事',
          roleKey: 'hr',
          id: 1,
          roleSort: 1,
          status: 1
        }]
    })
  }
}
