<?php 

set_time_limit(0);

require_once ("comet.php");

$comet = new comet();

while(true){
	$comet->push(time());
	sleep(1);
}
