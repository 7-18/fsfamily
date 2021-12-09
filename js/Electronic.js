const canciones = [
    "bensound-dance-elec.mp3",
    "bensound-dubstep-elec.mp3",
    "bensound-endlessmotion-elec.mp3",
    "bensound-erf-elec.mp3",
    "bensound-house-elec.mp3",
    "bensound-moose-elec.mp3",
    "bensound-popdance-elec.mp3",
    "bensound-scifi-elec.mp3"
    ]
    var indiceActual = new Array(1)
    function crearPlayList(){
        const listado = document.createElement('ol')
        listado.setAttribute("id", 'listadoMusica')
        for (let i = 0; i<canciones.length; i++){
            const item = document.createElement('li')
            item.appendChild(document.createTextNode(canciones[i]))
            item.setAttribute("id", canciones.indexOf(canciones[i]))
            listado.appendChild(item)
        }
        return listado
    }
    document.getElementById('playList').appendChild(crearPlayList())
    var listadoMusica= document.getElementById('listadoMusica')
    listadoMusica.onclick = (e) =>{
        const itemClick = e.target
        removeActive()
        itemClick.classList.add("active");
        reproduccionActual("Reproduciendo: "+ itemClick.innerText)
        loadMusic(itemClick.innerText)
        player.play()
        indiceActual[0]= e.target.id
        classIconPlay();
    }

    function classIconPlay(){
        var element = document.getElementById("iconPlay")
        element.classList.remove("fa-pause-circle");
        element.classList.add("fa-play-circle");
    }

    const volumen= document.getElementById("volumen")
    volumen.oninput= (e) =>{
        const vol = e.target.value
        player.volume =vol
    }

    const updateProgress = () =>{
        if (player.currentTime >0){
            const barra = document.getElementById('progress')
            barra.value = (player.currentTime / player.duration) * 100
            var duracionSegundos= player.duration.toFixed(0);
            dura=secondsToString(duracionSegundos);
            var actualSegundos = player.currentTime.toFixed(0)
            actual=secondsToString(actualSegundos);
            duracion= actual +' / '+ dura
            document.getElementById('timer').innerText=duracion
        }
        if (player.ended){
            nextMusic();
        }
    }

    function nextMusic(){
        const source = document.getElementById('source');
        var musicaActual= Number(indiceActual[0]);
        if (canciones.length == (musicaActual+1)){
            var siguiente = 0
        } else {
            var siguiente = musicaActual + 1
        }
        removeActive()
        var item=document.getElementById(siguiente)
        item.classList.add("active");
        loadMusic(canciones[siguiente]);
        player.play()
        indiceActual[0]= siguiente
        reproduccionActual("Reproduciendo: "+ canciones[siguiente])
        classIconPlay()
    }

    function prevMusic(){
        const source = document.getElementById('source');
        var musicaActual= Number(indiceActual[0]);
        if (musicaActual==0){
            var anterior= canciones.length - 1
        } else {
            var anterior = musicaActual - 1
        }
        removeActive()
        var item=document.getElementById(anterior)
        item.classList.add("active");
        loadMusic(canciones[anterior]);
        player.play()
        indiceActual[0]= anterior
        reproduccionActual("Reproduciendo: "+ canciones[anterior])
        classIconPlay()
    }

    function removeActive(){
        var elems = document.querySelectorAll(".active");
        [].forEach.call(elems, function(el) {
            el.classList.remove("active");
        });
        return elems
    }

    function reproduccionActual(texto){
        document.getElementById('currentPlay').innerText=texto
    }

    function loadMusic(ruta){
        var source = document.getElementById('source')
        var folder ="audio";
        source.src= folder+"/"+ruta
        var index= indiceActual[0]= canciones.indexOf(ruta)
        removeActive()
        var item=document.getElementById(index)
        item.classList.add("active");
        reproduccionActual("Reproduciendo: "+ ruta)
        player.load()
    }

    function togglePlay() {
        if (player.paused){
            toggleIcon();
            return player.play();
        } else {
            toggleIcon();
            return player.pause();
        }
    }

    function toggleIcon() {
    var element = document.getElementById("iconPlay");
    element.classList.toggle("fa-pause-circle");
    element.classList.toggle("fa-play-circle");
    }

    progress.addEventListener('click', adelantar);
    function adelantar(e){
        const scrubTime = (e.offsetX / progress.offsetWidth) * player.duration;
        player.currentTime = scrubTime;
        sonsole.log(e);
    }

    function secondsToString(seconds) {
        var hour="";
        if (seconds>3600){
            hour = Math.floor(seconds / 3600);
            hour = (hour < 10)? '0' + hour : hour;
            hour+=":"
        }
    var minute = Math.floor((seconds / 60) % 60);
    minute = (minute < 10)? '0' + minute : minute;
    var second = seconds % 60;
    second = (second < 10)? '0' + second : second;
    return hour  + minute + ':' + second;
    }
    loadMusic(canciones[0])