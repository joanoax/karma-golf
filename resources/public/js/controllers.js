'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('gridCtrl', [function($scope) {
      
  }])
  .controller('MyCtrl2', [function() {

  }]);

function gridCtrl($scope) {
  $scope.phones = [
    {"name": "Nexus S",
     "snippet": "Fast just got faster with Nexus S."},
    {"name": "Motorola XOOM™ with Wi-Fi",
     "snippet": "The Next, Next Generation tablet."},
    {"name": "MOTOROLA XOOM™",
     "snippet": "The Next, Next Generation tablet."}
  ];
}
