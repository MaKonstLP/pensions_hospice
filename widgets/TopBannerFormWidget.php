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
        $top_banner_form_model = new TopBannerForm;

        if($top_banner_form_model->load(Yii::$app->request->post())){
         
        }

                 

        $form = ActiveForm::begin([
            'options' => ['id' => 'consultation-form']
        ]);
        echo $form->field($top_banner_form_model, 'user_phone', [
            'inputOptions' => ['placeholder'=> 'Email/телефон'],
            'template' => '<div class="form-input">{label}{input}{error}</div>'
        ]);
        echo $form->field($top_banner_form_model, 'accept', [
            'template' => '<div class="form-accept-check">{input}{label}{error}</div>'
        ])->checkbox([], false)->label('Я согласен с условиями обработки персональных данных', ['class'=>'form-accept-desc']);

        echo Html::beginTag('div', ['class' => 'form-submit']);
        echo Html::submitButton('Отправить', ['class' => 'btn']);
        echo Html::endTag('div');
        ActiveForm::end();
    }
}