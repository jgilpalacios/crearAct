let EJERCICIO;
let TIPO;
let ACTIVIDAD;
let NSGAF;
let RESPONSABLE;
let CENTRO;
let LOCALIDAD;
let DURACION_ACTIVIDAD=0;
let DURACION_ACTIVIDAD_MINUTOS=0;
let DURACION_PONENCIAS=0;
let DURACION_PONENCIAS_MINUTOS=0;
let CRÉDITOS;
let SESIONES=[];
let LISTA_PONENTES={ HORAS:0};
let permiteRepetidas=false;
let tareas=[];
function dibujaPonentes(){
    let texto;
    let aux='';
    if(LISTA_PONENTES.PONENTES ===undefined){
        texto='Ponentes:<button id="SESIONES_PONENTE+" onclick=" ponPonentes()">+</button>';
    }else{
        LISTA_PONENTES.PONENTES.forEach((ponente, i)=>{
            aux+=`<br>${i+1}:<input id="SESION_PONENTE_${i}" type="text" value="${ponente.NOMBRE}" onchange="LISTA_PONENTES.PONENTES[${i}].NOMBRE=this.value">`;
        });
        texto='Ponentes:<button id="SESIONES_PONENTE+" onclick=" ponPonentes()">+</button><button id="SESIONES_PONENTE+" onclick=" quitaPonentes()">-</button>'+aux;
    }
    document.getElementById('SESIONES_PONENTES').innerHTML=texto;
}
function ponPonentes(){
    /*let textoIN='Ponentes:';
    let textoFin='<button id="SESIONES_PONENTE+" onclick=" ponPonentes()">+</button>':
    let texto=<input id="SESION_PONENTE" type="text">*/
    if (LISTA_PONENTES.PONENTES !==undefined){
        //alert('hay'+JSON.stringify(LISTA_PONENTES.PONENTES));
        //LISTA_PONENTES.PONENTES[LISTA_PONENTES.PONENTES.lenght]={NOMBRE:''};
        LISTA_PONENTES.PONENTES.push({NOMBRE:''});
    }else{
        //alert('no hay');
        LISTA_PONENTES.PONENTES=[{NOMBRE:''}];
    } 
    dibujaPonentes();
}
function quitaPonentes(){
    if (LISTA_PONENTES.PONENTES.length>1){
        LISTA_PONENTES.PONENTES.pop();
    }else{
        delete LISTA_PONENTES.PONENTES;
    }
    dibujaPonentes();
}
function sumaHoras(horaIn, durHorsMin){
    let inicio=horaIn.split(':');
    let duracion=durHorsMin.split(':');
    let minutos=+duracion[1]+(+inicio[1]);
    let horas=+duracion[0]+(+inicio[0])+Math.floor(minutos/60);
    minutos=minutos%60;
    return ('00'+horas).substring(('00'+horas).length-2)+':'+('00'+minutos).substring(('00'+minutos).length-2);
}
function ConvierteEnHoras(horaMin){
    let aux=horaMin.split(':');
    let horas=+aux[0]+(aux[1]/60);
    return horas;
}

function adicionaSesion(){
    let elemento={}
    elemento["SESIÓN"]=SESIONES.length+1;
    ['FECHA','HORA_INICIO','DURACIÓN'].forEach((item,i)=>{
        elemento[item]=document.getElementById('SESION_'+item).value;
    });
    
    elemento['HORA_FINAL']=sumaHoras(elemento['HORA_INICIO'],elemento['DURACIÓN']);
    let aux=elemento['DURACIÓN'].split(':');
    let duracion_enMinutos=+aux[1]+aux[0]*60;
    //elemento['DURACIÓN']=''+ConvierteEnHoras(elemento['DURACIÓN']);
    if (LISTA_PONENTES.PONENTES === undefined){
        elemento['PONENCIA_DURACIÓN']='0';
        DURACION_PONENCIAS_MINUTOS+=0;
    }else{
            elemento['PONENCIA_DURACIÓN']=''+ConvierteEnHoras(elemento['DURACIÓN']);
            
            LISTA_PONENTES.PONENTES.forEach((pon,i)=>{
                if(i===0){
                    elemento['PONENTES']=[{NOMBRE:LISTA_PONENTES.PONENTES[0].NOMBRE ,HORA_INICIO:elemento['HORA_INICIO'],HORA_FIN:elemento['HORA_FINAL']}];
                }else{elemento['PONENTES'].push('');}
            })
    }
    
    elemento['REVISADA']="";

    
    elemento['ASISTENCIA']=[];
    //alert(JSON.stringify(elemento));
    let norepetida=true;
    let en='';
    if(!permiteRepetidas)//si se permiten no se desactiva norepetida
    SESIONES.forEach((item,i)=>{
        if(item.FECHA===elemento.FECHA){
            norepetida=false;
            en+= item.FECHA + ' ya incluida en la sesion '+item.SESIÓN;
        }
    })
    if(norepetida){
        SESIONES[SESIONES.length]=elemento;
        DURACION_ACTIVIDAD_MINUTOS+=Duracion(elemento['HORA_INICIO'], elemento['HORA_FINAL']).minutos;
        //let aux=elemento['DURACIÓN'].split(':');
        if (LISTA_PONENTES.PONENTES !== undefined) //DURACION_PONENCIAS_MINUTOS+=+aux[1]+aux[0]*60;
        DURACION_PONENCIAS_MINUTOS+=duracion_enMinutos;
        DURACION_PONENCIAS=''+DURACION_PONENCIAS_MINUTOS/60;
        DURACION_ACTIVIDAD=''+DURACION_ACTIVIDAD_MINUTOS/60;
        CRÉDITOS=''+Math.round(DURACION_ACTIVIDAD)/10;
        document.getElementById('DURACION_ACTIVIDAD').value=DURACION_ACTIVIDAD;
    }else alert(en);
    exponPlan();
    //reordena();
    //alert(JSON.stringify(SESIONES));

}
function SesionesSeguidas(n,intervalo){
    intervalo=intervalo||1;
    let fechaAnt=document.getElementById('SESION_FECHA').value;
    let fecha=new Date(fechaAnt);
    for (let i=0;i<n;i++){
        fecha=new Date(fechaAnt);
        fecha.setDate(fecha.getDate() + i*intervalo);
        //alert(FormateaFecha(fecha));
        document.getElementById('SESION_FECHA').value=FormateaFecha(fecha);
        adicionaSesion()
    }
    document.getElementById('SESION_FECHA').value=fechaAnt;
    //reordena();
}

function SesionesMensuales(n){
    let fechaAnt=document.getElementById('SESION_FECHA').value;
    let fechaArr=fechaAnt.split('-');
    let fecha;
    for (let i=0;i<n;i++){
        adicionaSesion();
        fechaArr[1]=(+fechaArr[1])+1;
        if(fechaArr[1]>12){
            fechaArr[1]=0;
            fechaArr[0]=(+fechaArr[0])+1;
        }
        //alert(fechaArr);

        fecha=fechaArr[0]+'-'+('00'+fechaArr[1]).substring(('00'+fechaArr[1]).length-2)+'-'+fechaArr[2];		
        document.getElementById('SESION_FECHA').value=fecha;
    }
    document.getElementById('SESION_FECHA').value=fechaAnt;
    //reordena();
}

function Curso7Sesiones(){
    adicionaSesion();
    let fechaAnt=document.getElementById('SESION_FECHA').value;
    let fecha=new Date(fechaAnt);
    let diasem=fecha.getDay();
    let incrementos=[2,5];
    if(diasem>2){
        incrementos=[5,2];
    }
    for (let i=0;i<3;i++){
        fecha.setDate(fecha.getDate() + incrementos[0]);
        document.getElementById('SESION_FECHA').value=FormateaFecha(fecha);
        adicionaSesion();
        fecha.setDate(fecha.getDate() + incrementos[1]);
        document.getElementById('SESION_FECHA').value=FormateaFecha(fecha);
        adicionaSesion();
        document.getElementById('SESION_FECHA').value=fechaAnt;
    }
    //reordena();
}
//reorganizar y ordenar por fecha
function reordena(){
    SESIONES.sort(function(a, b) {//alert(a);
    return  a['FECHA'] > b['FECHA'] ? 1 : -1;
    })
    SESIONES.forEach((item,i)=>{
        item.SESIÓN=(i+1);
    })
}
function annadeEdicion(sesion, elemento, objeto){
    tareas.push({SESION: sesion, elemento: elemento, objeto: objeto});
    objeto.parentNode.parentNode.style.backgroundColor='bisque';
}
function EjecutaEdicion(){//alert(JSON.stringify(tareas));//alert(JSON.stringify(SESIONES));
    //tareas.sort(function(a, b) { return b.SESION - a.SESION;});
    let borrables=[];
    let cambiosPonencias=[];
    tareas.forEach((tarea, i)=>{//alert(tarea.SESION+': '+tarea.elemento+'hola'+tarea.objeto.value);
        if(tarea.elemento==='ini'||tarea.elemento==='fin'||tarea.elemento==='fecha'){
            if (tarea.elemento==='ini'){
                SESIONES[tarea.SESION].HORA_INICIO=tarea.objeto.value;
            }
            if (tarea.elemento==='fin'){
                SESIONES[tarea.SESION].HORA_FINAL=tarea.objeto.value;
            }
            if (tarea.elemento==='fecha'){
                SESIONES[tarea.SESION].FECHA=tarea.objeto.value;
                if(tarea.objeto.value==='')borrables.push(tarea.SESION);
            }
        }else{
            cambiosPonencias.push(tarea.SESION);//alert('ppp'+JSON.stringify(cambiosPonencias));
        }
        
    });
    let previaborrada=-1;
    let ponMin=0;
    if(LISTA_PONENTES.PONENTES!==undefined && cambiosPonencias.length>0){
        cambiosPonencias.sort(function(a, b) { return b - a;});
        cambiosPonencias.forEach((cambio, i)=>{
            if(previaborrada!==cambio){
                LISTA_PONENTES.PONENTES.forEach((pon, j)=>{//alert((document.getElementById('Pses-'+cambio+'-'+j).checked)+'--'+cambio+','+j);
                    if(document.getElementById('Pses-'+cambio+'-'+j).checked){
                        SESIONES[cambio].PONENTES[j]={NOMBRE:pon.NOMBRE,HORA_INICIO:document.getElementById('HINPses-'+cambio+'-'+j).value,HORA_FIN:document.getElementById('HFINPses-'+cambio+'-'+j).value};//alert(JSON.stringify(SESIONES[cambio].PONENTES[j]));
                        ponMin+=Duracion(SESIONES[cambio].PONENTES[j].HORA_INICIO,SESIONES[cambio].PONENTES[j].HORA_FIN).minutos;
                    }else{
                        SESIONES[cambio].PONENTES[j]='';
                    }
                });
                previaborrada=cambio;
                SESIONES[cambio].PONENCIA_DURACIÓN=''+ponMin/60;
                ponMin=0;
            }			

        });
    }
    cambiosPonencias=[];
    borrables.sort(function(a, b) { return b - a;});
    //alert (JSON.stringify(borrables));
    previaborrada=-1;
    //if(borrables.length>0)document.getElementById('cont').innerHTML=generaCalendario();
 
    borrables.forEach((borrable)=>{
        if(previaborrada!==borrable){
            if(SESIONES[borrable].FECHA===''){;
                SESIONES.splice(borrable, 1);
            }
            previaborrada=borrable;
        }
    })
    tareas=[];
    DURACION_ACTIVIDAD_MINUTOS=0;
    DURACION_PONENCIAS_MINUTOS=0;
    SESIONES.forEach((sesion,i)=>{//alert(JSON.stringify(sesion));
        sesion.DURACIÓN=Duracion(sesion.HORA_INICIO,sesion.HORA_FINAL).horas;
        DURACION_ACTIVIDAD_MINUTOS+=Duracion(sesion.HORA_INICIO,sesion.HORA_FINAL).minutos;//alert(DURACION_ACTIVIDAD_MINUTOS);alert(JSON.stringify(sesion.PONENTES))
        if(sesion.PONENTES!==undefined){
            sesion.PONENTES.forEach((pon,j)=>{//alert(j);
                if(pon!==''){
                    DURACION_PONENCIAS_MINUTOS+=Duracion(pon.HORA_INICIO,pon.HORA_FIN).minutos;
                }
            })
        }
    })
    DURACION_PONENCIAS=''+DURACION_PONENCIAS_MINUTOS/60;
    DURACION_ACTIVIDAD=''+DURACION_ACTIVIDAD_MINUTOS/60;
    CRÉDITOS=Math.round(+DURACION_ACTIVIDAD)/10;
    LISTA_PONENTES.HORAS=DURACION_PONENCIAS;
    document.getElementById('DURACION_ACTIVIDAD').value=DURACION_ACTIVIDAD;

    document.getElementById('cont').innerHTML=generaCalendario(+EJERCICIO.split('-')[0]);
    exponPlan();
}
function RevisionFechasYSumaHPonentes(){
    let minutosPonente=[];
    let textoTotHpon="";
    if(LISTA_PONENTES.PONENTES !==undefined){
        LISTA_PONENTES.PONENTES.forEach((ponente, i)=>{
            minutosPonente[i]=0;
            ponente.HORAS=0;
        });
        SESIONES.forEach((sesion, i)=>{
            sesion.PONENTES.forEach((pon, j)=>{
                if(pon!==''){
                    minutosPonente[j]+=Duracion(pon.HORA_INICIO,pon.HORA_FIN).minutos;
                }
            })
        });
        
        LISTA_PONENTES.PONENTES.forEach((ponente, i)=>{
            ponente.HORAS=''+minutosPonente[i]/60;
            textoTotHpon+=ponente.NOMBRE+': '+ponente.HORAS+'h.<br>';
        });
    }
    LISTA_PONENTES.HORAS=DURACION_PONENCIAS;
    let compruebaFechas=NoLectivo();
    if(!compruebaFechas.RESULTADO) alert(compruebaFechas.MENSAJE);
    document.getElementById('REPARTO_PONENCIAS').innerHTML=textoTotHpon+compruebaFechas.MENSAJE+'<br>';
}

function exponPlan(){
    document.getElementById('DURACION_PONENCIAS').value=DURACION_PONENCIAS;
    document.getElementById('DURACION_ACTIVIDAD').value=DURACION_ACTIVIDAD;
    document.getElementById('CRÉDITOS').value=CRÉDITOS;
    reordena();
    let textoHTML='<table style="width: 100%" border="1"><tbody><tr>';
    let n=SESIONES.length-1;
    SESIONES.forEach((item,i)=>{
        let fecha=item.FECHA;
        let ponencia=false;
        if(i>0 && i%5===0){
            if(i!==n){
                textoHTML+='</tr><tr>';
            }
        }
        textoHTML+=`<td><p style="text-align:center;" onclick="document.getElementById('SESION_FECHA').value=document.getElementById('SESION_FECHA_${i}').value"><span style="cursor:pointer;">nº: ${item.SESIÓN}</span></p><p>FECHA:<input id="SESION_FECHA_${i}" type="date" value="${item.FECHA}" onchange="annadeEdicion(${i},'fecha',this)"><br>INICIO:<input id="SESION_HORA_INICIO_${i}" value="${item.HORA_INICIO}" type="time" onchange="annadeEdicion(${i},'ini',this)"><br>FINAL:<input id="SESION_HORA_FINAL_${i}" value="${item.HORA_FINAL}" type="time" onchange="annadeEdicion(${i},'fin',this)"><br>Duración: ${Duracion(item.HORA_INICIO,item.HORA_FINAL).horas} h.<br>PONENCIA: <input id="SESION_PONENCIA_DURACIÓN_${i}" value="${item.PONENCIA_DURACIÓN}" type="text" size="2"> h.`;
            let textoPon='';
            let chequeada='checked';//alert(JSON.stringify(LISTA_PONENTES.PONENTES))
            if(LISTA_PONENTES.PONENTES!==undefined){
                LISTA_PONENTES.PONENTES.forEach((pon, j)=>{
                    if(item.PONENTES===undefined)item.PONENTES=[];
                    if(item.PONENTES[j]===undefined||item.PONENTES[j]==''){
                        item.PONENTES[j]='';
                        chequeada='';
                        //alert('+++ '+item.FECHA)
                    }else{
                        chequeada='checked'
                        ponencia=true;
                    }
                    //if(item.PONENTES[j]==''){
                        textoPon+=`<br><input id="Pses-${i}-${j}" type="checkbox" onchange="annadeEdicion(${i},'pon_${j}',this)" ${chequeada} ><small>${LISTA_PONENTES.PONENTES[j].NOMBRE}</small><br><span onclick="document.getElementById('HINPses-${i}-${j}').value=document.getElementById('SESION_HORA_INICIO_${i}').value" style="cursor:pointer;">-Hora de inicio: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><input id="HINPses-${i}-${j}" type="time" value="${item.PONENTES[j].HORA_INICIO}" onchange="annadeEdicion(${i},'ponI_${j}',this)"><br><span onclick="document.getElementById('HFINPses-${i}-${j}').value=document.getElementById('SESION_HORA_FINAL_${i}').value" style="cursor:pointer;">-Hora de finalización:</span> <input id="HFINPses-${i}-${j}" type="time" onchange="annadeEdicion(${i},'ponF_${j}',this)"  value="${item.PONENTES[j].HORA_FIN}">`;

                    //}
                })
            }
            /*if(item.PONENTES!==undefined){
                item.PONENTES.forEach((pon, j)=>{
                    if(pon==''){
                        textoPon+=`<br><input id="Pses-${i}-${j}" type="checkbox" onchange="alert(${i})" ><small>${LISTA_PONENTES.PONENTES[j].NOMBRE}</small><br>-Hora de inicio: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input id="HINPses-${i}-${j}" type="time" onchange="alert(${i})" value="${item.HORA_INICIO}"><br>-Hora de finalización: <input id="HFINPses-${i}-${j}" type="time" onchange="alert(${i})"  value="${item.HORA_FINAL}">`;

                    }else{
                        textoPon+=`<br><input id="Pses-${i}-${j}" type="checkbox" onchange="alert(${i})" checked><small>${pon.NOMBRE}</small><br>-Hora de inicio: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input id="HINPses-${i}-${j}" type="time" onchange="alert(${i})" value="${pon.HORA_INICIO}"><br>-Hora de finalización: <input id="HFINPses-${i}-${j}" type="time" onchange="alert(${i})"  value="${pon.HORA_FIN}">`;
                    }
                });
            }*/
            
            textoHTML+=textoPon+'</p></td>';
        //alert(fecha+': '+ponencia);
        ponSesCal(fecha, ponencia);
    });
    textoHTML+='</tr></tbody></table>';
    //alert(textoHTML);
    document.getElementById('CONTENIDO_SESIONES').innerHTML=textoHTML;
}

//se marca la sesion en la fecha del calendario del ejerccio
function ponSesCal(fecha, ponencia){
    let anno=EJERCICIO.split('-')[0];
    let ArrFecha=fecha.split('-')
    let imes
    if(anno === ArrFecha[0]){
        imes=+ArrFecha[1]-9;
    }else{
        imes=+ArrFecha[1]+3;
    }
    //alert('d'+(31*imes+(+ArrFecha[2])));
    //alert(document.getElementById('d'+(31*imes+(+ArrFecha[2]))));
    let elemento=document.getElementById('d'+(31*imes+(+ArrFecha[2])));
    
    if(ponencia){//alert('cc');
        elemento.classList.remove('sesion');
        elemento.classList.add('ponencia');
    }else{
        elemento.classList.remove('ponencia');
        elemento.classList.add('sesion');
    }   
   
}
///Tabla de participantes
let PARTICIPANTES=[];
let TablaPARTICIPANTES=[];
function GeneraParticipantes(tabla) {
    let casos=tabla.split('\n');
    let cabeceras=[];
    casos.forEach((caso,i)=>{
        let terminos=caso.trim('\r').split('\t');
        if(i===0){
            terminos.forEach((termino,j)=>{
                cabeceras.push(termino);
            })
        }else{
            TablaPARTICIPANTES[i-1]={};
            terminos.forEach((termino,j)=>{
                TablaPARTICIPANTES[i-1][cabeceras[j]]=termino;
                if(j===0)PARTICIPANTES[i-1]=termino;
            })
        }
    });
    TablaPARTICIPANTES.pop();//eliminamos el último elemento que se crea vacío
    PARTICIPANTES.pop();
}
/*---------------------------*/
////funciones incluidas en index
function FormateaFecha(fecha){
    let fok=fecha.getFullYear()+'-'+('0'+(fecha.getMonth() +1)).substring(('0'+(fecha.getMonth() +1)).length-2)+'-'+('0'+fecha.getDate()).substring(('0'+fecha.getDate()).length-2);
    return fok;	
}
function Duracion(horaIn, horaFin){
    if(horaIn.indexOf(':')<0 || horaFin.indexOf(':')<0 )return {minutos: 0, horas: 0, fornateada: '0h0\''};//si no son validos se pone a 0h
    let Hin=horaIn.split(':');
    let Hfin=horaFin.split(':');
    let Duracion=(+Hfin[1]+Hfin[0]*60)-(+Hin[1]+Hin[0]*60);//duracion en minutos
    let Dformateada=Math.floor(Duracion/60)+'h';
    if ((Duracion%60)!==0)Dformateada+=(Duracion%60)+'\'';
    return {minutos: Duracion, horas: Duracion/60, fornateada: Dformateada}
}
function descargarArchivo(contenidoEnBlob, nombreArchivo) {
    var reader = new FileReader();
    reader.onload = function (event) {
        var save = document.createElement('a');
        save.href = event.target.result;
        save.target = '_blank';
        save.download = nombreArchivo || 'archivo.dat';
        var clicEvent = new MouseEvent('click', {
            'view': window,
                'bubbles': true,
                'cancelable': true
        });
        save.dispatchEvent(clicEvent);
        (window.URL || window.webkitURL).revokeObjectURL(save.href);
    };
    reader.readAsDataURL(contenidoEnBlob);
};
function DescargarLosDatos2() {//RENOMBRADA PUES DESCARGABA SESIONES VACÍAS
    //añadido Datos por compatibilidad, es variable globan en el otro
    EJERCICIO=document.getElementById('EJERCICIO').value||'2020-21';
    TIPO=document.getElementById('TIPO').value;
    ACTIVIDAD=document.getElementById('ACTIVIDAD').value;
    NSGAF=document.getElementById('NSGAF').value;
    RESPONSABLE=document.getElementById('RESPONSABLE').value;
    CENTRO=document.getElementById('CENTRO').value;
    LOCALIDAD=document.getElementById('LOCALIDAD').value;
    /*let horasPonente=[];
    let horasPonente2=[];
    if(LISTA_PONENTES!==undefined)
        LISTA_PONENTES.PONENTES.forEach((pon,i)=>{
            horasPonente[i]=pon.HORAS;
            horasPonente2[i]=pon.HORAS;
        })*/
    let auxHoras;
    let auxTotHoras=+DURACION_ACTIVIDAD;
    let auxTotHoras2=auxTotHoras;
    let auxHoras2;//alert('mm');
    SESIONES.forEach((sesion,i)=>{
        if((''+sesion.DURACIÓN).indexOf(':')>0)
            auxHoras=ConvierteEnHoras(sesion.DURACIÓN);
        else auxHoras=sesion.DURACIÓN;
        auxHoras2=auxHoras;
        //alert(auxTotHoras+' - '+auxHoras)
        if(auxTotHoras<Math.ceil(auxHoras)){
            auxHoras=auxTotHoras2;
        }else{
            auxHoras=Math.floor(100*auxHoras)/100;
            auxTotHoras2-=auxHoras;
        }
        sesion.DURACIÓN=''+auxHoras;//alert(i+'-'+sesion.DURACIÓN);
        auxTotHoras-=auxHoras2;
        ///////////////
    });
    //alert(JSON.stringify(PARTICIPANTES));
    let Datos={EJERCICIO:EJERCICIO,TIPO:TIPO, DURACION_ACTIVIDAD:DURACION_ACTIVIDAD, ACTIVIDAD: ACTIVIDAD, NSGAF:NSGAF, RESPONSABLE:RESPONSABLE, CENTRO:CENTRO, LOCALIDAD:LOCALIDAD, CRÉDITOS:CRÉDITOS, PARTICIPANTES:PARTICIPANTES, LISTA_PONENTES:LISTA_PONENTES, SESIONES:SESIONES, TABLA_PARTICIPANTES:TablaPARTICIPANTES};
    
    let datos = JSON.stringify(Datos);//obtenerDatos();
    let aux=0;
    /*Datos.SESIONES.forEach((sesion,i)=>{
      if(sesion.REVISADA==='ok')aux=sesion['SESIÓN'];
    });*///alert(JSON.stringify(Datos));
    let aux2=new Date();
    let coletilla='('+Datos.ACTIVIDAD.split('-')[0].trim()+')'+aux+'_'+FormateaFecha(aux2)+'#'+aux2.getHours()+'#'+aux2.getMinutes()+'#'+aux2.getSeconds()+'_'+aux2.getMilliseconds()+'.tjson';
    descargarArchivo(generarTjson(datos), 'Datos'+coletilla);
}
function generarTjson(datos) {//alert('se entra');
    var texto = [];

    texto.push(datos);
    //El contructor de Blob requiere un Array en el primer parámetro
    //así que no es necesario usar toString. el segundo parámetro
    //es el tipo MIME del archivo
    return new Blob(texto, {
        type: 'text/plain'
    });
};
/*---------------------------*/
///funciones incluidas en chequeos
//Funcion que comprueba si las fechas de las sesiones caen en días No Lectivos:
//Sabados o domingos
//los festivos declarados oficialmente, que pondremos en el array siguiente
let nuevoPlanTrabajo=SESIONES;//creado para ajustar la función
////
function NoLectivo(){
let mensaje='';
let resultado=true;
nuevoPlanTrabajo.forEach((sesion,j)=>{
if(sesion!=='ok'&& sesion!==''){
    let aux=new Date(sesion.FECHA)
    if(aux.getDay()===6){
        resultado=false;
        mensaje+=sesion.FECHA+' es sábado.\r\n';
    }else if(aux.getDay()===0){
        resultado=false;
        mensaje+=sesion.FECHA+' es domingo.\r\n';
    }else {
        i=0
        while(DiasNoLectivos[i]<=sesion.FECHA){
            if (DiasNoLectivos[i]===sesion.FECHA){
                resultado=false;
                mensaje+=sesion.FECHA+' es no lectivo y/o vacaciones.\r\n';
            }
            i++;
        }
    }
}
})
return {RESULTADO:resultado, MENSAJE: mensaje}
}
/////////////Añadido para cargar en textarea un json de actividad y que la recargue para editarla
function CargaLaActividad(texto){//alert(texto);
let Datos=JSON.parse(texto);
['EJERCICIO','TIPO','ACTIVIDAD','NSGAF','RESPONSABLE','CENTRO','LOCALIDAD','DURACION_ACTIVIDAD',/*'DURACION_ACTIVIDAD_MINUTOS','DURACION_PONENCIAS','DURACION_PONENCIAS_MINUTOS',*/'CRÉDITOS'].forEach((item)=>{
document.getElementById(item).value=Datos[item];
})
SESIONES=Datos.SESIONES;
LISTA_PONENTES=Datos.LISTA_PONENTES;
PARTICIPANTES=Datos.PARTICIPANTES;
TablaPARTICIPANTES=Datos.TABLA_PARTICIPANTES;
//alert(PARTICIPANTES);		
exponPlan();
EjecutaEdicion();
RevisionFechasYSumaHPonentes();
//alert(PARTICIPANTES);
}
//genera el html del calendario cuyo año inicia del ejercicio, se pasa como parametro
//se crea comenzando en septiembre hasta agosto del año siguiente
function generaCalendario(annoEjercicio){
    
    let p=new Calendario(annoEjercicio,9);//alert(annoEjercicio);
    
    DiasNoLectivos.forEach((dia,i)=>{
        let fecha=dia.split('-');
        if(fecha[0]==='2021') p.fijaDiaEspecial(+fecha[2],+fecha[1]-9,'nolectivo',true)
        else p.fijaDiaEspecial(+fecha[2],+fecha[1]+3,'nolectivo',true)
    });
    let trat=['<td class="defecto" id="#id#" onclick="gestionaFecha(this)">#dia#</td>','<td class="defecto" id="#id#" onclick="gestionaFecha(this)">#dia#</td>','<td class="defecto" id="#id#" onclick="gestionaFecha(this)">#dia#</td>','<td class="defecto" id="#id#" onclick="gestionaFecha(this)">#dia#</td>','<td class="defecto" id="#id#" onclick="gestionaFecha(this)">#dia#</td>','<td class="sabado" id="#id#" onclick="gestionaFecha(this)">#dia#</td>','<td class="domingo" id="#id#" onclick="gestionaFecha(this)">#dia#</td>'];
        let tratNoLect='<td class="noLectivo" id="#id#" onclick="gestionaFecha(this)"><b>#dia#</b></td>';
        let tt='';
        for(let i=0;i<12;i++){//alert(p.calen[i].nombre+', '+p.calen[i].anno);
            tt+='<div>'+p.calen[i].nombre+', '+p.calen[i].anno+'<div>'+p.EscribeMesPos2(i,trat,tratNoLect);
        }
    return tt;   
}

function gestionaFecha(casilla){
   if(casilla.classList.contains('sesion')||casilla.classList.contains('ponencia')){
        alert('Para borrar o editar propiedades debes usar la lista de sesiones del principio')
   }else{alert(casilla.id)
        let aux=+casilla.id.substring(1);
        let mes=Math.ceil(aux/31);
        let dia=aux%31||31;
        let anno=+EJERCICIO.split('-')[0];
        if(mes>4){
            anno++;
            mes='0'+(mes-4);
        }else{
            mes+=8;
            mes='0'+mes;
            mes=mes.substring(mes.length-2);
        }
        dia='0'+dia;
        dia=dia.substring(dia.length-2);
        alert(anno+'-'+mes+'-'+dia)
        document.getElementById('SESION_FECHA').value=anno+'-'+mes+'-'+dia;
        adicionaSesion();
        if(LISTA_PONENTES.PONENTES) casilla.classList.add('ponencia');
        else casilla.classList.add('sesion');
   }
}

///////////////
function genSesCSV(){
    let csv='';
    let fila1='';
    let fila2='';
    let fila3='';
    let fila4='';
    let fila5='';
    let fila6='';
    SESIONES.forEach((sesion)=>{
        fila1+='"'+sesion['SESIÓN']+'";';
        fila2+='"'+sesion['FECHA']+'";';
        fila3+='"'+sesion['DURACIÓN']+'";';
        if(+sesion['PONENCIA_DURACIÓN']) {
            fila4+='"'+sesion['PONENCIA_DURACIÓN']+'";';
            let inpon='23:59';
            sesion.PONENTES.forEach((pon)=>{
                if(pon!==''){
                    if(pon.HORA_INICIO<inpon)inpon=pon.HORA_INICIO;
                }
            });
            fila6+='"'+inpon+'";';
        }else{
            fila4+='"";';
            fila6+='"";';
        }
        fila5+='"'+sesion['HORA_INICIO']+'";';

    });
    csv+=fila1.substring(0, fila1.length-1)+'\n'+fila2.substring(0, fila2.length-1)+'\n';
    csv+=fila3.substring(0, fila3.length-1)+'\n'+fila4.substring(0, fila4.length-1)+'\n';
    csv+=fila5.substring(0, fila5.length-1)+'\n'+fila6.substring(0, fila6.length-1)+'\n';
    alert(csv);
}