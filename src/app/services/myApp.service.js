myApp.factory("Equipment", function($http) {
    var _getEquipments = function() {
        return $http.get("https://private-7a98db-senaienergy.apiary-mock.com/device");
    }

    return {
        getEquipments: _getEquipments
    };
});