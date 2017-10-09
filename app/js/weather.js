//module
var weatherApp = angular.module('weatherApp', [ 'ui.router']);
//Routes
weatherApp.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/home');

    $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: 'pages/home.html',
            controller: 'homeController',
            controllerAs: 'homeCtrl'
        })
        .state('forecast', {
            url: '/forecast',
            templateUrl: 'pages/forecast.html',
            controller: 'forecastController',
            controllerAs: 'forecastCtrl'
        })
}]);
//Services

weatherApp.service('cityService', function(){
    this.city = 'Bradford';
});

weatherApp.factory('pagination', function($sce) {
    var currentPage = 0;
    var itemsPerPage = 12;
    var products = [];

    return {
        setProducts: function (newProducts) {
            products = newProducts;
        },
        getPageProducts: function (num) {
            var num = angular.isUndefined(num) ? 0: num;
            var first = itemsPerPage * num;
            var last = first + itemsPerPage;
            currentPage = num;
            last = last > products.length ? (products.length -1) : last;
            return products.slice(first, last);
        },
        getTotalPagesNum: function () {
            return Math.ceil(products.length/itemsPerPage);
        },
        getPaginationList: function () {
            var pagesNum = this.getTotalPagesNum();
            var paginationList = [];
            paginationList.push({
                name: $sce.trustAsHtml('&laquo;'),
                link:'prev'
            });
            for(var i = 0; i < pagesNum; i++){
                var name = i + 1;
                paginationList.push({
                    name: $sce.trustAsHtml(String(name)),
                    link: i
                });
            }
            paginationList.push({
                name: $sce.trustAsHtml('&raquo;'),
                link:'next'
            });
            if(pagesNum > 1) {
                return paginationList;
            }else {
                return false;
            }
        },
        getPrevPageProducts: function() {
            var prevPageNum = currentPage - 1;
            if ( prevPageNum < 0 ) prevPageNum = 0;
            return this.getPageProducts( prevPageNum );
        },

        getNextPageProducts: function() {
            var nextPageNum = currentPage + 1;
            var pagesNum = this.getTotalPagesNum();
            if ( nextPageNum >= pagesNum ) nextPageNum = pagesNum - 1;
            return this.getPageProducts( nextPageNum );
        },
        getCurrentPageNum: function () {
            return currentPage;
        }
    }
});

//controllers
weatherApp.controller('homeController', ['$scope', 'cityService', function($scope, cityService){
    $scope.city = cityService.city;

    $scope.$watch('city', function(){
        cityService.city = $scope.city;
    })
}]);
weatherApp.controller('forecastController', ['$scope','$http', 'cityService', 'pagination', function($scope, $http, cityService, pagination){
    $scope.city = cityService.city;
    $http.get('https://www.metoffice.gov.uk/pub/data/weather/uk/climate/stationdata/bradforddata.txt')
        .then(function (response) {
            $scope.weatherArr = response.data.split('\n');
            $scope.weatherArr.splice(0,7);
            $scope.result = [];
            $scope.weatherArr.forEach(function(el){
                var tmpRowArr = el.replace(/  +/g, ' ').replace(/^\s*/, '').split(' ');
                var tmpOBj = {
                    year: tmpRowArr[0],
                    month: tmpRowArr[1],
                    tmax: tmpRowArr[2],
                    tmin: tmpRowArr[3],
                    af: tmpRowArr[4],
                    rain: tmpRowArr[5],
                    hours: tmpRowArr[6]

                };
                $scope.result.push(tmpOBj);
            });
            pagination.setProducts($scope.result);

            $scope.products = pagination.getPageProducts();
            $scope.paginationList = pagination.getPaginationList();
            $scope.propertyName = 'tmax';
            $scope.reverse = true;
            $scope.fltr = $scope(result);

            $scope.sortBy = function(propertyName) {
                $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
                $scope.propertyName = propertyName;
            }
        }, function (reason) {
            console.log('Data Error');
        });
    $scope.showPage = function (page) {
        if ( page == 'prev' ) {
            $scope.products = pagination.getPrevPageProducts();
        } else if ( page == 'next' ) {
            $scope.products = pagination.getNextPageProducts();
        } else {
            $scope.products = pagination.getPageProducts( page );
        }
    };
    $scope.currentPageNum = function(){
        return pagination.getCurrentPageNum();
    };

}]);
var app=angular
.module("myModule",[])
.controller("myController",function ($scope) {
    $scope.sortColumn="year";
    $scope.reverseSort=false;
    $scope.sortData=function(column){
        $scope.reverseSort=($scope.sortColumn == column)?!$scope.reverseSort:false;
        $scope.sortColumn=column;
    };
    $scope.getSortClass=functin(column)
    {
        if($scope.sortColumn == column){
            return $scope.reverseSort ? 'arrow-down' : 'arrow-up'
        }
        return '';
    }
});