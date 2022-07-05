'use strict';
import Filter from './filter';
import YaMapAll from './map';
import Swiper from 'swiper';

export default class Index {
    constructor($block) {
        var self = this;
        this.block = $block;
        this.filter = new Filter($('[data-filter-wrapper]'));
        this.yaMap = new YaMapAll(this.filter);


        //КЛИК ПО КНОПКЕ "НАЙТИ"
        $('[data-filter-button]').on('click', function() {
            self.redirectToListing();
        });

        //КЛИК ПО КНОПКЕ "СБРОСИТЬ"
		$('[data-filter-cancel]').on('click', function () {
			self.redirectToListing();

			if ($('[data-filter-button]').hasClass('_disabled')) {
				$('[data-filter-button]').removeClass('_disabled');
			}

		});

         //КЛИК ПО ПАГИНАЦИИ
         $('body').on('click', '[data-pagination-wrapper] [data-listing-pagitem]', function() {
            self.redirectToListing($(this).data('page-id'));
        });

        //Развернуть текст
        $('.more-text-link').click(function() {
            $(this).closest('.more-text').find('p').addClass('active');
            $(this).remove();
        })

        //Закрыть объект на карте
        $('.map-item-close').on('click', function(){
            let mapItem = $(this).closest('.map-item');
            $(mapItem).addClass('hide');
        });

        var topSlider = new Swiper('.swiper_top', {

            // width: 1136,
            initialSlide: 1,
            spaceBetween: 0,
            loop: true,

            slidesPerView: 'auto',
            centeredSlides: true,

            navigation: {
                nextEl: '.top-swiper-button-next',
                prevEl: '.top-swiper-button-prev',
            },

            pagination: {
                el: '.top-swiper-pagination',
                clickable: true,
            },

            breakpoints: {

                // 1200: {
                // 	width: 768,
                // },
            },

        });

        let swiper = new Swiper('.listing-swiper', {
            loop: true,
            pagination: {
                el: '.swiper-pagination',
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
        });

        const answersQuestionsSlider = new Swiper('.answers-questions-slider', {
            loop: true,
            navigation: {
                nextEl: '.answers-swiper-button-next',
                prevEl: '.answers-swiper-button-prev',
            },
            observer: true,
            observeParents: true

        });
        const answersQuestionsSliderMobile = new Swiper('.answers-questions-slider-mobile', {
            loop: true,
            observer: true,
            observeParents: true,
            spaceBetween: 10,
            navigation: {
                nextEl: '.answers-swiper-button-next',
                prevEl: '.answers-swiper-button-prev',
            },

        });

        var swiperGoodToKnow = undefined;
        function initSwiper() {
            var screenWidth = $(window).width();
            if(screenWidth < 690 && swiperGoodToKnow == undefined) {            
                swiperGoodToKnow = new Swiper('.swiper-good-to-know', {            
                    loop: true,
                    observer: true,
                    observeParents: true,
                    watchSlidesProgress: true,
                    slidesPerView: 1,
                    spaceBetween: 20,
                });
            } else if (screenWidth > 690 && swiperGoodToKnow != undefined) {
                swiperGoodToKnow.destroy();
                swiperGoodToKnow = undefined;
                jQuery('.swiper-good-to-know .swiper-wrapper').removeAttr('style');
                jQuery('.swiper-good-to-know .swiper-slide').removeAttr('style');            
            }        
        }

        initSwiper();

        $(window).on('resize', function(){
            initSwiper();       
        });
        

    }

    redirectToListing(page = 1) {
        // this.filter.filterMainSubmit();
        // this.filter.promise.then(
        //     response => {
        //        // ym(66603799, 'reachGoal', 'filter');
        //         //dataLayer.push({ 'event': 'event-to-ga', 'eventCategory': 'Search', 'eventAction': 'Filter' });
        //         //window.location.href = response;
        //     }
        // );
        let self = this;
        let index_per_page = 6;

        self.block.addClass('_loading');
        self.filter.filterListingSubmit(page, index_per_page);
        self.filter.promise.then(
            response => {
                //ym(66603799,'reachGoal','filter');
                //dataLayer.push({'event': 'event-to-ga', 'eventCategory' : 'Search', 'eventAction' : 'Filter'});
                let listingHtml = $('[data-listing-list]').html();

                if(page > 1 && response.pagination !== ''){
                    $('[data-listing-list]').html(listingHtml + response.listing);
                }else{
                    $('[data-listing-list]').html(response.listing);
                }

                $('[data-listing-title]').html(response.title);
                $('[data-listing-text-top]').html(response.text_top);
                $('[data-listing-text-bottom]').html(response.text_bottom);
                $('[data-pagination-wrapper]').html(response.pagination);

                if(response.hide_pagination_class == 'hide'){
                    $('.home-listing-more-btn').addClass('hide');
                }
                
                self.block.removeClass('_loading');
                //$('html,body').animate({ scrollTop: $('.items_list').offset().top - 160 }, 400);
                //history.pushState({}, '', '/ploshhadki/' + response.url);
            }
        );
    }


}