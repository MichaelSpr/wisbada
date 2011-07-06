
<?php
   $destination_path = getcwd().DIRECTORY_SEPARATOR;
 
   $result = 0;
 
   $target_path = $destination_path . basename( $_FILES['bild']['name']);
	echo $target_path; 
   if(@move_uploaded_file($_FILES['bild']['tmp_name'], $target_path)) {
      $result = 1;
   }
	echo $result;
 
   sleep(1);
?>

<script language="javascript" type="text/javascript">
   window.top.window.stopUpload(<?php echo $result; ?>);
</script>  
