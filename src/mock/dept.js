import Mock from 'mockjs'

export default {
  mockDeptData() {
    Mock.mock(/api\/deptList/, {
      code: 0,
      msg: 'success',
      data:
        [{
          id: 1,
          pid: 0,
          name: '总公司',
          orderNum: 1,
          createBy: '2019-4-17',
          status: 0,
          children: [{
            id: 11,
            pid: 1,
            name: '上海分公司',
            orderNum: 1,
            createBy: '2019-4-17',
            status: 0,
            children: [{
              id: 111,
              pid: 11,
              name: '人事部',
              orderNum: 1,
              createBy: '2019-4-17',
              status: 0
            },
            {
              id: 112,
              pid: 11,
              name: '技术部',
              orderNum: 2,
              createBy: '2019-4-17',
              status: 0
            }]
          },
          {
            id: 12,
            pid: 1,
            name: '北京分公司',
            orderNum: 2,
            createBy: '2019-4-17',
            status: 0,
            children: [{
              id: 121,
              pid: 12,
              name: '销售部',
              orderNum: 1,
              createBy: '2019-4-17',
              status: 0
            },
            {
              id: 122,
              pid: 12,
              name: '法务部',
              orderNum: 1,
              createBy: '2019-4-17',
              status: 0
            }]
          },
          {
            id: 13,
            pid: 1,
            name: '郑州分公司',
            orderNum: 3,
            createBy: '2019-4-17',
            status: 1
          }]
        }]
    })
  }
}
