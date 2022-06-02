'use strict';
import Filter from './filter';
//import YaMapAll from './map';
import Swiper from 'swiper';

export default class Listing {
    constructor($block) {
        self = this;
        this.block = $block;
        this.filter = new Filter($('[data-filter-wrapper]'));
        //this.yaMap = new YaMapAll(this.filter);
        console.log(2);

        //КЛИК ПО КНОПКЕ "ПОДОБРАТЬ"
        $('[data-filter-button]').on('click', function() {
            self.reloadListing();
        });

        //КЛИК ПО ПАГИНАЦИИ
        $('body').on('click', '[data-pagination-wrapper] [data-listing-pagitem]', function() {
            self.reloadListing($(this).data('page-id'));
        });
        // console.log(this);

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

    }

    reloadListing(page = 1) {
        let self = this;

        self.block.addClass('_loading');
        self.filter.filterListingSubmit(page);
        self.filter.promise.then(
            response => {
                //console.log(response);
                //ym(66603799,'reachGoal','filter');
                //dataLayer.push({'event': 'event-to-ga', 'eventCategory' : 'Search', 'eventAction' : 'Filter'});
                $('[data-listing-list]').html(response.listing);
                $('[data-listing-title]').html(response.title);
                $('[data-listing-text-top]').html(response.text_top);
                $('[data-listing-text-bottom]').html(response.text_bottom);
                $('[data-pagination-wrapper]').html(response.pagination);
                self.block.removeClass('_loading');
                $('html,body').animate({ scrollTop: $('.items_list').offset().top - 160 }, 400);
                history.pushState({}, '', '/ploshhadki/' + response.url);
            }
        );
    }
}