import Mock from 'mockjs'

export default {
  mockPostData() {
    Mock.mock(/api\/postList/, {
        "msg":"success",
        "data":[
            {"id":7,"name":"运营人员","code":"yunying","sort":0,"createBy":"2019-06-24 15:01","status":"1"},
            {"id":8,"name":"dd","code":"dd","sort":0,"createBy":"2019-07-11 15:29","status":"0"},
            {"id":9,"name":"ssww","code":"ssww","sort":1,"createBy":"2019-07-12 09:51","status":"0"}
        ]
    })
  }
}