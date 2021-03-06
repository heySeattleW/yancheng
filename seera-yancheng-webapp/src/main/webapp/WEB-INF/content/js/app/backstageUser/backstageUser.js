/**
 * Created by liulin on 2016/7/16.
 */

define(function(require,exports,module){

    var List = require("../common/pagelist");//分页
    var check = require("../common/checkbox");//复选框
    var wDatePicker = require("wdatePicker");//时间插件
    //widget插件作用：点击按钮，弹出模态框，对按钮进行初始化
    var widget = require("../common/widget");
    var validate = require("validate");//对表单进行验证
    require("../common/jquery.serializeObject");//对提交的数据 进行序列化 返回一个object



    check.checkAll("body", ".checkAll", ".checkBtn")
    loadData();
    $("#backstageUserQueryBtn").click(function () {
        loadData();
    });

    //加载数据
    function loadData() {
        var tpl = require("text!app/tpl/backstageUser/backstageUserTpl.html");
        var url = $("#searchForm").attr("data-url");
        var data = $("#searchForm").serialize().toString();
        List("#table", tpl, url, data, 1, 10);
    }

    //时间插件
    $("body").delegate(".Wdate", "click", function () {
        wDatePicker({ dateFmt: 'yyyy-MM-dd ' });
    });

    // 手机号码验证
    jQuery.validator.addMethod("isMobile", function(value, element) {
        var length = value.length;
        var mobile = /^(13[0-9]{9})|(18[0-9]{9})|(14[0-9]{9})|(17[0-9]{9})|(15[0-9]{9})$/;
        return this.optional(element) || (length == 11 && mobile.test(value));
    }, "请正确填写您的手机号码");

    //新增
    var callb= function callback() {
        $("#addBackstageUserForm").validate({

            rules: {
                userName: {
                    required: true
                },
                phone:{
                    required : true,
                    minlength : 11,
                    // 自定义方法：校验手机号在数据库中是否存在
                    // checkPhoneExist : true,
                    isMobile : true
                },
                managerType: {
                    required: true
                }
            },
            messages: {
                userName: {
                    required: "必填"
                },
                phone:{
                    required : "请输入手机号",
                    minlength : "确认手机不能小于11个字符",
                    isMobile : "请正确填写您的手机号码"
                },
                managerType:{
                    required:"必须选择"
                }

            },

            submitHandler: function (form) {
                //表单提交句柄,为一回调函数，带一个参数：form
                var _url = $("#addOrUpdateBackstageUser").attr("data-url");

                var options = {
                    url: _url + "?t=" + new Date().getMilliseconds(),
                    type: 'post',
                    data: $("#addBackstageUserForm").serializeObject(),
                    success: function (data) {
                        if (data.isSuccess)
                            alert("新增成功");
                        $("#myModal").modal("hide")
                        loadData();
                    }
                };
                $.ajax(options);
            }
        });
    }
    widget.init(callb);

    //删除
    $("body").delegate(".deleteUser","click",function(){
        var _url = $(this).attr("data-url");
        var id = $("#hiddenId").val();
        $.ajax({
            url:_url+"?t"+new Date().getMilliseconds()+"&id="+id,
            type:'post',
            success:function(data){
                if(data.isSuccess){
                    alert("删除成功！")
                    loadData();
                }else{
                    alert("删除失败！")
                }
            }
        })
    })


    $("body").delegate(".disabledStatus","click",function(){
        var id = $(this).parent().parent().children(".firstTd").children().children(".checkBtn").val();
        $.ajax({
            url:"ajax_disabled_backstageUserStatus"+"?t="+new Date().getMilliseconds()+"&id="+id,
            type:'get',
            success:function(data){
                if(data.isSuccess){
                    alert("状态设置成功");
                    loadData();
                }
            }
        })
    })


    $("body").delegate(".enableStatus","click",function(){
        var id = $(this).parent().parent().children(".firstTd").children().children(".checkBtn").val();

        $.ajax({
            url:"ajax_enable_backstageUserStatus"+"?t="+new Date().getMilliseconds()+"&id="+id,
            type:'get',
            success:function(data){
                if(data.isSuccess){
                    alert("状态设置成功");
                    loadData();
                }
            }
        })
    })


    //删除后台用户页面数据
    var chk_value = [];
    $("#deleteBackstageUsers").click(function () {

        $('.checkBtn:checked').each(function () {
            chk_value.push($(this).val());
        });
        deleteMenu(chk_value.toString(), false);
    })

    function deleteMenu(selectids) {
        var options = {
            url: "ajax_deleteBackstageUsers?t=" + new Date().getMilliseconds() + "&ids=" + selectids,
            type: 'get',
            success: function (data) {
                if (data.isSuccess) {
                    alert("删除成功");
                    loadData();
                }
                else
                    alert(data);
            }
        };
        $.ajax(options);
    }

    //判断选中的个数
    var numberLength=0;
    $("body").delegate(".checkBtn","ifChecked",function(){
        var i=0;
        var number = [];
        $(".checkBtn").each(function(){
            if($(this).prop("checked")){
                i++;
                number.push(i);
            }
        })
        numberLength=number.length;
        $(".dynamicChoose").html(number.length);
    })
    $("body").delegate(".checkBtn","ifUnchecked",function(){
        numberLength--;
        $(".dynamicChoose").html(numberLength);
    })


})
