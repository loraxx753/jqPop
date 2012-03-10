<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>untitled</title>
<link rel="stylesheet" href="../css/jqmodal.css" />
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
<script src="../js/jqmodal.js"></script>
<script>
	$(document).ready(function() {
		$('#example').jqmodal({
			//Adds html to the popup window
			html : "<p>This is probably the most basic example. Click the button below to close.</p><p><button id='close'>Close</button>",
			//An array of selectors pointing to the things that, when clicked, will close the popup window.
			closingSelectors : ['#close'],
		});
	});
</script>
</head>
<body>
<p><a href="#" id="example">Click Me</a></p>
</body>
</html>