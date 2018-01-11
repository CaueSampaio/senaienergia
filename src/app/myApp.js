angular.module("myApp", ['ui.router'])
    .config(function($stateProvider, $urlRouterProvider, $locationProvider) {
        $urlRouterProvider.otherwise("/landing");
        $locationProvider.hashPrefix('');

        $stateProvider
            .state('landing', {
                url: "/landing",
                templateUrl: "app/directives/landing/landing.template.html"
            })
            .state('calculo', {
                url: "/calculo",
                templateUrl: "app/directives/calc/calc.template.html"
            });
    });