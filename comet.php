<?php

function push($data, $type = null, $name = null){

	if ($type == null) {
		if (isset($_REQUEST['cometType'])) {
			$type = $_REQUEST['cometType'];
		} else {
			$type = 1;
		}
	}

	if ($name == null) {
		if (isset($_REQUEST['cometName'])) {
			$name = $_REQUEST['cometName'];
		} else {
			$name = "MooComet";
		}
	}

	switch($type){
		case 1:
			echo "<end />".$data;
			echo str_pad('',4096)."\n";
			break;
					
		case 2:
			header("Content-type: application/x-dom-event-stream");
			print "Event: $name\n";
			print "data: $data\n\n";
			break;
				
		case 3:
			print "<script type=\"text/javascript\">parent._cometObject.fireEvent('onPush', ['$data']);</script>";
			break;
	}

	ob_flush();
	flush();
}

