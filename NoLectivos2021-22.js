		/*---------------------------*/
		///funciones incluidas en chequeos
		//Funcion que comprueba si las fechas de las sesiones caen en días No Lectivos:
//Sabados o domingos
//los festivos declarados oficialmente, que pondremos en el array siguiente
let nuevoPlanTrabajo=SESIONES;//creado para ajustar la función
let DiasNoLectivos=['2021-10-11','2021-10-12',/*octubre*/
'2021-11-01',/*noviembre*/
'2021-12-06','2021-12-07','2021-12-08', '2021-12-08','2021-12-23','2021-12-24','2021-12-27','2021-12-28','2021-12-29','2021-12-30','2021-12-31',/*diciembre*/
'2022-01-03','2022-01-04','2022-01-04','2022-01-05','2022-01-06','2022-01-07',/*enero*/
'2022-04-08','2022-04-11','2022-04-12','2022-04-13','2022-04-14','2021-04-15','2021-04-18',/*abril*/
'2022-05-02'/*mayo*/];

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

