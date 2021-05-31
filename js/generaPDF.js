var getImageFromUrl = function(url, mes, anno, callback) {
    var img = new Image();

    img.onError = function() {
        alert('Cannot load image: "'+url+'"');
    };
    img.onload = function() {
        callback(img, mes, anno);
    };
    img.src = url;
}


// Since images are loaded asyncronously, we must wait to create
// the pdf until we actually have the image.
// If we already had the jpeg image binary data loaded into
// a string, we create the pdf without delay.
var createPDF = function(/*imgData,*/ mes, anno) {
    var doc = new jsPDF('landscape');
	var mesaux=mes;
	mes=calen[mes];
    // This is a modified addImage example which requires jsPDF 1.0+
    // You can check the former one at examples/js/basic.js

    //doc.addImage(imgData, 'JPEG', 10, 10, 60, 16, 'monkey'); // Cache the image using the alias 'monkey'
    //doc.addImage(imgData, 'JPEG', 230, 181, 60, 19, 'monkey'); // Cache the image using the alias 'monkey'
    doc.setFontSize(16);doc.setFontType("bold");doc.text(15, 18, mes.NombreMes);
    doc.line(10, 20, 290, 20);
    doc.line(10, 20, 10, 180);
    doc.line(10, 180, 290, 180);
    doc.line(290, 20, 290, 180);
    doc.line(10, 30, 290, 30);
    var nomdiaSem=['LU','MA','MI', 'JU', 'VI','SA','DO'];
	for(var i=0;i<7;i++){
    	doc.line(10+(i+1)*40, 20, 10+(i+1)*40, 180);
    	if(i>4){
    		//doc.setDrawColor(150,150,150);
    		doc.setFillColor(200,200,200);
		doc.rect(10+i*40, 20, 40, 10, 'FD');
    	}
    	doc.text(14+i*40, 27, nomdiaSem[i]);
    }
    for(var i=0;i<6;i++){
    	doc.line(10, 30+(i+1)*25, 290, 30+(i+1)*25);
    }
    doc.setFontSize(10);
	var nsemana=0;
	var ndiasem=mes.diaIn-1;
	if (ndiasem<0)ndiasem+=7;
	var diaIn=mes.diaIn;
		if (diaIn==0)diaIn=7;
		/*for(var i=1;i<diaIn;i++){
			texto+='<td width="14%"></td>';
		}*/
	textoLuna='';
	var diaMesFin=0;
	
	for(var i=0;i<mes.dias;i++){
		var dii=i+1;
		if(mes.arrayMes[i].diaSem==6){
			doc.setFillColor(200,200,200);doc.rect(10+ndiasem*40, 30+nsemana*25, 40, 25, 'FD');
			doc.setFontType("bold");doc.setFontSize(12);	
			var aux=(('  ')+mes.arrayMes[i].dia); aux=aux.substring(aux.length-2);doc.text(45+ndiasem*40, 34+nsemana*25, aux);
			var naux=listaReserva[lisi].split('<br>');
			for(var j=0;j<naux.length;j++){//alert(naux[j]);
				if(naux[j]!='&nbsp;'){
					doc.setFontType("normal");doc.setFontSize(10);doc.text(11+ndiasem*40, 38+nsemana*25+j*4,naux[j]);
				}
			}
			
		}else if((mes.arrayMes[i].diaSem==0)||mes.arrayMes[i].festivo){
			doc.setFillColor(200,200,200);doc.rect(10+ndiasem*40, 30+nsemana*25, 40, 25, 'FD');
			doc.setFontType("bold");doc.setFontSize(12);	
			var aux=(('  ')+mes.arrayMes[i].dia); aux=aux.substring(aux.length-2);doc.text(45+ndiasem*40, 34+nsemana*25, aux);
			if(mes.arrayMes[i].diaSem==0){
				nsemana++;
				ndiasem=-1;
				lisi++;
				if (lisi==listaFeaLong)lisi=0;
			}

		} else{
			doc.setFontType("bold");doc.setFontSize(12);	
			var aux=(('  ')+mes.arrayMes[i].dia); aux=aux.substring(aux.length-2);doc.text(45+ndiasem*40, 34+nsemana*25, aux);
			var naux=lista[lisi].split('<br>');
			for(var j=0;j<naux.length;j++){//alert(naux[j]);
					doc.setFontType("normal");doc.setFontSize(10);doc.text(11+ndiasem*40, 38+nsemana*25+j*4,naux[j]);
			}
		}
		ndiasem++;
		diaMesFin=mes.arrayMes[i].diaSem;
		
	}
	if((diaMesFin==0)||(diaMesFin==6)){//sabado o domingo
	}else{//finaliza en otro tipo de día se añaden los reservas en el resto blanco
		doc.setFillColor(200,200,200);doc.rect(10+5*40, 30+nsemana*25, 40, 25, 'FD');
		var naux=listaReserva[lisi].split('<br>');
		for(var j=0;j<naux.length;j++){//alert(naux[j]);
			if(naux[j]!='&nbsp;'){
				doc.setFontType("normal");doc.setFontSize(10);doc.text(11+5*40, 38+nsemana*25+j*4,naux[j]);
			}
		}
	}

    doc.setFontSize(10);doc.text(10, 184, 'BLOQUES DE VALIDACIÓN');
    doc.text(15, 188, '1) Área 1: 1-3 millones.');
    doc.text(15, 192, '2) Área 1: 3-7 millones.');
    doc.text(15, 196, '3) Área 1: 7 millones en adelante + áreas 11, 15 y 16.');
    doc.text(15, 200, '4) Áreas 2, 3, 5, 7 y 17.');
    doc.text(15, 204, '5) Áreas 8, 13 y 14.');
  
    // Output as Data URI
    //doc.output('datauri');
    //doc.output('dataurlnewwindow');   //for display image in new window
	doc.output('save', 'CalValidacion'+mes.NombreMes+anno+'.pdf'); //Try to save PDF as a file (not works on ie before 10, and some mobile devices)
}


