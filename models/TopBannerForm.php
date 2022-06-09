<?php
namespace frontend\modules\hospice\models;
use yii\base\Model;

class TopBannerForm extends Model{

    public $user_phone;
    public $accept;

    public function attributeLabels(){
        return [
            'user_phone' => '',
        ];
    }

    public function rules(){
        return[
            [['user_phone'], 'required', 'message' => 'Обязательное поле'],
            ['accept', 'required', 'requiredValue' => 1, 'message' => 'Необходимо принять условия']
        ];
    }

    
}