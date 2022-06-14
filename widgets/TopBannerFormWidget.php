<?php

namespace frontend\modules\hospice\widgets;
use Yii;
use yii\base\Widget;
use yii\widgets\ActiveForm;
use yii\helpers\Html;
use frontend\modules\hospice\models\TopBannerForm;

class TopBannerFormWidget extends Widget{

    // public function init(){
    //     parent::init();
    //     if ($this->message === null) {
    //         $this->message = 'Hello World';
    //     }
    // }
    

    public function run(){
        return $this->render('top_banner_form');
    }
}