'use strict';

import Inputmask from 'inputmask';

export default class Filter {
    constructor($filter) {
        let self = this;
        this.$filter = $filter;
        this.state = {};

        this.init(this.$filter);

        self.getFilterAvalable();

        //КЛИК ПО БЛОКУ С СЕЛЕКТОМ
        this.$filter.find('[data-filter-select-current]').on('click', function() {
            let $parent = $(this).closest('[data-filter-select-block]');
            self.selectBlockClick($parent);
        });

        //КЛИК ПО чекбоксу
        this.$filter.find('[data-filter-select-item]').on('click', function() {
            $(this).toggleClass('_active');
            self.selectStateRefresh($(this).closest('[data-filter-select-block]'));
            self.reloadTotalCount();
            self.getFilterAvalable();
        });

        //КЛИК ПО радиобаттону
        this.$filter.find('[data-filter-checkbox-item]').on('click', function(e) {
            $(e.target).closest('.filter_checkbox').find('[data-filter-checkbox-item]').not(this).removeClass('_checked').prop('checked', false); // Снимаем чекбокс со всех остальных радиобаттонов, кроме выбранного
            $(this).toggleClass('_checked');
            self.checkboxStateRefresh($(this));
            self.reloadTotalCount();
        });

        //КЛИК ВНЕ БЛОКА С СЕЛЕКТОМ
        $('body').click(function(e) {
            if (!$(e.target).closest('.filter_select_block').length) {
                self.selectBlockActiveClose();
            }
        });

        //ИНПУТ
        this.$filter.find('[data-filter-input-block] input').on("keyup", function(event) {
            var selection = window.getSelection().toString();
            if (selection !== '') {
                return;
            }
            if ($.inArray(event.keyCode, [38, 40, 37, 39]) !== -1) {
                return;
            }
            var $this = $(this);
            var input = $this.val();
            input = input.replace(/[\D\s\._\-]+/g, "");
            input = input ? parseInt(input, 10) : 0;

            self.inputStateRefresh($(this).attr('name'), input);
            $this.val(function() {
                return (input === 0) ? "" : input.toLocaleString("ru-RU");
            });
        });

        //ОТкрытие скрытие попапа фильтра
        $('.sidebar').unbind("click").on('click', function(e) {
            let filterPopup = $(e.target).closest('.filter-item').find('.filter-popup');
            let filterField = $(e.target).closest('.filter-item').find('.filter-city-select');
            if($(e.target).hasClass('filter-select')){
                filterPopup.toggleClass('active');
            }
            if($(e.target).hasClass('filter-city-select')){
                filterField.toggleClass('active');
            }
        });
        
        //Больше параметров фильтра в моб. версии
        $('.filter-more-parameters span').on('click', function(e) {
            self.showAllSelect();
            $(this).remove();
        });

        //КЛИК ПО КНОПКЕ СБРОСИТЬ
		this.$filter.find('[data-filter-cancel]').on('click', function () {
			$(this).closest('[data-filter-wrapper]').find('[data-filter-select-item]._active').removeClass('_active');
			$(this).closest('[data-filter-wrapper]').find('[data-filter-checkbox-item]._checked').removeClass('_checked');

			let selectBlocks = $('[data-filter-select-block]');
			let checkboxes = $('[data-filter-checkbox-item]');

			//сброс всех данных из селектов
			selectBlocks.each(function () {
				delete self.state[$(this).data('type')];
			});
			//сброс всех данных из чекбоксов
			checkboxes.each(function () {
				delete self.state[$(this).data('type')];
			});

			self.selectStateRefresh($('[data-filter-select-block]'));
			// self.state = {};

			// self.reloadTotalCount();
		});
    }

    init() {
        let self = this;

        this.$filter.find('[data-filter-select-block]').each(function() {
            self.selectStateRefresh($(this));
        });

        this.$filter.find('[data-filter-checkbox-item]').each(function() {
            self.checkboxStateRefresh($(this));
        });
    }

    filterListingSubmit(page = 1, index_per_page) {
        let self = this;
        self.state.page = page;
        self.state.index_per_page = index_per_page;

        let data = {
            'filter': JSON.stringify(self.state)
        }

        this.promise = new Promise(function(resolve, reject) {
            self.reject = reject;
            self.resolve = resolve;
        });

        $.ajax({
            type: 'get',
            url: '/ajax/filter/',
            data: data,
            success: function(response) {
                response = $.parseJSON(response);
                self.resolve(response);
            },
            error: function(response) {

            }
        });
    }

    filterMainSubmit() {
        let self = this;
        let data = {
            'filter': JSON.stringify(self.state)
        }

        this.promise = new Promise(function(resolve, reject) {
            self.reject = reject;
            self.resolve = resolve;
        });

        $.ajax({
            type: 'get',
            url: '/ajax/filter-main/',
            data: data,
            success: function(response) {
                if (response) {
                    self.resolve('/ploshhadki/' + response);
                } else {
                    self.resolve(self.filterListingHref());
                }
            },
            error: function(response) {

            }
        });
    }

    selectBlockClick($block) {
        if ($block.hasClass('_active')) {
            this.selectBlockClose($block);
        } else {
            this.selectBlockOpen($block);
        }
    }

    selectBlockClose($block) {
        $block.removeClass('_active');
    }

    selectBlockOpen($block) {
        this.selectBlockActiveClose();
        $block.addClass('_active');
    }

    selectBlockActiveClose() {
        this.$filter.find('[data-filter-select-block]._active').each(function() {
            $(this).removeClass('_active');
        });
    }

    selectStateRefresh($block) {
        let self = this;
        let blockType = $block.closest('[data-type]').data('type');
        let $items = $block.find('[data-filter-select-item]._active');
        let selectText = '-';

        if ($items.length > 0) {
            self.state[blockType] = '';
            $items.each(function() {
                if (self.state[blockType] !== '') {
                    self.state[blockType] += ',' + $(this).data('value');
                    selectText = 'Выбрано (' + $items.length + ')';
                } else {
                    self.state[blockType] = $(this).data('value');
                    selectText = $(this).text();
                }
            });
        } else {
            delete self.state[blockType];
        }

        $block.find('[data-filter-select-current] p').text(selectText);
    }

    checkboxStateRefresh($item) {
        
        let blockType = $item.closest('[data-type]').data('type');
        if ($item.hasClass('_checked')) {
            this.state[blockType] = $item.data('value');
        } else {
            delete this.state[blockType];
        }
    }

    inputStateRefresh(type, val) {
        if (val > 0) {
            this.state[type] = val;
        } else {
            delete this.state[type];
        }
    }

    //ОБНОВЛЕНИЕ КОЛИЧЕСТВА ПЛОЩАДОК В КНОПКЕ "ПОКАЗАТЬ __"
	reloadTotalCount(page = 1) {
		this.filterCountItemsRefresh(page);

		this.promise.then(
			response => {
				if (response.total == 0) {
					$('[data-filter-button]').html('Показать (0)');
					$('[data-filter-button]').addClass('_disabled');
				} else {
					$('[data-filter-button]').html('Показать (' + response.total + ')');
					$('[data-filter-button]').removeClass('_disabled');
				}
			}
		);
	}


    filterCountItemsRefresh(page = 1) {
		let self = this;
		self.state.page = page;

		let data = {
			'filter': JSON.stringify(self.state)
		}

		this.promise = new Promise(function (resolve, reject) {
			self.reject = reject;
			self.resolve = resolve;
		});

		$.ajax({
			type: 'get',
			url: '/ajax/get-total/',
			data: data,
			success: function (response) {
				response = $.parseJSON(response);
				self.resolve(response);
			},
			error: function (response) {
			}
		});
	}

    
	refreshFilterItems(disabledItemsList) {
		var self = this;

		$('[data-filter-wrapper] [data-filter-select-item]._disabled').removeClass('_disabled');
        console.log(disabledItemsList);
        
		for (var filter in disabledItemsList) {
			$(`[data-filter-select-block][data-type='${filter}'] [data-filter-select-item]`).addClass('_disabled');
			$(`[data-filter-select-block][data-type='${filter}'] [data-filter-select-item] span`).html('');
			var currentArray = disabledItemsList[filter];

			var size = Object.keys(currentArray).length;

			if (typeof currentArray === 'string') {
				currentArray = currentArray.split(',');
				for (var item in currentArray) {
					$(`[data-value='${currentArray[item]}']`).removeClass('_disabled');
				}
			} else if (typeof currentArray === 'object') {
				let keys = Object.keys(currentArray)

				for (var i = 0, l = keys.length; i < l; i++) {
					// console.log(keys[i] + ' is ' + currentArray[keys[i]]);
					// keys[i] - ключ
					// currentArray[keys[i]] - а это свойство, доступное по этому ключу

					if (filter == 'district') {
						// console.log(11123344);
						// console.log('data-id');
						// console.log(keys[i]);
						// console.log(currentArray[keys[i]]);
					}

					$(`[data-id='${keys[i]}']`).removeClass('_disabled');
					$(`[data-id='${keys[i]}'] span`).html(currentArray[keys[i]]);

				}
			}
		}
	}

	getFilterAvalable() {
		var self = this;

		var data = {
			'filter': JSON.stringify(self.state),
		}

		$.ajax({
			type: 'get',
			url: '/ajax/ajax-update-filter/',
			data: data,
			success: function (response) {
				self.refreshFilterItems(JSON.parse(response));
			},
			error: function (response) {
				console.log('error');
			}
		});
	}

    filterListingHref() {
        if (Object.keys(this.state).length > 0) {
            var href = '/ploshhadki/?';
            $.each(this.state, function(key, value) {
                href += '&' + key + '=' + value;
            });
        } else {
            var href = '/ploshhadki/';
        }

        return href;
    }

   
    showAllSelect() {
        let filterMobile = $('.filter-mobile');
        $(filterMobile).addClass('active-all');
    }
}