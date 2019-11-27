/**
 * @license
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your dashboard ViewModel code goes here
 */
define(
    ['ojs/ojcore',
        'knockout',
        'jquery',
        'lodash',
        'ojs/ojlabel',
        'ojs/ojchart',
        'ojs/ojlistview',
        'ojs/ojarraydataprovider',
        'ojs/ojavatar',
        'ojs/ojdatagrid',
        'ojs/ojcollectiondatagriddatasource',
        'ojs/ojvalidation-datetime',
        'ojs/ojvalidation-number',
        'ojs/ojtable',
        'ojs/ojradioset',
        'ojs/ojinputtext',
        'ojs/ojmodel',
        'ojs/ojgauge',
        'ojs/ojbutton',
        'ojs/ojcheckboxset',
        'ojs/ojselectcombobox',
        'ojs/ojpagingcontrol',
        'ojs/ojcollectiontabledatasource',
        'ojs/ojpagingtabledatasource'
    ],
    function (oj, ko, $, _) {

        function DocumentViewModel() {
            var self = this;  //generated code
            var criteriaMap = {};
            criteriaMap['lh'] = {key: 'number', direction: 'ascending'};
            criteriaMap['hl'] = {key: 'number', direction: 'descending'};

            var filters = ['AML - Incident Investigation Form', 'new_template1234', 'new_template', 'saravanan test 4+guru'];
            var filterFunc = {};
            filterFunc['AML-Incident Investigation Form'] = function(model) { return model.get('title') === 'AML-Incident Investigation Form'; };
            filterFunc['new_template1234'] = function(model) { return model.get('title') === 'new_template1234'; };
            filterFunc['new_template'] = function(model) { return model.get('title') === 'new_template'; };
            filterFunc['saravanantest'] = function(model) { return model.get('title') === 'saravanan test 4+guru'; };
            /**
             * Declare observables and read data from JSON file
             */
            // Master list and detail list observables
            //self.activityDataProvider = ko.observable();   //gets data for Activities list
            self.itemsDataProvider = ko.observable();      //gets data for Items list

            self.itemData = ko.observable('');             //holds data the Item details

            self.pieSeriesValue = ko.observableArray([]);  //holds data for pie chart

            // Activity selection observables
            self.activitySelected = ko.observable(false);
            self.selectedActivity = ko.observable();
            self.firstSelectedActivity = ko.observable();

            // Item selection observables
            self.itemSelected = ko.observable(false);
            self.selectedItem = ko.observable();
            self.firstSelectedItem = ko.observable();
            self.SelectedItemArea = ko.observable('');
            self.createdBy = ko.observable('');
            self.createdAt = ko.observable('');

            // var url = "js/store_data.json";  //defines link to local data file

            // // Get Activity objects from file using jQuery method and a method to return a Promise
            // $.getJSON(url).then(function (data) {
            //     // Create variable for Activities list and populate using key attribute fetch
            //     var activitiesArray = data._embedded.checklists;
            //     self.activityDataProvider(new oj.ArrayDataProvider(activitiesArray, { keyAttributes: "id" }));
            //   }


            // );
            self.currentSort = ko.observable("lh");
            var model = oj.Model.extend({
                idAttribute: 'id'
            });
            self.collection = new oj.Collection(null, {
                url: 'js/store_data.json',
                model: model
            });
            var originalCollection = self.collection;
            self.dataSource = ko.observable(new oj.PagingTableDataSource(new oj.CollectionTableDataSource(self.collection)));
            this.currentTitle = [];
            //defines link to local data file

            // Get Activity objects from file using jQuery method and a method to return a Promise
            // $.getJSON(url).then(function (data) {
            //     // Create variable for Activities list and populate using key attribute fetch
            //     var activitiesArray = data;
            //     self.activityDataProvider(new oj.ArrayDataProvider(activitiesArray, { keyAttributes: "id" }));
            //   }

            // );

            // self.getData = function () {
            //   var url = "http://localhost/field-management/api/projects/1/issue_types";
            //   $.ajax
            //   ({
            //     type: "GET",
            //     url: url,
            //     headers: {
            //       "Authorization": "Basic " + btoa("admin" + ":" + "admin"),
            //       "Content-Type": 'application/json',
            //       //"Accept": 'application/json',
            //       "X-application": "63fc4887-aed9-497f-bad5-d7ef2b90cdaf",
            //       //"Accept": 'application/hal+json',
            //       // "Accept-Encoding": 'gzip, deflate, br',
            //       // "Accept-Language": 'en-US,en;q=0.9,hi;q=0.8',
            //       // "Cache-Control": 'no-cache',
            //       // "Connection": 'keep-alive',
            //       // "Cookie": 'JSESSIONID=1gc6kfykigq6u1iy9gpc7ek9d2; project-1=1; ASESSIONID=01%2C14400%2C1551775433663%2C1%2Cb42594bed0cce578d4b040a0c2c77191cd13e1150722921b74180b0e5c8b8cf7',
            //       // "Host": 'localhost',
            //       // "Origin": 'http://evil.com/',
            //       // "Pragma": 'no-cache'
            //     },
            //     complete: function (data){
            //       window.console.log(data.responseJSON);
            //       var activitiesArray = data.responseJSON.checklists;
            //       self.activityDataProvider(new oj.ArrayDataProvider(activitiesArray, { keyAttributes: "id" }));
            //     }
            //   });
            // };

            // self.getData();

            /**
             * Handle selection from Activities list
             */
            self.selectedActivityChanged = function (event) {
                // Check whether click is an Activity selection or a deselection
                // Check whether click is an Activity selection or a deselection
                if (event.detail.value.length != 0) {
                    // If selection, populate and display list
                    // Create variable for items list using firstSelectedXxx API from List View
                    var itemsArray = self.firstSelectedActivity().data.items;
                    // Populate items list using DataProvider fetch on key attribute
                    //self.itemsDataProvider(new oj.ArrayDataProvider(itemsArray, { keyAttributes: "id" }))
                    // Set List View properties
                    self.activitySelected(true);
                    self.itemSelected(false);
                    // Clear item selection
                    //self.selectedItem([]);
                    self.itemData(self.firstSelectedActivity().data);
                    self.SelectedItemArea(_.map(self.itemData().area.path, 'name').join(' > '));
                    self.createdBy((self.itemData().meta_data.created_by.first_name).concat(self.itemData().meta_data.created_by.last_name).concat(" - ").concat(self.itemData().meta_data.created_by.organization.name));
                    self.createdAt(self.itemData().meta_data.created_at);
                    var pieSeries = [
                        { name: "Quantity in Stock", items: [self.itemData().quantity_instock] },
                        { name: "Quantity Shipped", items: [self.itemData().quantity_shipped] }
                    ];
                    // Update the pie chart with the data
                    self.pieSeriesValue(pieSeries);
                } else {
                    // If deselection, hide list
                    self.activitySelected(false);
                    self.itemSelected(false);
                }
            };

            self.handleSortCriteriaChanged = function(event, ui)
            {
                var criteria = criteriaMap[event.detail.value];
                self.dataSource().sort(criteria);
            };

            self.handleFilterChanged = function(event, ui)
            {
                var value = [event.detail.value];
                if (!Array.isArray(value))
                {
                    return;
                }

                var results = [];
                var processed = false;

                $.each(filters, function(index, filter)
                {
                    if (value.indexOf(filter) > -1)
                    {
                        results = results.concat(originalCollection.filter(filterFunc[filter]));
                        processed = true;
                    }
                });

                if (processed)
                {
                    self.collection = new oj.Collection(results);
                }
                else
                {
                    self.collection = originalCollection;
                }
                self.dataSource(new oj.PagingTableDataSource(new oj.CollectionTableDataSource(self.collection)));

            };


            /**
             * Handle selection from Activity Items list
             */
            self.selectedItemChanged = function (event) {
                // Check whether click is an Activity Item selection or deselection
                // Check whether click is an Activity Item selection or deselection
                if (event.detail.value.length != 0) {
                    // If selection, populate and display Item details
                    // Populate items list observable using firstSelectedXxx API
                    self.itemData(self.firstSelectedItem().data);
                    // Create variable and get attributes of the items list to set pie chart values
                    self.itemSelected(true);
                } else {
                    // If deselection, hide list
                    self.itemSelected(false);
                }
            };


            /**
             * This section is standard navdrawer starter template code
             */


            /**
             * This section is standard navdrawer starter template code
             */
            // Below are a set of the ViewModel methods invoked by the oj-module component.
            // Please reference the oj-module jsDoc for additional information.

            /**
             * Optional ViewModel method invoked after the View is inserted into the
             * document DOM.  The application can put logic that requires the DOM being
             * attached here.
             * This method might be called multiple times - after the View is created
             * and inserted into the DOM and after the View is reconnected
             * after being disconnected.
             */
            self.connected = function () {
                // Implement if needed
            };

            /**
             * Optional ViewModel method invoked after the View is disconnected from the DOM.
             */
            self.disconnected = function () {
                // Implement if needed
                //self.activitySelected(false);
                //self.itemSelected(false);
            };

            /**
             * Optional ViewModel method invoked after transition to the new View is complete.
             * That includes any possible animation between the old and the new View.
             */
            self.transitionCompleted = function () {
                // Implement if needed
            };

            //   var dateOptions = {formatType: 'date', dateFormat: 'medium'};
            //     var dateConverterFactory = oj.Validation.converterFactory("datetime");
            //     this.dateConverter = dateConverterFactory.createConverter(dateOptions);

            //     var salaryOptions =
            //     {
            //         style: "currency",
            //         currency: "USD",
            //         currencyDisplay:"symbol"
            //     };
            //     var salaryConverterFactory = oj.Validation.converterFactory("number");
            //     this.salaryConverter = salaryConverterFactory.createConverter(
            //         salaryOptions);

            //     var collection = new oj.Collection(null, {
            //         url: 'js/employeeData.json'
            //     });

            //     this.dataSource = new oj.CollectionDataGridDataSource(collection,
            //         {rowHeader: 'EMPLOYEE_ID'}
            //     );

            //     this.getCellClassName = function(cellContext)
            //     {
            //         var key = cellContext['keys']['column'];
            //         if (key === 'SALARY')
            //         {
            //             return 'oj-helper-justify-content-right';
            //         }
            //         else if (key === 'FIRST_NAME' ||
            //             key === 'LAST_NAME' ||
            //             key === 'EMAIL'||
            //             key === 'HIRE_DATE')
            //         {
            //             return 'oj-sm-justify-content-flex-start';
            //         }
            //     };
            //     self.currentDirection = ko.observable("asc");
            // self.currentType = ko.observable("attribute");
            // self.currentDirection.subscribe(function(newValue) {
            //   if (newValue === "asc") {
            //     self.DeptCol().sortDirection = 1;
            //   }
            //   else {
            //     self.DeptCol().sortDirection = -1;
            //   }
            //   self.DeptCol().sort();
            // });

            // self.currentType.subscribe(function(newValue) {
            //   if (newValue === "function") {
            //     self.DeptCol().comparator = function(a,b) {
            //       var valA = a.get("DepartmentId");
            //       var valB = b.get("DepartmentId");
            //       if (valA < valB) return 1;
            //       if (valA > valB) return -1;
            //       return 0;
            //     };
            //   }
            //   else {
            //     self.DeptCol().comparator = "DepartmentName";
            //   }
            //   self.DeptCol().sort();
            // });

            // self.serviceURL = 'http://mockrest/stable/rest/Departments';
            // self.DeptCol = ko.observable();
            // self.datasource = ko.observable();

            // self.parseSaveDept = function (response) {
            //   return {DepartmentId: response['DepartmentId'],
            //     DepartmentName: response['DepartmentName'],
            //     LocationId:response['LocationId'],
            //     ManagerId:response['ManagerId']};
            // };

            // self.parseDept = function(response) {
            //   return {DepartmentId: response['DepartmentId'],
            //     DepartmentName: response['DepartmentName'],
            //     LocationId: response['LocationId'],
            //     ManagerId: response['ManagerId']};
            // };
            // self.Department = oj.Model.extend({
            //   urlRoot: self.serviceURL,
            //   parse: self.parseDept,
            //   parseSave: self.parseSaveDept,
            //   idAttribute: 'DepartmentId'
            // });

            // self.myDept = new self.Department();
            // self.DeptCollection = oj.Collection.extend({
            //   url: self.serviceURL,
            //   model: self.myDept,
            //   comparator: "DepartmentName"
            // });

            // self.DeptCol(new self.DeptCollection());
            // $.getJSON("cookbook/commonModel/crud/table/departments.json",
            //   function (data) {
            //     new MockRESTServer(data, {id:"DepartmentId",
            //         url:/^http:\/\/mockrest\/stable\/rest\/Departments(\?limit=([\d]*))?$/i,
            //         idUrl:/^http:\/\/mockrest\/stable\/rest\/Departments\/([\d]+)$/i});
            //     self.datasource(new oj.CollectionTableDataSource(self.DeptCol()));
            //   });
        }

        /*
         * Returns a constructor for the ViewModel so that the ViewModel is constructed
         * each time the view is displayed.  Return an instance of the ViewModel if
         * only one instance of the ViewModel is needed.
         */
        return new DocumentViewModel();
    }
);