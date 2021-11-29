<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'phpmailer/src/Exception.php';
require 'phpmailer/src/PHPMailer.php';

$mail = new PHPMailer(true);
$mail->CharSet='UTF-8';
$mail->setLanguage('ru','phpmailer/language/');
$mail->IsHTML(true);

$mail->setFrom('submission@form_receiver.com', 'Сервер форм');
$mail->addAddress('devilmahnew@gmail.com', 'Devil Mahiru');
$mail->Subject = 'Новая форма';

$body='<h1>С вашего сайта была отправлена форма</h1>';

if(trim(!empty(&_POST['name'])))
{
    $body.='<p><strong> Имя :</strong> '&_POST['name'].'</p>';
}
if(trim(!empty(&_POST['lastName'])))
{
    $body.='<p><strong> Фамилия :</strong> '&_POST['lastName'].'</p>';
}
if(trim(!empty(&_POST['email'])))
{
    $body.='<p><strong> Email :</strong> '&_POST['email'].'</p>';
}
if(trim(!empty(&_POST['bio'])))
{
    $body.='<p><strong> Биография :</strong> '&_POST['bio'].'</p>';
}

&mail->Body=&body;

if(!&mail->send())
{
    &message='Ошибка';
}else
{
    &message='Данные отправлены';
}

&responce=['message'=>&message];

header('Content-type: application/json');
echo json_encode(&response);
?>
