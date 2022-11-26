<?php
    include "cnf.php";
    include "db.php";
    $pwd = hash('sha256', md5($_POST['password']));
    $stmt = $db->query("SELECT * FROM users WHERE login='".$_POST["login"]."' AND password='".$pwd."'");
    $check_pwd = 0;
    $row = $stmt->fetch(PDO::FETCH_LAZY);
    if( $row->id != ""){
        $check_pwd = 1;
        $id = $row->id;
    }
    $arr_res["auth"] = 0;

    if ($check_pwd  == 0) {
        $db->query("INSERT INTO users (login, password) VALUES ('".$_POST["login"]."', '".$pwd."')");
        $id = $db->lastInsertId();
        $_SESSION["start"] = time()+(60*60);
        $_SESSION["auth"] = 1;
        $_SESSION["id"] = $id;
        header('Location: /success.phtml');
    } else {

        $_SESSION["auth"] = 1;
        $_SESSION["start"] = time()+(60*60);
        $_SESSION["id"] = $id;
        header('Location: /index.phtml');
    }