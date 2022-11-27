<?php
    header("Content-type: text/html; charset=utf-8");
    try {
        $db = new PDO('mysql:host=localhost;dbname=almsit_bd', 'almsit_bd', 'F0krm&D1');
    } catch (PDOException $e) {
        print "Error!: " . $e->getMessage();
        die();
    }