<?php

namespace frontend\modules\hospice\widgets;

use yii\base\Widget;
use yii\widgets\Menu;

class SecondMenu extends Widget{

    // public function init(){
    //     parent::init();
    //     if ($this->message === null) {
    //         $this->message = 'Hello World';
    //     }
    // }

    public function run(){
        return Menu::widget([
            'items' => [
                ['label' => 'Паллиативные центры', 'url' => ['/palliativnye-centry/'], 'active'=> \Yii::$app->request->url == '/palliativnye-centry/'],
                ['label' => 'Хосписы', 'url' => ['/hospisy/'], 'active'=> \Yii::$app->request->url == '/hospisy/'],
                ['label' => 'Стационары', 'url' => ['/stacionary/'], 'active'=> \Yii::$app->request->url == '/stacionary/'],
                ['label' => 'Геронтологические центры', 'url' => ['/gerontologicheskie-centry/'], 'active'=> \Yii::$app->request->url == '/gerontologicheskie-centry/'],
                ['label' => 'Гериатрические центры', 'url' => ['/geriatricheskie-centry/'], 'active'=> \Yii::$app->request->url == '/geriatricheskie-centry/'],
            ],
            'options' => [
                'tag' => false,
            ],
            'activeCssClass'=>'active',
            'activateItems' => true,
        ]);
    }
}