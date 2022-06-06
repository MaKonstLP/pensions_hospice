<?php

namespace frontend\modules\hospice\widgets;

use yii\base\Widget;

class FirstMenu extends Widget{

    // public function init(){
    //     parent::init();
    //     if ($this->message === null) {
    //         $this->message = 'Hello World';
    //     }
    // }

    public function run(){
        return $this->render('first_menu.twig');
    }
}