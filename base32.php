function base32decode($data) {	
	//decode to binary stream
	$letters=[
		"0"=>'00000',
		"O"=>'00000',
		"1"=>'00001',
		"I"=>'00001',
		"L"=>'00001',
		"2"=>'00010',
		"3"=>'00011',
		"4"=>'00100',
		"5"=>'00101',
		"S"=>'00101',
		"6"=>'00110',
		"7"=>'00111',
		"8"=>'01000',
		"9"=>'01001',
		"A"=>'01010',
		"B"=>'01011',
		"C"=>'01100',
		"D"=>'01101',
		"E"=>'01110',
		"F"=>'01111',
		"G"=>'10000',
		"H"=>'10001',
		"J"=>'10010',
		"K"=>'10011',
		"M"=>'10100',
		"N"=>'10101',
		"P"=>'10110',
		"Q"=>'10111',
		"R"=>'11000',
		"T"=>'11001',
		"U"=>'11010',
		"V"=>'11011',
		"W"=>'11100',
		"X"=>'11101',
		"Y"=>'11110',
		"Z"=>'11111'
	];
	$bitStream='';
	for ($i=0;$i<strlen($data);$i++) {
		$bitStream.=$letters[$data[$i]];
	}
	
	//decode to stringified json
	$json='';
	$bit6='0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
	$bit9='[]{}":,_';
	$bit11=' !#$%&\'()*+-./;<=>?@\^`|~';
	while (strlen($bitStream)>5) {
		
		//see if 6bit character
		$chr=bindec(substr($bitStream,0,6));
		if ($chr<62) {
			$json.=$bit6[$chr];
			$bitStream=substr($bitStream,6);
			continue;
		}
		
		//see if 9bit character
		if ($chr==62) {
			$json.=$bit9[bindec(substr($bitStream,6,3))];
			$bitStream=substr($bitStream,9);
			continue;
		}
		
		//see if 11bit character
		$chr=bindec(substr($bitStream,6,5));
		if ($chr<26) {
			$json.=$bit11[$chr];
			$bitStream=substr($bitStream,11);
			continue;
		}
		
		//see if ascii character
		if ($chr==26) {
			$json.=chr(bindec(substr($bitStream,11,4)));
			$bitStream=substr($bitStream,16);
			continue;			
		}
		if ($chr>27) {
			$json.=chr(bindec(substr($bitStream,8,8)));
			$bitStream=substr($bitStream,16);
			continue;			
		}
		
		//must be unicode
		$chr=bindec(substr($bitStream,11,16));
		if ($chr<2048) {	//2 byte
			// ******************* decode unicode here
		
			$bitStream=substr($bitStream,32);
			continue;			
		}
		$chr=bindec(substr($bitStream,11,24));
		if ($chr<65536) {	//3 byte
			// ******************* decode unicode here
		
			$bitStream=substr($bitStream,40);
			continue;		
		}
		$chr=bindec(substr($bitStream,11,32));
		// ******************* decode unicode here
		
		$bitStream=substr($bitStream,48);	
	}
	return json_decode($json,true);
}
