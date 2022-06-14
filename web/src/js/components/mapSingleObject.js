"use strict";
import Swiper from 'swiper';
const data = require('./data-cityes.json');

export default class YaMapSingleObject{
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
          let map = document.querySelector(".map");
          let myMap = new ymaps.Map(map, {center: [55.763118, 37.633787], zoom: 12, controls: []},
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

          let objectCoordinates = [$("#map").attr("data-mapDotX"), $("#map").attr("data-mapDotY")];
          let myBalloonHeader = $("#map").attr("data-name");
          let myBalloonBody = $("#map").attr("data-address");
          let iconTemplate = ymaps.templateLayoutFactory.createClass(
            '<div class="map-icon">$[properties.price]</div>');

          let myBalloonContentLayout = ymaps.templateLayoutFactory.createClass(
            `<div class="balloon_layout _single_object" style="background:#fff">
              <div class="arrow"></div>
              <div class="balloon_inner">
                <div class="balloon_inner_header">
                  {{properties.balloonContentHeader}}
                </div>
                <div class="balloon_inner_body">
                  {{properties.balloonContentBody}}
                </div>
              </div>
            </div>`
          );

          let myBalloonLayout = ymaps.templateLayoutFactory.createClass(
            `<div class="map-item">
            <div class="map-item-close map-close-mobile"></div>
                <div class="listing-list-item">
                    <div class="list-item-slider">
                        <div class="swiper map-swiper">
                            
                            <div class="swiper-wrapper">
                                <div class="swiper-slide">
                                    <img src="/image/houses-listing/house2.png" alt="">
                                </div>
                                <div class="swiper-slide">
                                    <img src="/image/houses-listing/house2.png" alt="">
                                </div>
                                <div class="swiper-slide">
                                    <img src="/image/houses-listing/house2.png" alt="">
                                </div>
                            </div>
        
                            <div class="swiper-pagination swiper-pagination-bullets"><span class="swiper-pagination-bullet swiper-pagination-bullet-active"></span><span class="swiper-pagination-bullet"></span><span class="swiper-pagination-bullet"></span></div>
        
                            <div class="map-swiper-button-prev swiper-button-prev" tabindex="0" role="button" aria-label="Previous slide"></div>
                            <div class="map-swiper-button-next swiper-button-next" tabindex="0" role="button" aria-label="Next slide"></div>
        
                        </div>
                    </div>
                    <div class="list-item-content">
                        <div class="map-item-close map-close-desc">
                        </div>
                        <div class="list-item-title">
                            <a href="#">$[properties.name]</a>
                        </div>
                        <div class="list-item-desc">
                            <p>
                            $[properties.address]
                            </p>
                        </div>
                        <div class="list-item-price-block">
                          <div class="list-item-price">
                              <div>
                                <span>$[properties.price]</span> рублей/сутки
                              </div>
                              <div>
                                <span>$[properties.price]</span> руб./сутки
                              </div>
                          </div>

                          <div class="list-item-price-comment">
                              <div>
                                <span>Цена за месяц: от 45000 рублей</span>
                              </div>
                              <div>
                                <span>от 45000 руб./мес.</span>
                              </div>
                          </div>
                        </div>
                        <div class="list-item-btns">
                            <button class="btn">Забронировать</button>
                            <button class="btn-white">О хосписе</button>
                        </div>
                    </div>
                </div>
        
            </div> `,
            {
              build: function () {
                this.constructor.superclass.build.call(this);
                
                
                this._$element = $('.map-item', this.getParentElement());

                this.applyElementOffset();

                this._$element.find('.map-item-close')
                    .on('click', $.proxy(this.onCloseClick, this));

                this.mapSlider = new Swiper('.map-swiper', {
                  loop: true,
                  observer: true,
                  observeParents: true,
                  navigation: {
                      nextEl: '.map-swiper-button-next',
                      prevEl: '.map-swiper-button-prev',
                  },
                  pagination: {
                    el: '.swiper-pagination',
                },
                });    
            },
            clear: function () {
              this._$element.find('.map-item-close')
                  .off('click');

              this.constructor.superclass.clear.call(this);
            },
            onSublayoutSizeChange: function () {
              myBalloonLayout.superclass.onSublayoutSizeChange.apply(this, arguments);

              if(!this._isElement(this._$element)) {
                  return;
              }

              this.applyElementOffset();

              this.events.fire('shapechange');
            },
            applyElementOffset: function () {

              this._$element.css({
                  left: -(this._$element[0].offsetWidth / 2),
                  top: -(this._$element[0].offsetHeight)
              });
            },
            onCloseClick: function (e) {
              e.preventDefault();
              this.events.fire('userclose');
            },
            getShape: function () {
              if(!this._isElement(this._$element)) {
                  return myBalloonLayout.superclass.getShape.call(this);
              }

              var position = this._$element.position();

              return new ymaps.shape.Rectangle(new ymaps.geometry.pixel.Rectangle([
                  [position.left, position.top], [
                      position.left + this._$element[0].offsetWidth,
                      position.top + this._$element[0].offsetHeight
                  ]
              ]));
            },
            _isElement: function (element) {
              return element && element[0];
            }
            }
          );

          // let object = window.object = new ymaps.Placemark(objectCoordinates, {
          //   balloonContentHeader: myBalloonHeader,
          //   balloonContentBody: myBalloonBody,
          //   iconContent: 'от 1100 руб.',
          // }, {
          //   iconLayout: iconTemplate,
          //   iconShape: {
          //     type: 'Rectangle',
          //     coordinates: [
          //         [0, 0], [100, 40]
          //     ]
          // },
          //   balloonLayout: myBalloonLayout,
          //   balloonContentLayout: myBalloonLayout,
          //   hideIconOnBalloonOpen: false,
          // });

          // myMap.geoObjects.add(object);
          myMap.setCenter(objectCoordinates);
          // object.balloon.open( "", "", {closeButton: false});
          // let dataPrice = data.features['properties'];   

        let objectManager = new ymaps.ObjectManager({
            gridSize: 32,
            geoObjectBalloonLayout: myBalloonLayout,
            geoObjectBalloonContentLayout: myBalloonLayout,
            geoObjectHideIconOnBalloonOpen: false,
            geoObjectBalloonOffset: [-360, 17],
            clusterize: false,
            clusterDisableClickZoom: false,
            clusterBalloonItemContentLayout: myBalloonLayout,
        });
        let iconShape = {
                  type: "Rectangle",
                  "coordinates": [
                      [0, 0], [100, 40]
                  ]
              };
             

        objectManager.objects.options.set('iconLayout', iconTemplate);
        objectManager.objects.options.set('iconShape', iconShape);
        myMap.geoObjects.add(objectManager);

        objectManager.add(data);
        // $.ajax({
        //     url: "data-cityes.json"
        // }).done(function(data) {
        //     objectManager.add(data);
        // });



        });
      });
  }
}