function proximo_probable(muestreo) {

    base=50; // se puede cambiar pero dividiro en 50 subintervalos esta bien.-
    coef=0.03; // se puede cambiar pero es un coeficinente aceptable para la mayoria de las aplicaciones.-
    if (base==null) {base=50}; 
    if (coef==null) {StdDev=base*0.03} else {StdDev=base*coef};

    // Determinas Maximos y Minimos, intervalo y genera lo valores de arrglo universo.-
    maximo=muestreo.reduce((maximo,actual)=>{if (actual>maximo) {maximo=actual};return maximo});
    minimo=muestreo.reduce((minimo,actual)=>{if (actual<minimo) {minimo=actual};return minimo});    
    intervalo=(maximo-minimo)/base;universo=[];
    ind=0;while (ind<=base) {valor=minimo+(intervalo*ind);universo.push(valor);ind+=1;}     
    
    // Esta es la parte matematica de la funcion. Usa una formula Gaussiana Distribucion Normal para cada valor de universo.-
    lin=[];
    universo.forEach((ele)=>{  
        valor=0;
            muestreo.forEach((mue)=>{           
            var a= ele - mue;
            retorno= Math.exp(-(a*a)/(2*StdDev*StdDev))/ (Math.sqrt(2*Math.PI)*StdDev);       
            valor+=retorno;
        })
        lin.push(valor);       
    })   
    
    // Determina los picos de la funcion. En el caso de los extremos como no se sabe sin son picos se los divide por dos.-
    // Recorre los valores entre los extremos.- Luego ordena el array maximos.-
    maximos=[];
    maximos.push({ejex:universo[0] , ejey:lin[0]/2});
    maximos.push({ejex:universo[universo.length-1] , ejey:lin[lin.length-1]/2});
    universo.forEach((ele,index)=> {
        if ((index!=0) && (index!=universo.length-1)) {           
           antes=lin[index-1] ;
           despu=lin[index+1];
           actual=lin[index];
           if (actual>=antes && actual>=despu) {maximos.push({ejex: universo[index], ejey: lin[index]})}        
        }
    })    
    maximos.sort((a,b)=>{if (a.ejey>b.ejey) {return -1} else {return 1}});    

    // Obtiene el valor con la mayor probabilidad y su intervalo (pico1) y el que le sige (pico2).-
    pico1={valor: maximos[0].ejex, probabilidad: maximos[0].ejey,desde:maximos[0].ejex-StdDev,hasta:maximos[0].ejex+StdDev};
    pico2={valor: maximos[1].ejex, probabilidad: maximos[1].ejey,desde:maximos[1].ejex-StdDev,hasta:maximos[1].ejex+StdDev};    
    
    // Retorna ambos "picos".-
    // Se lee asi: el valor "valor" de pico1 es el que tiene la mayor probabilidad (probabilidad) de suceder en la proxima muestra. 
    // Dicho valor e ubica dentro del intervalo desde, hasta hasta.-
    return {pico1, pico2};
    }