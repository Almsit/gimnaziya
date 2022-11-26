<?php
    include "db.php";
    if($_POST["status"] == "get_list"){
        $emails = $db->query("SELECT * FROM emails");
        $i = 0;
        while($row = $emails->fetch(PDO::FETCH_LAZY)){
            $arr[$i]["id"] = $row->id;
            $arr[$i]["email"] = $row->email;
            $i++;
        }
    } else if($_POST["status"] == "new"){
        $emails = $db->query("INSERT INTO emails (email) VALUES ('".$_POST["email"]."')");
        $id = $db->lastInsertId();
        $arr[0]["id"] = $id;
        $arr[0]["email"] = $_POST["email"];
    } else if($_POST["status"] == "edit"){
        $emails = $db->query("UPDATE emails SET email='".$_POST["email"]."' WHERE id='".$_POST["id"]."'");
        $id = $db->lastInsertId();
        $arr[0]["id"] = $_POST["id"];
        $arr[0]["email"] = $_POST["email"];
    } else if($_POST["status"] == "del"){
        $emails = $db->query("DELETE FROM emails WHERE id='".$_POST["id"]."'");
        $arr[0]["id"] = $_POST["id"];
    }
    print_r(json_encode($arr));