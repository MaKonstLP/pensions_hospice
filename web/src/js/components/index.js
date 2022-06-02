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


        //КЛИК ПО КНОПКЕ "ПОДОБРАТЬ"
        // $('[data-filter-button]').on('click', function() {
        //     self.redirectToListing();
        // });

        $('.more-text-link').click(function() {
            $(this).closest('.more-text').find('p').addClass('active');
            $(this).remove();
        })

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

        let swiper = new Swiper('.home-swiper', {
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
        const mapSlider = new Swiper('.map-swiper', {
            loop: true,
            observer: true,
            observeParents: true,
            navigation: {
                nextEl: '.map-swiper-button-next',
                prevEl: '.map-swiper-button-prev',
            },

        });

        if ($(window).width() < 690) {

            const swiperGoodToKnow = new Swiper('.swiper-good-to-know', {
                loop: true,
                observer: true,
                observeParents: true,
                watchSlidesProgress: true,
                slidesPerView: 1,
                spaceBetween: 20,


            });
        }
    }





    redirectToListing() {
        this.filter.filterMainSubmit();
        this.filter.promise.then(
            response => {
                ym(66603799, 'reachGoal', 'filter');
                dataLayer.push({ 'event': 'event-to-ga', 'eventCategory': 'Search', 'eventAction': 'Filter' });
                window.location.href = response;
            }
        );
    }


}