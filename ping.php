<?php 

set_time_limit(0);

require_once ("comet.php");

while(true){
	push(time());
	sleep(1);
}
