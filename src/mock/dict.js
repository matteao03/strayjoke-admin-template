import Mock from 'mockjs'

export default {
  mockDictData() {
    Mock.mock(/api\/dictList/, {
        "data":{
            "list":[
                {"id":12,"name":"http请求","type":"sys_http_method","remark":"http 请求方法","createTime":"2019-07-16 16:15","status":"0"},
                {"id":11,"name":"菜单类型","type":"sys_menu_type","remark":"系统菜单类型","createTime":"2019-07-16 16:11","status":"0"},
                {"id":10,"name":"用户性别","type":"sys_user_sex","remark":"用户性别列表","createTime":"2019-07-16 14:06","status":"0"},
                {"id":2,"name":"菜单状态","type":"sys_show_hide","remark":"菜单状态列表","createTime":"2018-03-16 11:33","status":"0"},
                {"id":3,"name":"系统开关","type":"sys_normal_disable","remark":"系统开关列表","createTime":"2018-03-16 11:33","status":"0"},
                {"id":4,"name":"任务状态","type":"sys_job_status","remark":"任务状态列表","createTime":"2018-03-16 11:33","status":"0"},
                {"id":5,"name":"系统是否","type":"sys_yes_no","remark":"系统是否列表","createTime":"2018-03-16 11:33","status":"0"},
                {"id":6,"name":"通知类型","type":"sys_notice_type","remark":"通知类型列表","createTime":"2018-03-16 11:33","status":"0"},
                {"id":7,"name":"通知状态","type":"sys_notice_status","remark":"通知状态列表","createTime":"2018-03-16 11:33","status":"0"},
                {"id":8,"name":"操作类型","type":"sys_oper_type","remark":"操作类型列表","createTime":"2018-03-16 11:33","status":"0"}
            ],
            "total":11
        },
        "msg":"success"
    })
  }
}
