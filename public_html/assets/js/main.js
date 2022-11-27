function get_email(){
    $.ajax({
        url: "/include/email.php",
        method: "POST",
        data: "status=get_list",
        success: function (data) {
            for(var i = 0; i<JSON.parse(data).length; i++){
                $(".table_email").append("<tr><td>" +
                    "<span class='email_pp'>"+($(".table_email").find("tr").length+1)+"</span>" +
                    "<input type='hidden' value='"+JSON.parse(data)[i].email+"' id='email_inp_"+JSON.parse(data)[i].id+"'/>" +
                    "<input type='hidden' value='"+JSON.parse(data)[i].id+"' id='email_inp_id_"+JSON.parse(data)[i].id+"'/>" +
                    "</td>" +
                    "<td><span class='text_email' id='text_email_"+JSON.parse(data)[i].id+"'>"+JSON.parse(data)[i].email+"</span></td>" +
                    "<td><span class='btn_p' data-toggle='modal' data-target='#exampleModal' onClick='popup_f(\"email_edit\", $(\"#email_inp_"+JSON.parse(data)[i].id+"\").val(), $(\"#email_inp_id_"+JSON.parse(data)[i].id+"\").val())'>Изменить</span></td><td><span class='btn_p' onClick='popup_f(\"email_del\", false, "+JSON.parse(data)[i].id+")'>Удалить</span></td></tr>");
            }
        }
    })
}

function popup_f(id, email, email_id){


    $("#form_email").removeClass("was-validated");
    $(".invalid-feedback").css("display", "none")

    $("#exampleModalLabel").html("");
    $(".email_inp_wrap").html("");
    $(".modal-footer_btn").html("");
    if(id == "email_new"){
        $("#exampleModalLabel").html("Добавить новую почту");

        $(".email_inp_wrap").html('<input type="email" aria-describedby="emailHelp" class="form-control form-control-sm form-control-n" autocomplete="off" name="email_add_inp" id="email_add_inp" placeholder="" required="">' +
            '<div class="invalid-feedback">\n' +
            'Введите email\n' +
            '</div>');

        $(".modal-footer_btn").html("<button type='submit' id='email_add_form' class='btn btn-primary'>Добавить</button>");
    } else if(id == "email_edit"){

        $("#exampleModalLabel").html("Редактировать почту");

        $(".email_inp_wrap").html('<input type="email" aria-describedby="emailHelp" class="form-control form-control-sm form-control-n" autocomplete="off" name="email_edit_inp" id="email_edit_inp" placeholder="" required="" value="'+email+'">' +
            '<input type="hidden" id="email_edit_inp_id" value="'+email_id+'" />'+
            '<div class="invalid-feedback">\n' +
            'Измените email\n' +
            '</div>');

        $(".modal-footer_btn").html("<button type='submit' id='email_edit_form' class='btn btn-primary'>Редактировать</button>");
    } else if(id == "email_del"){
        if(confirm('Вы точно хотите удалить?')){
            email_del_f(email_id);
        }
    }
}




function email_add_f(){
    $.ajax({
        url: "/include/email.php",
        method: "POST",
        data: "status=new"+"&email="+$("#email_add_inp").val(),
        success: function (data) {
            $(".table_email").append("<tr><td>" +
                "<span class='email_pp'>"+($(".table_email").find("tr").length+1)+"</span>" +
                "<input type='hidden' value='"+JSON.parse(data)[0].email+"' id='email_inp_"+JSON.parse(data)[0].id+"'/>" +
                "<input type='hidden' value='"+JSON.parse(data)[0].id+"' id='email_inp_id_"+JSON.parse(data)[0].id+"'/>" +
                "</td>" +
                "<td><span class='text_email' id='text_email_"+JSON.parse(data)[0].id+"'>"+JSON.parse(data)[0].email+"</span></td>" +
                "<td><span class='btn_p' data-toggle='modal' data-target='#exampleModal' onClick='popup_f(\"email_edit\", $(\"#email_inp_"+JSON.parse(data)[0].id+"\").val(), $(\"#email_inp_id_"+JSON.parse(data)[0].id+"\").val())'>Изменить</span></td><td><span class='btn_p' onClick='popup_f(\"email_del\", false, "+JSON.parse(data)[0].id+")'>Удалить</span></td></tr>");
        }
    })
}



function email_edit_f(){
    $.ajax({
        url: "/include/email.php",
        method: "POST",
        data: "status=edit"+"&email="+$("#email_edit_inp").val()+"&id="+$("#email_edit_inp_id").val(),
        success: function (data) {
            $("#email_inp_"+JSON.parse(data)[0].id).val(JSON.parse(data)[0].email);
            $("#text_email_"+JSON.parse(data)[0].id).html(JSON.parse(data)[0].email);
        }
    })
}

function email_del_f(id) {
    $.ajax({
        url: "/include/email.php",
        method: "POST",
        data: "status=del"+"&id="+id,
        success: function (data) {
            $("#text_email_"+id).parent().parent().remove();
            var i = 1;
            $(".email_pp").each(function(){
                $(this).html(i);
                i++;
            })
        }
    })
}
var t = 0;
var theme = "";
var msg = "";
var temp_send_wrap = $("#msg_wrap").html();
function send_post(){
    if($(".text_email")[t] != undefined) {
        if(t == 0){
            $("#email_table_add").hide();
            $(".btn_p").hide();
            theme = $("#theme").val();
            msg = $("#msg").val();
            $("#msg_wrap").html("<div class='msg_status'></div>");
            $(".msg_status").html("Идет отправка писем<span class='t2'></span>");
            cl = setInterval(t2, 500);
        }
        $.ajax({
            url: "/include/msg.php",
            method: "POST",
            data: "theme=" + theme + "&msg=" + msg + "&email=" + $(".text_email")[t].innerHTML,
            success: function (data) {
                $("#"+$(".text_email")[t].id).parent().parent().css("background-color", "#ccc");
                if($(".text_email")[t+1] != "undefined"){
                    t++;
                    send_post();
                }
            }
        })
    } else {
        if(t>0){
            $(".msg_status").html("Все письма отправлены");
            $(".msg_status").append("<br><br><button onClick='clear_msg()'>Очистить</button>");
            $("#email_table_add").show();
            $(".btn_p").show();
            t = 0;
        } else {
            $(".msg_status").html("Email отсутствуют");
            $(".msg_status").append("<br><br><button onClick='clear_msg()'>Очистить</button>");
            $("#email_table_add").show();
            $(".btn_p").show();
            t = 0;
        }
    }


}


function clear_msg(){
    $("#msg_wrap").html("");
    $("#msg_wrap").html(temp_send_wrap);

    $(".text_email").each(function(){
        $(this).parent().parent().removeAttr("style");
    })

    var forms = document.querySelectorAll('.needs-validation_msg')
    Array.prototype.slice.call(forms)
        .forEach(function (form) {
            form.addEventListener('submit', function (event) {
                console.log(event.submitter.attributes[1].nodeValue );
                console.log(!form.checkValidity());
                if (!form.checkValidity()) {
                    event.stopPropagation()
                } else {
                    if(event.submitter.attributes[1].nodeValue == "send_msg"){
                        send_post();
                    }
                }
                event.preventDefault()
                form.classList.add('was-validated')
                event.preventDefault()
            }, false)
        })

}
function t2(){
    if($(".t2").html() != undefined){
        if($(".t2").html() == "."){
            $(".t2").html("..");
        } else if($(".t2").html() == ".."){
            $(".t2").html("...");
        } else {
            $(".t2").html(".");
        }
    } else {
        clearInterval(cl);
    }
}

var cl = "";

get_email();


(function () {
    'use strict'

    // Получите все формы, к которым мы хотим применить пользовательские стили проверки Bootstrap
    var forms = document.querySelectorAll('.needs-validation')

    // Зацикливайтесь на них и предотвращайте отправку
    Array.prototype.slice.call(forms)
        .forEach(function (form) {
            form.addEventListener('submit', function (event) {
                if (!form.checkValidity()) {
                    event.stopPropagation()
                } else {
                    if(event.submitter.attributes[1].nodeValue == "email_add_form"){
                        email_add_f();
                    } else if(event.submitter.attributes[1].nodeValue == "email_edit_form"){
                        email_edit_f();
                    } else if(event.submitter.attributes[1].nodeValue == "send_msg"){
                        send_post();
                    }
                    $('#exampleModal').click();
                }
                event.preventDefault()

                form.classList.add('was-validated')
                event.preventDefault()
            }, false)
        })
})()
