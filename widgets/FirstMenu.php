<?php

namespace frontend\modules\hospice\widgets;

use yii\base\Widget;
use yii\widgets\Menu;

class FirstMenu extends Widget{

    // public function init(){
    //     parent::init();
    //     if ($this->message === null) {
    //         $this->message = 'Hello World';
    //     }
    // }

    public function run(){
        return Menu::widget([
            'items' => [
                ['label' => 'Цены', 'url' => ['/ceny'], 'active'=> \Yii::$app->controller->id == 'ceny'],
                ['label' => 'Лицензии', 'url' => ['/licenzii'], 'active'=> \Yii::$app->controller->id == 'licenzii'],
                ['label' => 'О нас', 'url' => ['/o-nas'], 'active'=> \Yii::$app->controller->id == 'onas'],
                ['label' => 'Контакты', 'url' => ['/kontakty'], 'active'=> \Yii::$app->controller->id == 'contacts'],
                ['label' => 'Информация', 'url' => ['/informaciya'], 'active'=> \Yii::$app->controller->id == 'informaciya'],
            ],
            'options' => [
                'tag' => false,
            ],
            'activeCssClass'=>'active',
            'activateItems' => true,
        ]);
    }
}