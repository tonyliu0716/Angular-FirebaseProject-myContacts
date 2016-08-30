'use strict';

angular.module('myContacts.contacts', ['ngRoute', 'firebase'])

.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/contacts', {
        templateUrl: 'contacts/contacts.html',
        controller: 'ContactsCtrl'
    });
}])

.controller('ContactsCtrl', ['$scope', '$firebaseArray', '$log', function ($scope, $firebaseArray, $log) {
    //init firebase config
    var rootRef = firebase.database().ref('contacts');
    //get data from firebase
    $scope.contacts = $firebaseArray(rootRef);

    $scope.addFormShow = false;
    $scope.msg = "";
    $scope.showAddForm = function () {
        $scope.addFormShow = true;

    }

    $scope.addFormSubmit = function () {

    }

    $scope.hide = function () {
        $scope.addFormShow = false;
        $scope.contactShow = false;
    }

    $scope.contactShow = false;
    //show contact
    $scope.showContact = function (info) {
        $scope.contactInfo = info;
        $scope.contactShow = true;
    }

    //submit contact
    $scope.addFormSubmit = function () {
        //Assign values
        if ($scope.name) {
            var name = $scope.name
        } else {
            var name = null;
        }

        if ($scope.email) {
            var email = $scope.email
        } else {
            var email = null;
        }

        if ($scope.company) {
            var company = $scope.company
        } else {
            var company = null;
        }

        if ($scope.mobile_phone) {
            var mobile_phone = $scope.mobile_phone
        } else {
            var mobile_phone = null;
        }

        if ($scope.home_phone) {
            var home_phone = $scope.home_phone
        } else {
            var home_phone = null;
        }

        if ($scope.work_phone) {
            var work_phone = $scope.work_phone
        } else {
            var work_phone = null;
        }

        if ($scope.street_address) {
            var street_address = $scope.street_address
        } else {
            var street_address = null;
        }

        if ($scope.city) {
            var city = $scope.city
        } else {
            var city = null;
        }

        if ($scope.state) {
            var state = $scope.state
        } else {
            var state = null;
        }

        if ($scope.zipcode) {
            var zipcode = $scope.zipcode
        } else {
            var zipcode = null;
        }

        //build object
        var contact = {
            name: name,
            email: email,
            company: company,
            phones: [
                {
                    mobile: mobile_phone,
                    home: home_phone,
                    work: work_phone
                }
            ],
            address: [
                {
                    street_address: street_address,
                    city: city,
                    state: state,
                    zipcode: zipcode
                }
            ]
        };
        //add data into database: $add
        $scope.contacts.$add(contact).then(function (rootRef) {

            //need to clear form
            clearFields();

            //hide form
            $scope.addFormShow = false;

            //Send message to user
            $scope.msg = "Contact Added!";
        });


    }

    //clear $scope fields
    function clearFields() {
        $log.info("start clearing the fields...");
        $scope.name = '';
        $scope.email = '';
        $scope.company = '';
        $scope.mobile_phone = '';
        $scope.home_phone = '';
        $scope.work_phone = '';
        $scope.street_address = '';
        $scope.city = '';
        $scope.state = '';
        $scope.zipcode = '';
    }


    // Show Edit Form
    $scope.showEditForm = function (contact) {
        $scope.editFormShow = true;

        $scope.id = contact.$id;
        $scope.name = contact.name;
        $scope.email = contact.email;
        $scope.company = contact.company;
        $scope.work_phone = contact.phones[0].work;
        $scope.home_phone = contact.phones[0].home;
        $scope.mobile_phone = contact.phones[0].mobile;
        $scope.street_address = contact.address[0].street_address;
        $scope.city = contact.address[0].city;
        $scope.state = contact.address[0].state;
        $scope.zipcode = contact.address[0].zipcode;
    }

    //edit contact
    $scope.editFormSubmit = function () {
        $log.info("Updating Contact...");

        //get id
        var id = $scope.id;

        //get record from contacts object
        var record = $scope.contacts.$getRecord(id);

        //if any change, assign values to 'record' object
        record.name = $scope.name;
        record.email = $scope.email;
        record.company = $scope.company;
        record.phones[0].work = $scope.work_phone;
        record.phones[0].home = $scope.home_phone;
        record.phones[0].mobile = $scope.mobile_phone;
        record.address[0].street_address = $scope.street_address;
        record.address[0].city = $scope.city;
        record.address[0].state = $scope.state;
        record.address[0].zipcode = $scope.zipcode;

        //update contact
        $scope.contacts.$save(record).then(function (rootRef) {
            $log.info(rootRef.key);
        });

        clearFields();

        //hide edit form
        $scope.editFormShow = false;
        //show message
        $scope.msg = "Contact updated!";
    }

    //remove contact
    $scope.removeContact = function (contact) {
        $log.error("Removing Contact...");

        $scope.contacts.$remove(contact);

        $scope.msg = "Contact Removed!";
    }


}]);