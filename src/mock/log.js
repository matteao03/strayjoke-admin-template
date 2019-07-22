import Mock from 'mockjs'

export default {
  mockOperLogData() {
    Mock.mock(/api\/operLogList/, {
        "msg":"success",
        "data":{
            "list":[
                {"operName":"admin","id":118,"title":"修改字典数据","ip":"::ffff:127.0.0.1","type":2,"url":"/dictData","operTime":"2019-07-16 16:28","status":0}
            ],
        "msg":"success"
        }
    })
  }
}