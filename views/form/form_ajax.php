<?php

use Yii;
use yii\widgets\ActiveForm;
use yii\helpers\Html;
use frontend\modules\hospice\models\TopBannerForm;
use yii\widgets\Pjax;

$top_banner_form_model = new TopBannerForm();



Pjax::begin();

$form = ActiveForm::begin([
    'options' => [
        'id' => 'consultation-form', 
        'method' => 'POST',
        'data-pjax' => true,
    ],
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
echo Html::beginTag('div', ['class' => 'form-response']);
echo Html::endTag('div');
ActiveForm::end();

Pjax::end();


$js = <<<SCRIPT
$('#consultation-form').on('beforeSubmit', function(){
    var form = $(this);
    var data = form.serialize();
    $.ajax({
         url: '/test/form/',
         type: 'POST',
         data: data,
    })
    .done(function(data) {
        if (data) {
            console.log(data);
            form[0].reset();
            $('.form-response').append(data);
        }
    })
    .fail(function () {
        alert('Произошла ошибка при отправке данных!');
    })
    return false; 
 });
SCRIPT;
$this->registerJs($js);
