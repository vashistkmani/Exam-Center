<?php


  // Replace jitendrakumar.img@gmail.com with your real receiving email address
  $receiving_email_address = 'jitendrakumar.img@gmail.com';
  $to =  'jitendrakumar.img@gmail.com';
  $subject = $_POST['subject'];
  $message = "<html>
                <body>
                <p style='color:#de0c27;font-size:14px;font-weight: bold;'>From your wesbite ".$_POST['name']." wants to contact you</p>
                <table>
                <tr>
                <td style='color:#de0c27;font-size:13px;font-weight: bold;'>Name :</td>
                <td style='color:#333333;font-size:13px;'>".$_POST['name']."</td>
                </tr>
                <tr>
                <td style='color:#de0c27;font-size:13px;font-weight: bold;'>Email-id : </td>
                <td style='color:#333333;font-size:13px;'>".$_POST['email']."</td>
                </tr>
                <tr>
                <td style='color:#de0c27;font-size:13px;font-weight: bold;'>Message : </td>
                <td style='color:#333333;font-size:13px;'>".$_POST['message']."</td>
                </tr>
                <tr>
                <td> <br/><br/><br/>Thank you,<br/><br/> IMG Global Infotech Pvt. Ltd. </td>
                <td></td>
                </tr>
                </table>
                </body>
            </html>";
  $headers = "MIME-Version: 1.0" . "\r\n";
  $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
  $headers .= "From:support@imgglobalinfotech.in" . "\r\n";
  if(mail($to,$subject,$message,$headers)){
    echo 1;die;
  }
  else{
    echo 0;die;
  }
  
?>
