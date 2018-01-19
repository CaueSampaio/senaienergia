myApp.factory("Equipment", function($http) {
    var _getEquipments = function() {
        return $http.get("https://private-7a98db-senaienergy.apiary-mock.com/device");
    }

    var _getCompanys = function() {
        return $http.get("https://private-7a98db-senaienergy.apiary-mock.com/companys");
    }

    return {
        getEquipments: _getEquipments,
        getCompanys: _getCompanys
    };
});