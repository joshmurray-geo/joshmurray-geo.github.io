<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Doc</title>
	<link href="./resources/css/index.css" type="text/css" rel="stylesheet">
</head>
<body>	
	<div id="container">
    	  	<div class="blob">
			Hello, today is <?php echo date('l, F jS, Y'); ?>.
      And here is my test file: 
      <?php
      echo file_get_contents("test.txt");
      ?>
  			</div>
  	<canvas width=1000 height=500 style="border:1px solid #000000;">
    	Your browser does not support HTML5 canvas
  	</canvas>
  	<script src="./resources/app2.js"></script>
	</div>
    <div class = "hdrImg">
      <img src="./resources/thinSection.png" alt="header" >
    </div>
  <!-- <div id="tracker"></div> -->

</body>
</html>