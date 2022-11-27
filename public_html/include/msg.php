<?php
    //ini_set('display_errors', '1');
    //ini_set('display_startup_errors', '1');
    //error_reporting(E_ALL);


    //Import PHPMailer classes into the global namespace//These must be at the top of your script, not inside a function
    use PHPMailer\PHPMailer\PHPMailer;
    use PHPMailer\PHPMailer\SMTP;
    use PHPMailer\PHPMailer\Exception;

    //Load Composer's autoloader
    require'../vendor/autoload.php';


    include "db.php";

    $email = $_POST['email'];

    $title = $_POST["theme"];
    $body = $_POST["msg"];

    $file = "";
    $status = "";
    if(isset($_FILES['myfile'])){
        $file = $_FILES['myfile'];
    }

    //Create an instance; passing `true` enables exceptions
    $mail = new PHPMailer(true);
    try {
        $mail->isSMTP();
        $mail->CharSet = "UTF-8";
        $mail->SMTPAuth   = true;
        //$mail->SMTPDebug = 2;
        $mail->Debugoutput = function($str, $level) {$GLOBALS['status'][] = $str;};

        // Настройки вашей почты
        $mail->Host       = 'smtp.yandex.ru'; // SMTP сервера вашей почты
        $mail->Username   = 'marketbox-20@marketbox.ru'; // Логин на почте
        $mail->Password   = '2021Marketbox2021'; // Пароль на почте
        $mail->SMTPSecure = 'ssl';
        $mail->Port       = 465;
        $mail->setFrom('marketbox-20@marketbox.ru', 'Тестовое письмо'); // Адрес самой почты и имя отправителя

        // Получатель письма
        $mail->addAddress($email);


        // Прикрипление файлов к письму
        if (!empty($file['name'][0])) {
            for ($ct = 0; $ct < count($file['tmp_name']); $ct++) {
                $uploadfile = tempnam(sys_get_temp_dir(), sha1($file['name'][$ct]));
                $filename = $file['name'][$ct];
                if (move_uploaded_file($file['tmp_name'][$ct], $uploadfile)) {
                    $mail->addAttachment($uploadfile, $filename);
                    $rfile[] = "Файл $filename прикреплён";
                } else {
                    $rfile[] = "Не удалось прикрепить файл $filename";
                }
            }
        }
    // Отправка сообщения
        $mail->isHTML(true);
        $mail->Subject = $title;
        $mail->Body = $body;
        print_r($mail->ErrorInfo);
    // Проверяем отравленность сообщения
        if ($mail->send()) {$result = "success";}
        else {$result = "error";}

    } catch (Exception $e) {
        $result = "error";
        $status = "Сообщение не было отправлено. Причина ошибки: {$mail->ErrorInfo}";
    }

    // Отображение результата
    echo json_encode(["result" => $result, "resultfile" => $rfile, "status" => $status]);
    sleep(3);