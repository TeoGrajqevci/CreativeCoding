class MapWithCountryInfo {
    constructor() {
      this.map = L.map('map', {
        center: [40, 15],
      
        zoomSnap: 0.01,
        zoom: 4,
        zoomControl: false,
        attributionControl: false,
        scale: true,
     
    
      
      });
  
      this.openStreetMap =  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 10,
        minZoom: 2.5,

      }).addTo(this.map);

      this.midi = new MidiConnection();
        this.midi.addEventListener('midi', this.handleMidiMessage.bind(this));
  
  
      this.map.on('mousemove', this.handleMouseClick.bind(this));

      this.map.dragging.disable();
        this.map.touchZoom.disable();
        this.map.doubleClickZoom.disable();
        this.map.scrollWheelZoom.disable();
        this.map.boxZoom.disable();
        this.map.keyboard.disable();


      this.valX = 0;
        this.valY = 0;

        this.click = false;

    }


   


    mapping(val,min, max, newMin, newMax) { 
        return (val - min) * (newMax - newMin) / (max - min) + newMin;
    }


  
  
    handleMouseClick(e) {
        if (this.click === true){
        const jsonFilePath = 'country.json';

        fetch(jsonFilePath)
            .then((response) => response.json())
            .then((data) => {
                this.nearestCountry = this.findNearestCountry(data.data, e.latlng.lat, e.latlng.lng);
            })
            .catch((error) => {
                console.error('Error fetching or parsing JSON file:', error);
            });
        }
    }

 

  
    
    findNearestCountry(data, lat, lng) {
        let nearestCountry = null;
        let minDistance = Infinity;

        for (let i = 0; i < data.length; i++) {
            const countryData = data[i];
            const countryLat = parseFloat(countryData[1]);
            const countryLng = parseFloat(countryData[2]);

            const distance = this.calculateDistance(lat, lng, countryLat, countryLng);

            if (distance < minDistance) {
                minDistance = distance;
                nearestCountry = countryData[0];
            }
        }
    

        const countryDiv = document.createElement('div');
        countryDiv.textContent = nearestCountry;
        document.body.appendChild(countryDiv);

        countryDiv.style.position = 'absolute';
        countryDiv.style.top = '0%';
        countryDiv.style.left = '0%';
        countryDiv.style.width = '25%';
        countryDiv.style.height = '6%';
        countryDiv.style.backgroundColor = 'rgba(29, 29, 29, 0.1)';
        countryDiv.style.backdropFilter = 'blur(10px)';
   
        countryDiv.style.opacity = '1';
        countryDiv.style.color = 'rgba(255, 0, 0, 1)';
        countryDiv.style.fontSize = '40px';
        countryDiv.style.fontFamily = 'Helvetica';
        countryDiv.style.textAlign = 'center';
        countryDiv.style.zIndex = '1000';
        countryDiv.style.cursor = 'none';
        countryDiv.style.display = 'flex';
        countryDiv.style.justifyContent = 'center';
        countryDiv.style.borderRadius = '30px'; 
        countryDiv.style.paddingTop = '10px'; 

        return nearestCountry || 'Unknown';
    }

    getNearestCountry() {
        return this.nearestCountry || 'Unknown';
      }

    
  
    calculateDistance(lat1, lng1, lat2, lng2) {
      const earthRadius = 6371;
      const dLat = this.toRadians(lat2 - lat1);
      const dLng = this.toRadians(lng2 - lng1);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = earthRadius * c;
  
      return distance;
    }
  
    toRadians(degrees) {
      return degrees * (Math.PI / 180);
    }
  

    handleMidiMessage(infos) {
       


        if (infos[3] === 21) {
            this.valX = this.mapping(infos[4], 0, 127, 0, 5);
            
            const currentCenter = this.map.getCenter();
            const newLng = this.mapping(this.valX, 0, 5, -180, 180);
            const newCenter = L.latLng(currentCenter.lat, newLng);
            this.map.setView(newCenter, this.map.getZoom());
        }
    
    if (infos[3] === 22) {
        this.valY = this.mapping(infos[4], 0, 127, 0, 5);

        const currentCenter = this.map.getCenter();
        const newLat = this.mapping(this.valY, 0, 5, -90, 90);
        const newCenter = L.latLng(newLat, currentCenter.lng);
        this.map.setView(newCenter, this.map.getZoom());
    }

    if (infos[3] === 23) {
        this.valZoom = this.mapping(infos[4], 0, 127, 4, 8);    
        this.map.setZoom(this.valZoom);
    }
   
    if (infos[3] === 40) {
        this.valDown = infos[4]
        if (this.valDown > 0){
            this.click = true;
        } 
    }

        if (infos[3] === 36){
            this.valUp = infos[4]
            if (this.valUp > 0){
                this.click = false;
            }
         
        }

        if (infos[3] === 42){
            this.valCamera = infos[4]
            if (this.valCamera > 0){
                this.map.setView([40, 15], 4);
            }
        }

        if (infos[3] === 41){
            this.valCctv = infos[4]
            if (this.valCctv > 0){
                
              

                this.getRandomWebcams();
            }
        }
     

         this.handleMouseClick();
        
     
    console.log(this.click);  
}




async getRandomWebcams() {
    var countryName = this.nearestCountry;
    var webcamInfoContainer = document.getElementById("webcamInfoContainer");
  
  
    webcamInfoContainer.innerHTML = "";
  
    try {
     
  
        const countryUrl = `http://www.insecam.org/en/bycountry/${countryName}/`;
  
        const countryResponse = await fetch(countryUrl);
        const countryHtmlContent = await countryResponse.text();
  
  
        const totalPagesRegex = /<a[^>]*?page=(\d+)[^>]*?>\d+<\/a>/g;
        const totalPagesMatches = countryHtmlContent.matchAll(totalPagesRegex);
  
        let totalPages = 300;
        for (const match of totalPagesMatches) {
            totalPages = Math.max(totalPages, parseInt(match[300]));
        }
  
   
        const randomPage = Math.floor(Math.random() * totalPages) + 1;
  
        // Fetch page 
        const randomPageUrl = `http://www.insecam.org/en/bycountry/${countryName}/?page=${randomPage}`;
        const randomPageResponse = await fetch(randomPageUrl);
        const randomPageHtmlContent = await randomPageResponse.text();
  
        // Extract webcam IDs 
        const webcamIdsRegex = /<a class="thumbnail-item__wrap" href="\/en\/view\/(\d+)\/"/g;
        const webcamIdsMatches = Array.from(randomPageHtmlContent.matchAll(webcamIdsRegex), match => match[1]);
  
        if (webcamIdsMatches && webcamIdsMatches.length > 0) {
         
            const randomWebcamId = webcamIdsMatches[Math.floor(Math.random() * webcamIdsMatches.length)];
  
  
            const convertedWebcamUrl = `http://www.insecam.org/img/${randomWebcamId}/`;
  
            // URL
            webcamInfoContainer.innerHTML = `<p>Converted Webcam URL: <a href="${convertedWebcamUrl}" target="_blank">${convertedWebcamUrl}</a></p>`;




        const helloDiv = document.createElement('div');
        helloDiv.textContent = 'CCTV';
        document.body.appendChild(helloDiv);

        helloDiv.style.position = 'absolute';
        helloDiv.style.top = '100%';
        helloDiv.style.left = '100%';
        helloDiv.style.transform = 'translate(-100%, -100%)';
        helloDiv.style.width = '100%';
        helloDiv.style.height = '100%';
        helloDiv.style.backgroundColor = 'rgba(29, 29, 29, 0.61)';
        helloDiv.style.backdropFilter = 'blur(10px)';
        helloDiv.style.color = 'rgba(255, 0, 0, 1)  ';
        helloDiv.style.fontFamily = 'Helvetica';
        helloDiv.style.fontSize = '100px';
        helloDiv.style.textAlign = 'center';
        helloDiv.style.zIndex = '1000';
        helloDiv.style.cursor = 'pointer';

        const closeCross = document.createElement('div');
        closeCross.textContent = 'X';
        closeCross.style.position = 'absolute';
        closeCross.style.top = '20px';
        closeCross.style.right = '20px';
        closeCross.style.color = 'red';
        closeCross.style.fontSize = '30px';
        closeCross.style.cursor = 'pointer';
        closeCross.addEventListener('click', () => {
    document.body.removeChild(helloDiv);
});
helloDiv.appendChild(closeCross);

const webcamImage = document.createElement('img');
webcamImage.src = convertedWebcamUrl;

webcamImage.style.display = 'block';
webcamImage.style.margin = 'auto';
webcamImage.style.width = '70%';
webcamImage.style.height = 'auto';
webcamImage.style.borderRadius = '10px';
webcamImage.style.backdropFilter = 'blur(10px)';

helloDiv.appendChild(webcamImage);
        } else {
            webcamInfoContainer.innerHTML = `No webcams available on random page ${randomPage}.`;
        }
    } catch (error) {
        console.error('Error fetching webcam data:', error);
        webcamInfoContainer.innerHTML = 'Error fetching webcam data. Please try again later.';
    }
  }
  
    
   
  }
  
  
  
  
  
  
  