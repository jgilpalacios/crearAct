class Calendario{
    

    constructor() {
		alert('HHH');
        this.fecha=new Date();
        this.dFestivo=[]//espacio para almacenar los festivos
        this.calen;//array con todo el año
		alert('HHH: '+JSON.stringify(this.fecha));
    }
	
	HABLA(){
		alert(JSON.stringify(this.fecha))
	}
	
	//var lisi=0;
	//var num_ord=true;
	//var lista=new Array();
	//var listaFEA=new Array('Dra. Cabrejas','Dra. Donoso'/*,'Dra. Fuente'*/,'Dra. Bornstein', 'Dra. Izquierdo' /*Hernández''Dr. Granado','Dra. Mirabent'*/,'Dra. Orea', 'Dra. Pérez','Dra. Ramírez', 'Dra. Silvestre');
	//var listaFeaLong=8/*6, 7, 8*/;//el total de participantes (listaFEA.long)
	//var listaDiaria=5;//los que se asignan cada día
	//var listaVacia=new Array('&nbsp;<br>&nbsp;<br>&nbsp;');
	//var listaReserva=new Array('&nbsp;<br>');
		

	

	ponFestivo(dia,mes){
		dFestivo[31*(mes-1)+dia]=true;
	}

	Dia(dia,mes,anno,diaSem,festivo,luna){
		this.dia=dia;
		this.mes=mes-1;
		this.anno=anno;
		this.diaSem=diaSem;
		this.festivo=festivo;
		this.luna=luna;
	}

	Luna(mes,anno){
		annos=anno-2001
		if(anno<=1582){
			diasbis=parseInt(annos/4)+13;//los 3 bisiestos seculares 1700,1800,1900 más los 10 dias suprimidos.
		}else diasbis=parseInt(annos/4)-parseInt(annos/100)+parseInt(annos/400);
		diasmes=0;
		for(var i=0;i<mes-1;i++)diasmes+=DiasMes(i,anno)
		dias=annos*365+diasbis+diasmes;
		//alert('dias: '+dias+' meseslun: '+parseInt(dias/29.530588)+' resto: '+(dias-parseInt(dias/29.530588)*29.530588));
		luna=dias-parseInt(dias/29.530588)*29.530588-6;//posición en el mes lunar <=1 luna llena
		while(luna<0)luna=luna+29.530588;
		return luna;
	}

	DiasMes(mes,anno){
		switch(mes-1){
			case 0:return 31;
			case 1:if(Bisiesto(anno)) return 29;
								else return 28;
			case 2:return 31;
			case 3:return 30;
			case 4:return 31;
			case 5:return 30;
			case 6:return 31;
			case 7:return 31;
			case 8:return 30;
			case 9:if(anno==1582)return 21;
					else return 31;
			case 10:return 30;
			case 11:return 31;
		}
	}

	NombreMes(mes){
		switch(mes-1){
			case 0:return 'Enero';
			case 1:return 'Febrero';
			case 2:return 'Marzo';
			case 3:return 'Abril';
			case 4:return 'Mayo';
			case 5:return 'Junio';
			case 6:return 'Julio';
			case 7:return 'Agosto';
			case 8:return 'Septiembre';
			case 9:return 'Octubre';
			case 10:return 'Noviembre';
			case 11:return 'Diciembre';
		}
	}
	
	Mes(mes,anno){

		fecha=new Date(anno,mes-1,1);
		this.diaIn=fecha.getDay();
		if(anno<1582||(anno==1582&&(mes-1)<10)){
			this.diaIn+=10;//los de la correccion gregoriana
			this.diaIn-=parseInt((1599-anno)/100);//correccion de los bisiestos acumulados
			this.diaIn+=parseInt((1599-anno)/400);//no se quitan los multiplos de 400
			if((anno%100==0)&&(anno%400!=0)&&(mes-1)<2)this.diaIn-=1;//correccion del bisiesto en curso
			this.diaIn=this.diaIn%7;
			
		}
		while(this.diaIn<0)this.diaIn+=7;
		this.NombreMes=NombreMes(mes);
		this.dias=DiasMes(mes,anno);
		this.arrayMes=new Array(this.dias);
		diaAux=this.diaIn;
		luna=Luna(mes,anno);
		//alert(mes+': '+luna);
		for(var i=0;i<this.dias;i++){
			diaAux=(diaAux)%7;
			if(anno==1582&&mes==9&&i>3)
				this.arrayMes[i]=new Dia(i+11,mes,anno,diaAux++,Festivo(i+11,mes,anno),luna);
			else
				this.arrayMes[i]=new Dia(i+1,mes,anno,diaAux++,Festivo(i+1,mes,anno),luna);
			luna=luna+1;
			if (luna>29.530588) luna=luna-29.530588
		}
			
	}

	Festivo(dia,mes,anno){
		if(dFestivo[31*(mes-1)+dia]==true)return true;
		else return false;
	}

	EscribeMes(mes, anno){
		//alert(mes);
		var mesaux=mes-1;
		mes=calen[mes-1];//new Mes(mes,anno);
		//alert(mes+'; '+mes.NombreMes);
		var texto=mes.NombreMes+'<table border="1" cellpadding="0" cellspacing="0" style="border-collapse: collapse" bordercolor="#111111" width="100%" id="AutoNumber1">';
		texto+='<tr><td width="14%">LU</td><td width="14%">MA</td><td width="14%">MI</td><td width="14%">JU</td><td width="14%">VI</td><td width="14%"><font color="#00FF00">SA</font></td><td width="14%"><font color="#FF0000">DO</font></td></tr><tr>';
		var diaIn=mes.diaIn;
		if (diaIn==0)diaIn=7;
		for(var i=1;i<diaIn;i++){
			texto+='<td width="14%"></td>';
		}
		textoLuna='';
		var textoCumple1='<span style="color: rgb(255, 102, 0);" onclick="alert(\'cumple\')">';
		var textoCumple2='</span>';
		for(var i=0;i<mes.dias;i++){
			if(Cumpleannos[mesaux]!=null){
				if(Cumpleannos[mesaux][mes.arrayMes[i].dia]!=null){
					textoCumple1='<b><span style="cursor: pointer; color: rgb(255, 102, 0);" onclick="alert(\''+Cumpleannos[mesaux][mes.arrayMes[i].dia]+'\')">';
					textoCumple2='</span></b>';
				}else {
					textoCumple1='';
					textoCumple2='';
				}
			}else {
				textoCumple1='';
				textoCumple2='';
			}////////
			if(AniversarioF[mesaux]!=null){
				if(AniversarioF[mesaux][mes.arrayMes[i].dia]!=null){
					textoCumple1+='<b><span style="cursor: pointer; color: rgb(0, 0, 200);" onclick="alert(\''+AniversarioF[mesaux][mes.arrayMes[i].dia]+'\')">';
					textoCumple2+='</span></b>';
				}else {
					textoCumple1+='';
					textoCumple2+='';
				}
			}else {
				textoCumple1+='';
				textoCumple2+='';
			}
			var dii=i+1;
			if(mes.arrayMes[i].luna<=1)	textoLuna=' <img border="0" src="LL_1.GIF" width="20" height="20">';
			else if(mes.arrayMes[i].luna>7.382647&&mes.arrayMes[i].luna<=8.382647)	textoLuna=' <img border="0" src="CM_1.GIF" width="20" height="20">';
			else if(mes.arrayMes[i].luna>14.765294&&mes.arrayMes[i].luna<=15.765294)	textoLuna=' <img border="0" src="LN_1.GIF" width="20" height="20">';
			else if(mes.arrayMes[i].luna>22.147941&&mes.arrayMes[i].luna<=23.147941)	textoLuna=' <img border="0" src="CC_1.GIF" width="20" height="20">';
			else textoLuna='';
			if(mes.arrayMes[i].diaSem==6) {if(mes.arrayMes[i].festivo) texto+='<td width="14%" bgcolor="#FF0000" onmouseover="EscribeSantos('+mesaux+', '+(mes.arrayMes[i].dia-1)+')" >'+textoCumple1+mes.arrayMes[i].dia+textoCumple2+textoLuna+'<br><input name="kk" value="kk" type="checkbox" checked="checked" onClick="calen['+mesaux+'].arrayMes['+i+'].festivo=!calen['+mesaux+'].arrayMes['+i+'].festivo;alert(ObtenSantos('+mesaux+', '+(mes.arrayMes[i].dia-1)+'))"><span style="font-size: 10pt; color: black;">festivo</span></td>';
					else texto+='<td class="celda" width="14%" bgcolor="#00FF00" onClick="alert(ObtenSantos('+mesaux+', '+(mes.arrayMes[i].dia-1)+'))" onmouseover="EscribeSantos('+mesaux+', '+(mes.arrayMes[i].dia-1)+')" >'+textoCumple1+mes.arrayMes[i].dia+textoCumple2+textoLuna+'</td>';}
				else if(mes.arrayMes[i].diaSem==0) texto+='<td class="celda" width="14%" bgcolor="#FF0000" onClick="alert(ObtenSantos('+mesaux+', '+(mes.arrayMes[i].dia-1)+'))" onmouseover="EscribeSantos('+mesaux+', '+(mes.arrayMes[i].dia-1)+')" >'+textoCumple1+mes.arrayMes[i].dia+textoCumple2+textoLuna+'</td><tr></tr>';
				else {if(mes.arrayMes[i].festivo) texto+='<td class="celda" width="14%" bgcolor="#FF0000" onmouseover="EscribeSantos('+mesaux+', '+(mes.arrayMes[i].dia-1)+')" >'+textoCumple1+mes.arrayMes[i].dia+textoCumple2+textoLuna+'<br><input name="kk" value="kk" type="checkbox" checked="checked" onClick="calen['+mesaux+'].arrayMes['+i+'].festivo=!calen['+mesaux+'].arrayMes['+i+'].festivo;alert(ObtenSantos('+mesaux+', '+(mes.arrayMes[i].dia-1)+'));"><span style="font-size: 10pt; color: black;">festivo</span></td>';
					else texto+='<td class="celda laborable" width="14%"  onmouseover="EscribeSantos('+mesaux+', '+(mes.arrayMes[i].dia-1)+')" >'+textoCumple1+mes.arrayMes[i].dia+textoCumple2+textoLuna+'<br><input name="kk" value="kk" type="checkbox" onClick="calen['+mesaux+'].arrayMes['+i+'].festivo=!calen['+mesaux+'].arrayMes['+i+'].festivo;alert(ObtenSantos('+mesaux+', '+(mes.arrayMes[i].dia-1)+'))"><span style="font-size: 10pt; color: black;">festivo</span></td>';}
		}
		texto+='</tr></table>';
		return texto;
	}

	GeneraFEA(){		
		for (var i=0;i<listaFeaLong;i++){
			lista[i]='';
			listaVacia[i]='';
			listaReserva[i]='';
			var nres=0;
			for(var j=0;j<listaDiaria/*listaFeaLong*/;j++){
				var listaAux=j-i;
				if (listaAux<0)listaAux+=listaFeaLong;
				var listaAux2=listaAux+listaDiaria;
				if ((listaAux2>listaFeaLong)||(listaAux2==listaFeaLong))listaAux2=listaAux2-listaFeaLong;
				if (num_ord){
					lista[i]+=(j+1)+'.'+listaFEA[listaAux];
					if(nres<listaFeaLong-listaDiaria) listaReserva[i]+=(j+1)+'.'+listaFEA[listaAux2];
					else listaReserva[i]+='&nbsp;';
				}else {
					lista[i]+=listaFEA[listaAux];
					if(nres<listaFeaLong-listaDiaria) listaReserva[i]+=listaFEA[listaAux2];
					else listaReserva[i]+='&nbsp;';
				}
				nres++;
				listaVacia[i]+='&nbsp;';
				if(j!=(listaDiaria-1)){
					lista[i]+='<br>';
					listaVacia[i]+='<br>';
					listaReserva[i]+='<br>';
				}
			}
		}		
	}
	GeneraEditFEA(mmes,lfealongAnt){
		var tx="";
		if(listaFeaLong==0)listaFeaLong++;//se debe dejar al menos uno
		for(var i=0;i<listaFeaLong;i++){
			if(!(i<lfealongAnt))listaFEA[i]="&nbsp;";
			var checkaux='';
			var rotaux=0;
			if (i==0){
				checkaux='checked="checked"';
			}else{
				rotaux=listaFeaLong-i;
			}
			tx+='<br><input '+checkaux+' name="FEA'+mmes+'" value="'+i+'" type="radio" onclick="lisi='+rotaux+'">'+(i+1)+'.<input id="ente_'+mmes+'_'+i+'" value="'+listaFEA[i]+'" type="text" onchange="listaFEA['+i+']=this.value;">';
		}
		lisi=0;
		return tx;
	}

	EscribeMes2(mes, anno){
		var mesaux=mes-1;
		mes=calen[mes-1];
		var texto=mes.NombreMes+'<table border="1" cellpadding="0" cellspacing="0" style="border-collapse: collapse" bordercolor="#111111" width="100%" id="AutoNumber1">';
		texto+='<tr><td width="14%">LU</td><td width="14%">MA</td><td width="14%">MI</td><td width="14%">JU</td><td width="14%">VI</td><td width="14%" style="background-color: rgb(153, 153, 153);">SA</td><td width="14%" style="background-color: rgb(153, 153, 153);">DO</td></tr><tr>';
		var diaIn=mes.diaIn;
		if (diaIn==0)diaIn=7;
		for(var i=1;i<diaIn;i++){
			texto+='<td width="14%"></td>';
		}
		textoLuna='';
		var diaMesFin=0;
		for(var i=0;i<mes.dias;i++){
			var dii=i+1;
			if(mes.arrayMes[i].diaSem==6){
				texto+='<td width="14%" style="background-color: rgb(153, 153, 153);"><div style="text-align: right;"><span style="align: right; font-size: 10pt; color: black; font-weight: bold;">'+mes.arrayMes[i].dia+'<br></span></div><span style="font-size: 10pt; color: black;">'+listaReserva[lisi]+'</span></td>';
			}else if((mes.arrayMes[i].diaSem==0)||mes.arrayMes[i].festivo){
				texto+='<td width="14%" style="background-color: rgb(153, 153, 153);"><div style="text-align: right;"><span style="align: right; font-size: 10pt; color: black; font-weight: bold;">'+mes.arrayMes[i].dia+'<br></span></div><span style="font-size: 10pt; color: black;">'+listaVacia[0]+'</span></td>';
				if(mes.arrayMes[i].diaSem==0){
					texto+='</tr><tr>';
					lisi++;
					if (lisi==listaFeaLong)lisi=0;
				}

			} else{
				texto+='<td width="14%" ><div style="text-align: right;"><span style=" font-size: 10pt; color: black; font-weight: bold;">'+mes.arrayMes[i].dia+'<br></span></div><span style="font-size: 10pt; color: black;">'+lista[lisi]+'</span></td>';
			}
			diaMesFin=mes.arrayMes[i].diaSem;
		}
		if((diaMesFin==0)||(diaMesFin==6)){//sabado o domingo
			texto+='</tr></table>';
		}else{//finaliza en otro tipo de día se añaden los reservas en el resto blanco
			texto+='<td width="14%" style="background-color: rgb(153, 153, 153);"><div style="text-align: right;"><span style="align: right; font-size: 10pt; color: black; font-weight: bold;"><br></span></div><span style="font-size: 10pt; color: black;">'+listaReserva[lisi]+'</span></td></tr></table>';
		}
		texto+='<span style="font-size: 10pt; color: black;">BLOQUES DE VALIDACIÓN<br>&nbsp;&nbsp;&nbsp1) Área 1: 1-3 millones<br>&nbsp;&nbsp;&nbsp2) Área 1: 3-7 millones<br>&nbsp;&nbsp;&nbsp3) Área 1: 7 millones en adelante + áreas 11, 12, 15 y 16<br>&nbsp;&nbsp;&nbsp4) Áreas 2, 3, 5, 7 y 17<br/>&nbsp;&nbsp;&nbsp5) Áreas 8, 13 y 14<br/></span>';
		return texto;

	
	}
	
	Bisiesto(anno){
		if (anno>1582)
			return ((anno%4)==0&&(anno%100)!=0)||(anno%400)==0;
		else
			return anno%4==0
	}
	
	diaporti(){
		/*document.getElementById('aa').innerHTML='<font size="5" face="Viner Hand ITC" color="#FF0000">¡A por ti!.'+fecha.getDay()+'<br/>'+fecha.getYear()+'<br/>'+fecha.getMonth()+'<br/>'+Bisiesto(1500)+'</font>'+
		DiasMes(4,2008)+NombreMes(4)+'<br/>'+EscribeMes(0, 1967);*/
	}
	
	fiestaMovil(anno){
			var dias=0;
			var mes=2;
			var estado20=Luna(2,anno)+19;
			if (estado20>29.530588) estado20=estado20-29.530588;
			//alert('uno est20'+estado20);
			if (estado20>1) dias=parseInt(29.530588-estado20)+1;
			else dias=0;
			dias+=20;
			if(dias>31){
				mes=3;//se pasa a abril
				dias=dias-31;
			}
			//alert('dos '+mes+': '+dias+': '+calen[mes].arrayMes[dias-1].diaSem);
			var diasem=calen[mes].arrayMes[dias-1].diaSem;
			if(diasem<5)dias+=4-diasem;
			else dias+=11-diasem;
			//Viernes santo
			if(dias>=31){
				mes++;
				dias=dias-31
			}
			calen[mes].arrayMes[dias].festivo=true;
			santo=new Array(3);santo[0]='Viernes Santo.';santo[1]='';santo[2]='';
			santosdia=santos[mes*31+dias];
			santosdia[santosdia.length]=santo;//@
			//ascension;
			dias+=41//dias+=42;
			if(mes==2){mes++;dias-=31;}
			if(mes==3&&dias>=30){mes++;dias-=30;}
			if(mes==4&&dias>=31){mes++;dias-=31;}
			calen[mes].arrayMes[dias/*-1*/].festivo=true;
			santo=new Array(3);santo[0]='Ascensión.';santo[1]='';santo[2]='';
			santosdia=santos[mes*31+dias/*-1*/];
			santosdia[santosdia.length]=santo;//@

			//corpus christi 60 dias despues del domingo
			
			dias+=21;
			if(mes==3&&dias>=30){mes++;dias-=30;}
			if(mes==4&&dias>=31){mes++;dias-=31;}
			calen[mes].arrayMes[dias/*-1*/].festivo=true;
			santo=new Array(3);santo[0]='Corpus Christi.';santo[1]='';santo[2]='';
			santosdia=santos[mes*31+dias/*-1*/];
			santosdia[santosdia.length]=santo;//@
			//alert('tres '+calen[mes].arrayMes[dias].dia+' mes: '+mes+': '+calen[mes].arrayMes[dias].diaSem+': '+
			//calen[mes].arrayMes[dias].diaSem);
	}
	
	calendario(anno){
			ponFestivo(1,0);
			ponFestivo(6,0);
			ponFestivo(1,4);
			ponFestivo(25,11);
			
			calen=new Array(12);
			for(var i=0;i<12;i++){
				calen[i]=new Mes(i+1,anno);
				//alert('esto es inaudito'+i+': '+calen[i]);
			}
			fiestaMovil(anno);
			
			/*document.getElementById('cal').innerHTML=*/
			return anno+'<br/><table border="1" cellpadding="0" cellspacing="0" style="border-collapse: collapse" bordercolor="#111111" width="100%" id="AutoNumber1"><tr><td valign="top">'+EscribeMes(0, anno)+'</td><td valign="top">'+EscribeMes(1, anno)+'</td></tr>'+
					'<tr><td valign="top">'+EscribeMes(2, anno)+'</td><td valign="top">'+EscribeMes(3, anno)+'</td></tr>'+
					'<tr><td valign="top">'+EscribeMes(4, anno)+'</td><td valign="top">'+EscribeMes(5, anno)+'</td></tr>'+
					'<tr><td valign="top">'+EscribeMes(6, anno)+'</td><td valign="top">'+EscribeMes(7, anno)+'</td></tr>'+
					'<tr><td valign="top">'+EscribeMes(8, anno)+'</td><td valign="top">'+EscribeMes(9, anno)+'</td></tr>'+
					'<tr><td valign="top">'+EscribeMes(10, anno)+'</td><td valign="top">'+EscribeMes(11, anno)+'</td></tr></table>';
	
	}
}
