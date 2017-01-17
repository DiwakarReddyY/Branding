var app = angular.module("bgApp", ['ui.router']);

// configure our routes
app.config(function($stateProvider, $urlRouterProvider) {
   // For any unmatched url, redirect to /state1
   $urlRouterProvider.otherwise("/main");
   // Now set up the states
   $stateProvider
     .state('main', {
       url: "/main",
       templateUrl : 'templates/selCompany.html',
       controller  : 'mainController'
     })
});

// maincontroller and inject Angular's $scope
app.controller('mainController', function($rootScope, $scope, $state, fileReader, $http) {

    $scope.file = null;
    $scope.imageSrc = null;
    $scope.logoSrc = null;
    $scope.mySelect ="Google";
    var socket = io.connect();
    // on every message recived we print the new datas inside the #container div
   /* socket.on('updatedPreview', function (data) {
        // convert the json string into a valid javascript object
        var _data = JSON.parse(data);
         console.log("_data====================", _data) 
        $('#container').html(_data);
        $scope.dataJson = _data;
        $scope.$digest();
       // $('time').html('Last Update:' + new Date());
    });*/

    socket.on('newPreview', function (data) {
       console.log("in clint newPreview", data);
        //$scope.dataJson = data;
        //$scope.$digest();
    });

    $scope.readFile = function () {
       fileReader.readAsDataUrl($scope.file, $scope)
       .then(function(result) {
             $scope.imageSrc = result;
         });
   };

   $scope.readLogoFile = function () {
      fileReader.readAsDataUrl($scope.file, $scope)
      .then(function(result) {
            $scope.logoSrc = result;
        });
  };

  $scope.savePreview = function(){
    var data = {
        "company":$scope.mySelect,
        "header": $scope.hText,
        "bgColor": $scope.bgColor,
        "lgColor": $scope.lgColor,
        "hColor": $scope.txtColor
      }
       console.log(data)
     $http.post("/updateFile", data).success(function(data, status) {
          swal("Data saved successfully");
      })
  }

   $scope.go = function ( path ) {
     $rootScope.companyInfo = {
       imageUrl:$scope.imageSrc,
       logoUrl: $scope.logoSrc,
       lgColor: $scope.lgColor,
       bgColor: $scope.bgColor,
       headTxt: $scope.hText,
       hClr: $scope.txtColor
     }
     $state.go(path);
    };

    $scope.bgUpdate = function(name){
      $scope.homePreview = true;
      $scope.imageSrc = "content/"+name+"/"+name+"-bg.jpg";
      $scope.logoSrc = "content/"+name+"/"+name+"-lg.png";
      var urlInfo = "content/"+name+"/"+name+".json" ;
      $http.get(urlInfo).success(function(data) {
          $rootScope.previewData = data;
          $scope.bgColor = data.bgColor;
          $scope.lgColor = data.lgColor;
          $scope.txtColor = data.hColor;
          $scope.hText = data.header;
      });
    };

    function autoRender(name){
      $scope.homePreview = true;
      $scope.imageSrc = "content/"+name+"/"+name+"-bg.jpg";
      $scope.logoSrc = "content/"+name+"/"+name+"-lg.png";
      var urlInfo = "content/"+name+"/"+name+".json" ;
      $http.get(urlInfo).success(function(data) {
          $rootScope.previewData = data;
          $scope.bgColor = data.bgColor;
          $scope.lgColor = data.lgColor;
          $scope.txtColor = data.hColor;
          $scope.hText = data.header;
      });
    }
    autoRender($scope.mySelect);
    
  /*  $scope.reset = function(){
      $scope.homePreview = false;
      $scope.mySelect = "";
      $scope.imageSrc = "";
      $scope.logoSrc = "";
      $scope.bgColor = "";
      $scope.lgColor = "";
      $scope.txtColor = "";
      $scope.hText = "";
    };*/

  });

 app.directive("fileInput", function ($parse) {
  return {
      restrict: "EA",
      template: "<input type='file' />",
      replace: true,
      link: function (scope, element, attrs) {
          var modelGet = $parse(attrs.fileInput);
          var modelSet = modelGet.assign;
          var onChange = $parse(attrs.onChange);
          var updateModel = function () {
              scope.$apply(function () {
                  modelSet(scope, element[0].files[0]);
                  onChange(scope);
              });
          };
          element.bind('change', updateModel);
      }
   };
 });
