// JavaScript Document
var CW = 90;//var CW = 54;
var CH = 126;//var CH = 75;
var CartasEnMazo=null;
var CartasBocaAbajo=null;
var SeleccionAnterior=null;
var Movimientos=null;
var Magic=false;
var TiempoTotal=0;
var PuntajeTotal=0;
var xx; 
var PILASCOmpletadas=0;
function AgregarAPila(palo)
{
	card = document.getElementById('AnyCard').innerHTML;
	q="";
	x=0;
	y=0;
	switch(palo)
	{
		case 'd':
			q="Diamante";
			y-=CH*2;
		break;
		case 'p':
			y-=CH;
			q="Pica";
		break;
		case 'c':
			
			q="Corazones";
		break;
		case 't':
			y-=CH*3;
			q="Trebol";
		break;
	}
	
	x-= (1-1)*CW;
	
	card=card.replace("[equis]",""+x);
	card=card.replace("[yis]",""+y);
	card=card.replace("[titulo]",q);
	document.getElementById('PilasCompletas').innerHTML+=card;
	ReAcomodarLasCartas();
}
function AgregarPozo(cn)
{
	if(cn <1 || cn>7)
		return;

	card = document.getElementById('AnyCard').innerHTML;
		
	x= -13*CW;
	y=-1*CH;
	card=card.replace("[equis]",""+x);
	card=card.replace("[yis]",""+y);
	card=card.replace("[titulo]","Pozo Libre");
	document.getElementById('Columna'+cn).innerHTML+=card;
	return;
}

function AgregarCarta(cn,palo,num,ba)
{
	if(cn <1 || cn>7)
		return;
	if(palo=="Carta") ba=true;
	card = document.getElementById('AnyCard').innerHTML;
	q="";
	x=0;
	y=0;
	switch(palo)
	{
		case 'd':
			q="Diamante";
			y-=CH*2;
		break;
		case 'p':
			y-=CH;
			q="Pica";
		break;
		case 'c':
			
			q="Corazones";
		break;
		case 't':
			y-=CH*3;
			q="Trebol";
		break;
	}
	
	x-= (num-1)*CW;
	
	if(ba!=null)
	{
		x=-13*CW;
		y=0;
	}
	card=card.replace("[equis]",""+x);
	card=card.replace("[yis]",""+y);
	if(ba ==null)
		card=card.replace("[titulo]",q +" " + num);
	else
		card=card.replace("[titulo]","Carta Boca-Abajo");
	document.getElementById('Columna'+cn).innerHTML+=card;
	
	return;
}
function RepartirRestoDelMazo()
{
	if(CartasEnMazo!=null){
		for(var i = 0;i<3;i++)
			AgregarCarta(i+1,CartasEnMazo[i][1],CartasEnMazo[i][0]);
		
		
		Movimientos.push(Array("Repartir Mazo",CartasEnMazo));
		CartasEnMazo=null;
		document.getElementById('Mazo').innerHTML="";
		if(SeleccionAnterior!=null)SeleccionAnterior.setAttribute('class','');
		ReAcomodarLasCartas();
		SeleccionAnterior=null;
		AddPuntaje(40*3);
	}
}
function GenerarMazoAleatorio()
{
	r=new Array(Array(0,'nada'));
	for(var i=0;i<52;i++)
	{
		do{
			num = Math.floor(Math.random() * 13) + 1;
			switch(Math.floor(Math.random() * 4) + 1)
			{
				case 1:
					palo = 'd';
				break;
				case 2:
					palo = 'p';
				break;
				case 3:
					palo = 'c';
				break;
				case 4:
					palo = 't';
				break;
			}
			
			noagregar=0;
			for(var j=1;j<r.length;j++)
			{
				if(r[j][0]==num && r[j][1]==palo)
				{
					noagregar=1;
				}
			}
			if(noagregar==0)
			{
				r.push(Array(num,palo));
			}
		}while(noagregar==1);
	}
	return r;
}
function AgregarMazoBocaAbajo()
{
	card = document.getElementById('AnyCard').innerHTML;
	x=0;
	y=0;
	x-= (14-1)*CW;

	card=card.replace("[equis]",""+x);
	card=card.replace("[yis]",""+y);
	card=card.replace("[titulo]","Carta Boca-Abajo");
	document.getElementById('Mazo').innerHTML=card;
	return;
}
function StartGame()
{
	Mazo=GenerarMazoAleatorio();
	
	var j = 1;

	CartasBocaAbajo=new Array();
	do
	{
		for(var i = 1;i<8;i++)
		{
			if(1<=i && i<=4 && 0 <=Math.floor(j/7) && Math.floor(j/7)<= 2)
			{
				AgregarCarta(i,Mazo[j][1],Mazo[j][0],true);
				CartasBocaAbajo.push(Array(i,Math.floor(j/7)+1,Mazo[j]));
			}else
				AgregarCarta(i,Mazo[j][1],Mazo[j][0]);
			j++;
		}
	}
	while(j<53-3);
	CartasEnMazo=new Array();
	CartasEnMazo.push(Mazo[50]);
	CartasEnMazo.push(Mazo[51]);
	CartasEnMazo.push(Mazo[52]);
	AgregarMazoBocaAbajo();
	
	if(Movimientos==null)
		Movimientos=new Array();
	TiempoTotal=0;
	PuntajeTotal=0;
	PILASCOmpletadas=0;
	//CartasEnMazo.push(Mazo[53]);
	//AgregarCarta(2,'d',2);
	//AgregarCarta(2,'p',1);
	
}
function AgregarMovimiento(origen,dest)
{
	CNDs = dest.parentNode.id;
	CND = CNDs.split("Columna")[1];
	
	CNOs = origen.parentNode.id;
	CNO = CNOs.split("Columna")[1];
	//console.log(CND);

	Movimientos.push(Array(
						   Array(CNO,origen.getAttribute('title')),
						   Array(CND,dest.getAttribute('title'))
						   ));

}
function DeshacerMovimiento()
{
	if(Movimientos!=null)
	{
		t=Movimientos[Movimientos.length-1];
		if(t==null)
		{
			alert("No ha realizado ningun movimiento!!");
			return;
		}
		switch(t[0])
		{
			case 'Repartir Mazo':
				CartasEnMazo=t[1];
				document.getElementById('Columna1').removeChild(document.getElementById('Columna1').lastChild);
				document.getElementById('Columna2').removeChild(document.getElementById('Columna2').lastChild);
				document.getElementById('Columna3').removeChild(document.getElementById('Columna3').lastChild);
				
				AgregarMazoBocaAbajo();
				AddPuntaje(-42*3);
			break;
			case 'MostrarCarta':
				Columna = t[1];
				
				if(Columna!=undefined ){				
					cant = document.getElementById('Columna'+Columna).childNodes.length;
					document.getElementById('Columna'+Columna).innerHTML="";
					for(var i = 0;i<cant;i++)
					{
						AgregarCarta(Columna,"t",1,true);
					}
					AddPuntaje(-42);
				}
				
			break;
			case 'PilaCompleta':
				palo = PaloDe(t[1][0]);
				cn = t[1][1];
				if(document.getElementById('Columna'+cn).lastChild.getAttribute('title')=="Pozo Libre")
					document.getElementById('Columna'+cn).innerHTML="";
				for(var i = 13;i>0;i--)
					AgregarCarta(cn,palo,i);
				chn=document.getElementById('PilasCompletas').childNodes;					
				for(i = 0;i<chn.length;i++)
					if(chn.item(i).getAttribute('title')==t[1][0])
					{
						document.getElementById('PilasCompletas').removeChild(chn.item(i));
						break;
					}
				AddPuntaje(-1042);		
			break;
			
			default:
			NCOlOrigen=t[0][0];
			NCOlDest=t[1][0];
			palo2=PaloDe(t[0][1].split(" ")[0]);
			num = t[0][1].split(" ")[1];
			AddPuntaje(-91*num);
			chn=document.getElementById('Columna'+NCOlDest).childNodes;
			delete TempCartas;
			TempCartas=new Array();
			for(var i = 0; i<chn.length;i++)
			{
				t=chn.item(i).getAttribute('title').split(" ");
				switch(t[0])
				{
					case 'Corazones':
						palo = 'c';
					break;
					case 'Diamante':
						palo = 'd';
					break;
					case 'Trebol':
						palo = 't';
					break;
					case 'Pica':
						palo = 'p';
					break;
					case 'Carta':
						palo="Carta";
					break;
				}
				
				TempCartas.push(Array(t[1],palo));
			}
			document.getElementById('Columna'+NCOlDest).innerHTML="";
			
			if(document.getElementById('Columna'+NCOlOrigen).firstChild.getAttribute('title')=="Pozo Libre")
				document.getElementById('Columna'+NCOlOrigen).innerHTML="";
			var j =0;
			for(var i = 0; i<TempCartas.length;i++)
			{
			
				if(TempCartas[i][0]==num && TempCartas[i][1]==palo2)
					j=1;
					
				if(j==0)
					AgregarCarta(NCOlDest,TempCartas[i][1],TempCartas[i][0]);
				else
					AgregarCarta(NCOlOrigen,TempCartas[i][1],TempCartas[i][0]);
			}
			if(document.getElementById('Columna'+NCOlDest).innerHTML=="")
				AgregarPozo(NCOlDest);
			
			//Movimientos=Movimientos.pop();//Borra el último elemnto
			break;
		}
		Movimientos=Movimientos.slice(0,Movimientos.length-1);
		
		ReAcomodarLasCartas();
		
	}
}

function PaloDe(a)
{
	switch(a)
	{
		case 'Corazones':
			return 'c';
		break;
		case 'Diamante':
			return 'd';
		break;
		case 'Trebol':
			return 't';
		break;
		case 'Pica':
			return 'p';
		break;
	}
}

function MoverColumna(origen,dest)
{
	CNDs = dest.parentNode.id;
	CND = CNDs.split("Columna")[1];
	
	//console.log(CND);
	AgregarMovimiento(origen,dest);
	
	
	t=origen.getAttribute('title').split(" ");
	switch(t[0])
	{
		case 'Corazones':
			palo2 = 'c';
		break;
		case 'Diamante':
			palo2 = 'd';
		break;
		case 'Trebol':
			palo2 = 't';
		break;
		case 'Pica':
			palo2 = 'p';
		break;
	}
	num=t[1];
	AddPuntaje(num*90);
	
	CNOs = origen.parentNode.id;
	CNO = CNOs.split("Columna")[1];
	
	chn=document.getElementById(CNOs).childNodes;
	TempCartas=new Array();
	for(var i = 0; i<chn.length;i++)
	{
		t=chn.item(i).getAttribute('title').split(" ");
		switch(t[0])
		{
			case 'Corazones':
				palo = 'c';
			break;
			case 'Diamante':
				palo = 'd';
			break;
			case 'Trebol':
				palo = 't';
			break;
			case 'Pica':
				palo = 'p';
			break;
			case 'Carta':
				palo="Carta";
			break;
		}
		
		TempCartas.push(Array(t[1],palo));
	}
	
	if(dest.getAttribute('title')=="Pozo Libre")
		document.getElementById(CNDs).innerHTML="";
	document.getElementById(CNOs).innerHTML="";
	j=0;
	for(var i = 0; i<TempCartas.length;i++)
	{
		
		if(TempCartas[i][0]==num && TempCartas[i][1]==palo2)
			j=1;
		if(j==0)
			AgregarCarta(CNO,TempCartas[i][1],TempCartas[i][0]);
		else
			AgregarCarta(CND,TempCartas[i][1],TempCartas[i][0]);
	}
	if(document.getElementById(CNOs).innerHTML=="")
		AgregarPozo(CNO);

	
}
function ActivarMovimientoMagico(a)
{
	if(Magic==false)
		Magic=true;
	else if (Magic==true)
		Magic = false;
	
	if(a.innerHTML=="Activar Movimiento Magico")
		a.innerHTML="Desactivar Movimiento Magico";
	else if(a.innerHTML=="Desactivar Movimiento Magico")
		a.innerHTML="Activar Movimiento Magico";
}
function VerificarCondicion(origen,dest)
{
	if(Magic)
	{
		//Magic=false;
		AddPuntaje(-100);
		return true;
	}
	if(origen!=origen.parentNode.lastChild)
		return false;

	name = dest.getAttribute('title');
	name2 = origen.getAttribute('title');

	t=name.split(' ');
	t2=name2.split(' ');

	if(name2 == "Pozo Libre")
		if(t[1]==13)
			return true;
	if(t[0]==t2[0])
		if(t[1]==(t2[1]-1))
			return true;
		else
			return false;
	else
		return false;
}
function ResaltarCarta(palo,num)
{
	for(var i = 1; i<8;i++)
	{
		lch = document.getElementById('Columna'+i).lastChild;
		if(lch.getAttribute('title') == palo + " " +num)
		{
			
			lch.setAttribute('class','ProSelected');
			return;
		}
	}
}
function Seleccionar(a)
{
	
	if(a.getAttribute('title')!="Carta Boca-Abajo")
	{
		if(SeleccionAnterior!=null && SeleccionAnterior !=a)
		{
			if(VerificarCondicion(a,SeleccionAnterior)==true)
			{
				a.setAttribute('class','');
				MoverColumna(SeleccionAnterior,a);
				
				SeleccionAnterior.setAttribute('class','');
				
				SeleccionAnterior=null;
				VerificarEscalera();
				return;
			}else{
				SeleccionAnterior.setAttribute('class','');
				SeleccionAnterior=null;
			}
		}
	
		a.setAttribute('class','Selected');
		SeleccionAnterior=a;
		ResaltarCarta(a.getAttribute('title').split(" ")[0],Math.abs(a.getAttribute('title').split(" ")[1])+1);
		ReAcomodarLasCartas();
	}else{
		if(a==a.parentNode.lastChild)
		{
			
			chn=a.parentNode.childNodes;
			TempCartas=new Array();
			for(var i = 0; i<chn.length;i++)
			{
				t=chn.item(i).getAttribute('title').split(" ");
				switch(t[0])
				{
					case 'Corazones':palo = 'c';break;
					case 'Diamante':palo = 'd';break;
					case 'Trebol':palo = 't';break;
					case 'Pica':palo = 'p';	break;
					case 'Carta':palo="Carta";break;
				}
				
				TempCartas.push(Array(t[1],palo));
			}
			CNOs=a.parentNode.id;
			CNO=CNOs.split("Columna")[1];
			
			Movimientos.push(Array("MostrarCarta",CNO));
			a.parentNode.innerHTML="";
			
			j=0;
			for(var i = 0; i<TempCartas.length-1;i++)
				AgregarCarta(CNO,TempCartas[i][1],TempCartas[i][0],true);
			
			for(var i = 0;i<CartasBocaAbajo.length;i++)
			{
				if(CartasBocaAbajo[i][0]==CNO && CartasBocaAbajo[i][1]==TempCartas.length)
				{
					AgregarCarta(CNO,CartasBocaAbajo[i][2][1],CartasBocaAbajo[i][2][0]);
					break;
				}
			}
			
		}
	}
	
}

function VerificarEscalera()
{
	for(var cn=1;cn<8;cn++)
	{
		chn=document.getElementById('Columna'+cn).childNodes;
		j=1;
		for(var i = chn.length-1;i>-1;i--)
		{
			t= chn.item(i).getAttribute('title').split(" ");
			if(t[1]==j)
				j++
			else
				break;
			if(j==14)
			{
				ColumnaAPila(cn,t[0]);
				Movimientos.push(Array("PilaCompleta",Array(t[0],cn)));
				Mensaje("Pila Completa!!");
				PILASCOmpletadas++;
				if(PILASCOmpletadas==4)
				{
					clearInterval(xx);
					Mensaje("Has Ganado!!");
					MostrarEstadisticas();
				}
				break;
			}
		}
	}
}
function ColumnaAPila(cn,palo)
{
	chn=document.getElementById('Columna'+cn).childNodes;
	TempCartas=new Array();
	for(var i = 0; i<chn.length;i++)
	{
		t=chn.item(i).getAttribute('title').split(" ");
		switch(t[0])
		{
			case 'Corazones':				palo = 'c';			break;
			case 'Diamante':				palo = 'd';			break;
			case 'Trebol':				palo = 't';			break;
			case 'Pica':				palo = 'p';			break;
			case 'Carta':				palo="Carta";			break;
		}
		
		TempCartas.push(Array(t[1],palo));
	}
	
	document.getElementById('Columna'+cn).innerHTML="";
	j=0;
	for(var i = 0; i<TempCartas.length;i++)
	{
		
		if(TempCartas[i][0]==13 && TempCartas[i][1]==palo)
			j=1;
		if(j==0)
			AgregarCarta(cn,TempCartas[i][1],TempCartas[i][0]);
	}
	if(document.getElementById('Columna'+cn).innerHTML=="")
		AgregarPozo(cn);
	
	AgregarAPila(palo);
	AddPuntaje(1000);
}
function Formato2(num)
{
	if(num<10)
		return "0"+num;
	return num;
}
function TimeAction()
{
	tim = document.getElementById('tiempo');
	time = Formato2(Math.floor(TiempoTotal/60)) + ":" + Formato2((TiempoTotal-(Math.floor(TiempoTotal/60))*60));

	tim.innerHTML="Tiempo: " + time;
	TiempoTotal++;
}
function FormatoMillon(num)
{
	if(num<1000000 && num >=0)
	{
		tmp = (1000000+num)+"";
		//tmp[tmp.lastIndexOf('1')]='.';
		tmp2=tmp.split("");
		tmp2[0]="0";
		return tmp2.join('');
	}else if(num>0)
		return num;
	else{
		
		tmp = (-1000000+num)+"";
		//tmp[tmp.lastIndexOf('1')]='.';
		tmp2=tmp.split("");
		tmp2[1]="0";
		return tmp2.join('');
	}
		
}
function AddPuntaje(num)
{
	//1000000
	if(Magic==true && num>0) num=-1*num;
	PuntajeTotal+=num;
	pun = document.getElementById('puntaje');
	pun.innerHTML= "Puntaje: " + FormatoMillon(PuntajeTotal);
	
	if(num>0)Mensaje("+"+num + " puntos");
}
function ReAcomodarLasCartas()
{
	for(var i=1;i<8 ;i++)
	{
		chn = document.getElementById('Columna'+i).childNodes;
		var mar=0;
		if(chn.length>6)
		{
			mar = (504-CH*chn.length)/(chn.length-1);
			//846
			mar = Math.round(mar);
		}else{
			mar = -50;
		}
		if(mar<-100) mar = -100;
		for(var j = 0; j<chn.length;j++)
		{
			chn.item(j).style.marginBottom=mar+'px';
		}
		
	}
}
function Mensaje(str)
{
	msg = document.getElementById('DivMensaje');
	msg.innerHTML=str;
	msg.className="MsgGood play";
	
	setTimeout(function(){msg.className="MsgGood";},3000);
}
function MostrarEstadisticas()
{
	Pun = "Puntaje: " + FormatoMillon(PuntajeTotal);
	Tim= "Tiempo: " + Formato2(Math.floor(TiempoTotal/60)) + ":" + Formato2((TiempoTotal-(Math.floor(TiempoTotal/60))*60));
	
	document.getElementById('Estats').innerHTML=Pun +'<br />' + Tim
	document.getElementById('MenuDiv').className="Ver Si";
	
}
function LimpiarTablero()
{
	document.getElementById('PilasCompletas').innerHTML="";
	for(var i = 1; i<8;i++)
		document.getElementById('Columna'+i).innerHTML="";
}
function NuevoJuego()
{
	LimpiarTablero();
	StartGame();
	ReAcomodarLasCartas();
	
	xx=setInterval(function (){TimeAction();ReAcomodarLasCartas();},1000);	
	document.getElementById('MenuDiv').className="Ver No";
}
