<?php

namespace frontend\modules\hospice\widgets;

use yii\base\Widget;

class FooterMenu extends Widget{

    // public function init(){
    //     parent::init();
    //     if ($this->message === null) {
    //         $this->message = 'Hello World';
    //     }
    // }

    public function run(){
        return $this->render('footer_menu.twig');
    }
}