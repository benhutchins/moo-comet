<?php

class comet {

	var $type, $name;

	function __construct($type=null, $name=null) {

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

		$this->type = $type;
		$this->name = $name;

		if (!headers_sent() && $this->type == 2) {
			header("Content-type: application/x-dom-event-stream");
		}

	}

	function push($data) {

		switch($this->type){
			case 1:
				echo "<end />".$data;
				echo str_pad('',4096)."\n";
				break;
					
			case 2:
				print "Event: $name\n";
				print "data: $data\n\n";
				break;
				
			case 3:
				print "<script type=\"text/javascript\">parent._cometObject.fireEvent('onPush', ['$data']);</script>";
				break;
		}

		ob_flush();
		flush();

		usleep(10000); // sleep 10ms to unload the CPU

	}
};
