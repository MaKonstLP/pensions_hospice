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

        //КЛИК ПО КНОПКЕ "ПОДОБРАТЬ"
        $('[data-filter-button]').on('click', function() {
            self.reloadListing();
        });

        //КЛИК ПО КНОПКЕ "СБРОСИТЬ"
		$('[data-filter-cancel]').on('click', function () {
			//self.reloadListing();

			if ($('[data-filter-button]').hasClass('_disabled')) {
				$('[data-filter-button]').removeClass('_disabled');
			}

		});

        //КЛИК ПО ПАГИНАЦИИ
        $('body').on('click', '[data-pagination-wrapper] [data-listing-pagitem]', function() {
            self.reloadListing($(this).data('page-id'));
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

    }

    reloadListing(page = 1) {
        let self = this;
        let listing_per_page = 8;
        self.block.addClass('_loading');
        self.filter.filterListingSubmit(page, listing_per_page);
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
                    $('.listing-more-btn').addClass('hide');
                }

                self.block.removeClass('_loading');
                //$('html,body').animate({ scrollTop: $('.items_list').offset().top - 160 }, 400);
                //history.pushState({}, '', '/ploshhadki/' + response.url);
            }
        );
    }
}

