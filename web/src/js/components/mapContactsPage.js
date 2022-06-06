export default class YaMapContacts{
    constructor(){
      let self = this;
      var fired = false;
  
      window.addEventListener('click', () => {
          if (fired === false) {
              fired = true;
              load_other();
        }
      }, {passive: true});
   
      window.addEventListener('scroll', () => {
          if (fired === false) {
              fired = true;
              load_other();
        }
      }, {passive: true});
  
      window.addEventListener('mousemove', () => {
          if (fired === false) {
              fired = true;
              load_other();
        }
      }, {passive: true});
  
      window.addEventListener('touchmove', () => {
          if (fired === false) {
              fired = true;
              load_other();
        }
      }, {passive: true});
  
      function load_other() {
        setTimeout(function() {
          self.init();
        }, 100);
        
      }
    }
  
    script(url) {
      if (Array.isArray(url)) {
        let self = this;
        let prom = [];
        url.forEach(function (item) {
          prom.push(self.script(item));
        });
        return Promise.all(prom);
      }
  
      return new Promise(function (resolve, reject) {
        let r = false;
        let t = document.getElementsByTagName('script')[0];
        let s = document.createElement('script');
  
        s.type = 'text/javascript';
        s.src = url;
        s.async = true;
        s.onload = s.onreadystatechange = function () {
          if (!r && (!this.readyState || this.readyState === 'complete')) {
            r = true;
            resolve(this);
          }
        };
        s.onerror = s.onabort = reject;
        t.parentNode.insertBefore(s, t);
      });
    }
  
    init() {
      this.script('//api-maps.yandex.ru/2.1/?lang=ru_RU').then(() => {
          const ymaps = global.ymaps;
          ymaps.ready(function(){
            let map = document.querySelector("#map-contacts");
            let myMap = new ymaps.Map(map, {center: [55.76, 37.64], zoom: 15, controls: []},
                        {suppressMapOpenBlock: true});
  
            myMap.behaviors.disable('scrollZoom');
  
            let zoomControl = new ymaps.control.ZoomControl({
              options: {
                  size: "small",
                  position: {
                    top: 10,
                    right: 10
                  }
  
              }
            });
  
            let geolocationControl = new ymaps.control.GeolocationControl({
              options: {
                noPlacemark: true,
                position: {
                  top: 10,
                  left: 10
                }
              }
          });
  
            myMap.controls.add(zoomControl);
            myMap.controls.add(geolocationControl);
  
            let objectCoordinates = [$("#map-contacts").attr("data-mapDotX"), $("#map-contacts").attr("data-mapDotY")];
            let iconTemplate = ymaps.templateLayoutFactory.createClass(
              `<div class="contacts-page-map-marker">
                <img src="/image/map-mark.png">
              </div>`
            );
  
            let object = window.object = new ymaps.Placemark(objectCoordinates, {
              hintContent: 'Наш адрес',
            }, {
              iconLayout: iconTemplate,
              iconShape: {
                type: 'Rectangle',
                coordinates: [
                    [50, 53], [100, 106]
                ]
              },
              hideIconOnBalloonOpen: false,
            });
            myMap.geoObjects.add(object);
            myMap.setCenter(objectCoordinates);
          });
        });
    }
  }