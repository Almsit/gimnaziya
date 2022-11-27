<?php
    header("Content-type: text/html; charset=utf-8");
    try {
        $db = new PDO('mysql:host=localhost;dbname=', '', '');
    } catch (PDOException $e) {
        print "Error!: " . $e->getMessage();
        die();
    }