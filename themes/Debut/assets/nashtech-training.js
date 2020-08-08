window.nashtechTraining = {};

(function($) {
    this.deliveryMesage = 'This Product will be delivery in 1 hour.';
    this.addDeliveryMessage = function () {
        $('.product-fast-delivery').html(this.deliveryMesage);
    };
}).apply(window.nashtechTraining, [jQuery || $]);

$(function () {
    window.nashtechTraining.deliveryMesage = "Custom delivery message from js";
    window.nashtechTraining.addDeliveryMessage();
});
