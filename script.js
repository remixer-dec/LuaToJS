window.onload = function(){ 
      luac = CodeMirror.fromTextArea(lua,{mode:'lua',theme:'default',lineNumbers: true,styleActiveLine: true,matchBrackets: true});
      jsc = CodeMirror.fromTextArea(js,{mode:'javascript',theme:'default',lineNumbers: true,styleActiveLine: true,matchBrackets: true});
}
function tr(){
	var l = luac.getValue();
	af = arrfix.value;
	l = l.replace(/:/img,'.');
	l = l.replace(/--\[\[/img,'/*');
	l = l.replace(/--\]\]/img,'*/');
	l = l.replace(/\[\[|\]\]/img,'`');
	//l = l.replace(/\{([^=\n]+)\}/img,'[$1]'); //old array convertor
	l = objectConvertor(l)
	l = l.replace(/--/img,'//');
	l = l.replace(/if ?([^\(].+?) then/img,'if($1){');
	l = l.replace(/else(\s)(?!if)/img,'}else{$1');
	l = l.replace(/else\s?if/img,'}else if');
	l = l.replace(/then/img,'{');
	l = l.replace(/while ?([^\(].+?) do/img,'while($1){');
	l = l.replace(/repeat/img,'do');
	l = l.replace(/until ([^\n]+)/img,'while ($1);');
	l = l.replace(/for (([a-z0-9_]+) ?= ?-?([0-9a-z_\[\]\(\).+\-*]+)) ?, ?([0-9a-z_\[\]\(\).+\-*]+)\s*\n?do/gim,'for(var $1; $2<$4; $2++){')
	l = l.replace(/for (([a-z0-9_]+) ?= ?-?([0-9a-z_\[\]\(\).+\-*]+)) ?, ?([0-9a-z_\[\]\(\).+\-*]+) ?, ?(-?[0-9])+\s*\n?do?/img,'for(var $1; $2'+(parseInt('$5')>0?'<':'>')+'$4; $2+=$5){')
	l = l.replace(/for (([a-z0-9_]+) ?= ?-?([0-9a-z_\[\]\(\).+\-*]+)) ?, ?\#([0-9a-z_\[\]\(\).+\-*]+)\s*\n?do/img,'for(var $1; $2<$4.length; $2++){')
	l = l.replace(/for ([a-z0-9_]+) ?, ?([a-z0-9_]+) in i?pairs\(([a-z0-9_\[\]\(\).+\-*]+)\)\s*\n?do/img,'for(var $1 in $3){var $2=$3[$1];')
	l = l.replace(/ or /img,' || ');
	l = l.replace(/ and /img,' && ');
	l = l.replace(/(\s)?not /img,'$1!');
	l = l.replace(/~=/img,'!=');
	l = l.replace(/([^\.])\.\.([^\.])/img,'$1+$2');
	l = l.replace(/\.\.\./img,'...arg');
	l = l.replace(/(function[^\)]+\))/img,'$1{');
	l = l.replace(/(\n|\s)end/img,'$1}');
	l = l.replace(/math\./img,'Math.');
	l = l.replace(/nil/img,nilfix.value);
	l = oneLineVars(l,l.match(/(([a-z0-9_]+)\s?,\s?)+([a-z0-9_]+)\s?=\s?(.+)$/img));
	
	if(af == 2){
		l = l.replace(/for\(([a-z0-9_]+)=1;/img,'for($1=0;');
	}
	if(luafilesfix.value == 1){
		l = l.replace(/\.lua/img,'.js');
	}
	if(vrfix.value == 1){
		l = l.replace(/local (?!function)/img,'var ');
	} else{
		l = l.replace(/local /img,'');
	}
	jsc.setValue(l);
}

/**
 * { deals with multiple variables assigned in one line }
 *
 * @param      {string}  l       { full lua code }
 * @param      {string}  mtch    { matching lines of code }
 * @note this function will crash if there is a table or a string with comas inside multi-var assignment
 */
function oneLineVars(l,mtch){
	for(var i = 0; mtch != null && mtch[i] != "" && mtch[i] != undefined; i++){
		var s = mtch[i].split("=");
		var vars = s[0].split(',');
		var vals = s[1].split(',');
		var result = 'var';
		var j = 0;
		for(var v of vars){
			result+=` ${v} = ${vals[j]},`;
			j++;
		}
		result = result.substr(0,result.length-1);
		l = l.replace(mtch[i],result);
	}
	return l;
}

/**
 * { converts tables to objects and arrays }
 *
 * @param      {string}  t       { lua code }
 */
function objectConvertor(t){ 
	try{
	var flvl = 0,phr = '', olvl=[0,0,0,0,0,0,0,0,0,0,0,0,0,0],oinfo = [[]],line=0,isstr=!!0;
	for(var l of t){
		phr+=l;
		switch(l){
			case "'"://this solution is not very good, something like "'" will crash it
			case '"':
			case '`':
				isstr = isstr ? !!0 : !0;
				//string detection
			break;
		}
		if(!isstr){
		switch(l){
			case "{":
				olvl[flvl]++;
				oinfo[flvl][olvl[flvl]] = {open:phr.length-1,isarr:true};
			break;
			case "}":
				if(!oinfo[flvl][olvl[flvl]]){
					if(confirm('Looks like a function detection error, try to fix it?')){
						console.log('function forced END flvl'+flvl+' line'+line)
						flvl--;
					}
				}
				if(oinfo[flvl][olvl[flvl]].isarr){
					if(etfix.value==2&&phr.length-oinfo[flvl][olvl[flvl]].open<3){olvl[flvl]--;break;}
					phr = phr.split('');
					phr[oinfo[flvl][olvl[flvl]].open] = '[';
					if(af == 1){
						phr[oinfo[flvl][olvl[flvl]].open]+='undefined,'
					}
					phr = phr.join('');
					phr = phr.substr(0,phr.length-1) + ']';
				}
				olvl[flvl]--;
			break;
			case "\n":
				line++;
			break
			case "n":
				if(phr.substr(-8,8) == 'function') {flvl++;console.log('function START flvl'+flvl+' line'+line);oinfo.push([])}
				if(phr.substr(-6,6) == 'return') {console.log('function END flvl'+flvl+' line'+line);flvl>0?flvl--:false;} // temporary solution // might cause errors if fucntion contains multiple returns or is on 1 line
			break
			case "=":
				if(olvl[flvl] > 0){
					oinfo[flvl][olvl[flvl]].isarr = false;
					phr = phr.substr(0,phr.length-1) + ':';
				}
			break;
			case ";":
				if(olvl[flvl] > 0){
					phr = phr.substr(0,phr.length-1) + ',';
				}
			break;
		}
		}
	}
	} catch(e){alert('Error: '+e+' on line '+line);console.log(flvl);console.log(olvl);console.log(oinfo)}
	return phr;
}
      