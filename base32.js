	//base32 - Copyright (c) 2018 Matthew Cornelisse
	var bit6alphabet='0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'	//1 missing intentionally encoded as 000000 to 111110
	var bit9alphabet='[]{}":,';															//1 missing intentionally encoded as 111111000 to 111111110
	var bit5alphabet='0123456789ABCDEFGHJKMNPQRTUVWXYZ';
	var bit11alphabet=' !#$%&\'()*+-./;<=>?@\^`|~';
	function base32encode(data) {
	
		//encode data into binary string
		var toStream=function(letter) {
			//see if 6 bit
			var chr=bit6alphabet.indexOf(letter);
			if (chr!=-1) return chr.toString(2).padStart(6,"0");
			
			//see if 9 bit
			var chr=bit9alphabet.indexOf(letter);
			if (chr!=-1) return '111110'+chr.toString(2).padStart(3,"0");
			
			//see if 11 bit
			var chr=bit11alphabet.indexOf(letter);
			if (chr!=-1) return '111111'+chr.toString(2).padStart(5,"0");
			
			//convert ascii characters
			var chr=letter.codePointAt(pos);
			if (chr<32) return '11111111010'+chr.toString(2).padStart(5,"0");			//bottom 32 of ascii chart
			if (chr<256) return '11111111'+chr.toString(2).padStart(8,"0");				//top half of asci chart
			
			//convert utf-8 characters
			if (chr<2048) return '11111111011'+chr.toString(2).padStart(16,"0");		//2 byte codes
			if (chr<65536) return '11111111011'+chr.toString(2).padStart(24,"0");		//3 byte codes
			return '11111111011'+chr.toString(2).padStart(32,"0");						//4 byte codes
		}
		var str=JSON.stringify(data);													//encode data into a string
		var bitStream='';
		for (var i=0;i<str.length;i++) {												//go through each letter one at a time
			bitStream+=toStream(str[i]);												//convert to variable length binary
		}
		bitStream=bitStream.padEnd(Math.ceil(bitStream.length/5)*5,'0');				//make sure bit stream multiple of 5 bits									
		
		//encode binary into base 32
		var encoded='';
		for (var i=0;i<bitStream.length;i+=5) {											//go through each block of 5 bits
			var value=parseInt(bitStream.substr(i,5),2);								//convert each block of 5 bits back into an integer
			encoded+=bit5alphabet[value];												//look up proper letter to use for that value
		}
		return encoded;
	} 
	
	
	
	function base32decode(data) {
		//auto convert common mistakes
		data=data.replace('I','1').replace('L','1').replace('O','0').replace('S','5');
		
		//decode to binary stream
		var bitStream='';
		for (var i=0;i<data.length;i++) {
			bitStream+=bit5alphabet.indexOf(data[i]).toString(2).padStart(5,'0');
		}
		
		//decode to stringified json
		var json='';
		while (bitStream.length>5) {
			
			//see if 6bit character
			var chr=parseInt(bitStream.substr(0,6),2);
			if (chr<62) {
				json+=bit6alphabet[chr];
				bitStream=bitStream.substr(6);
				continue;
			}
			
			//see if 9bit character
			if (chr==62) {
				json+=bit9alphabet[parseInt(bitStream.substr(6,3),2)];
				bitStream=bitStream.substr(9);
				continue;
			}
			
			//see if 11bit character
			chr=parseInt(bitStream.substr(6,5),2);
			if (chr<26) {
				json+=bit11alphabet[chr];
				bitStream=bitStream.substr(11);
				continue;
			}
			
			//see if ascii character
			if (chr==26) {
				json+=String.fromCharCode(parseInt(bitStream.substr(11,4),2));
				bitStream=bitStream.substr(16);
				continue;			
			}
			if (chr>27) {
				json+=String.fromCharCode(parseInt(bitStream.substr(8,8),2));
				bitStream=bitStream.substr(16);
				continue;			
			}
			
			//must be unicode
			chr=parseInt(bitStream.substr(11,16),2);
			if (chr<2048) {	//2 byte
				json+=String.fromCharCode(chr);
				bitStream=bitStream.substr(32);
				continue;			
			}
			chr=parseInt(bitStream.substr(11,24),2);
			if (chr<65536) {	//3 byte
				json+=String.fromCharCode(chr);
				bitStream=bitStream.substr(40);
				continue;		
			}
			chr=parseInt(bitStream.substr(11,32),2);
			json+=String.fromCharCode(chr);
			bitStream=bitStream.substr(48);	
		}
		return JSON.parse(json);
		
	}