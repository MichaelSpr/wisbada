<?php
   $destination_path = getcwd().DIRECTORY_SEPARATOR;

   $result = 0;
 $time = time();
   $target_path = $destination_path ."../pics/".$time."-". basename( $_FILES['bild']['name']);
   $url = dirname($_SERVER["REQUEST_URI"]) . '/../pics/'.$time ."-". basename( $_FILES['bild']['name']);;
if(true == startsWith($_FILES['bild']['type'],"image")){
        if(@move_uploaded_file($_FILES['bild']['tmp_name'], $target_path)) {
        $result = 1;
        }
}

function startsWith($haystack, $needle)
{
    $length = strlen($needle);
    return (substr($haystack, 0, $length) === $needle);
}
?>

<script language="javascript" type="text/javascript">
   window.top.window.stopUpload(<?php echo $result; ?>, '<?php echo $url; ?>');
</script>