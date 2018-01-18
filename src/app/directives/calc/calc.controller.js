myApp.controller("calcController", ['Equipment', '$scope', function(Equipment, $scope) {
    $scope.deviceList = [];

    $scope.getEquipments = function(){
        console.log("Chamou")
        Equipment.getEquipments($scope.deviceList)
        .then(function(promisse) {
            $scope.deviceList = promisse.data;
        })
    }
    
    // $scope.deviceList = {
    //     devices: [{
    //         name: "Lâmpada Fluorescente",
    //         power: 20,
    //         quantity: 1,
    //         consumption: 2.00,
    //         schedule: [120, 120, 0]
    //     },
    //     {
    //         name: "Teste",
    //         power: 15,
    //         quantity: 2,
    //         consumption: 2.00,
    //         schedule: [135, 514, 0]
    //     }]
    // };

    $scope.addDevice = function() {
        $scope.deviceList.push($scope.newDevice);
    }

    $scope.deleteDevice = function($index) {
        console.log($index);
        console.log($scope.deviceList)
        $scope.deviceList.splice($index, 1);
    }

    $scope.getEquipments();
    
}]);