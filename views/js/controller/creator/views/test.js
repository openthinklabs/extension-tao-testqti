/**
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; under version 2
 * of the License (non-upgradable).
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 *
 * Copyright (c) 2014 (original work) Open Assessment Technologies SA (under the project TAO-PRODUCT);
 */
/**
 * @author Bertrand Chevrier <bertrand@taotesting.com>
 */
define([
    'jquery', 'lodash', 'ui/hider',
    'taoQtiTest/controller/creator/views/actions',
    'taoQtiTest/controller/creator/views/testpart',
    'taoQtiTest/controller/creator/templates/index',
    'taoQtiTest/controller/creator/helpers/qtiTest'
],
function($, _, hider, actions, testPartView, templates, qtiTestHelper){
    'use strict';

    /**
     * The TestView setup test related components and behavior
     *
     * @exports taoQtiTest/controller/creator/views/test
     * @param {modelOverseer} modelOverseer - the test model overseer. Should also provide some config entries
     */
    function testView (modelOverseer) {
        var testModel = modelOverseer.getModel();
        var config = modelOverseer.getConfig();

        actions.properties($('.test-creator-test > h1'), 'test', testModel, propHandler);
        testParts();
        addTestPart();

        /**
         * set up the existing test part views
         * @private
         */
        function testParts () {
            if(!testModel.testParts){
                testModel.testParts = [];
            }
            $('.testpart').each(function(){
                var $testPart = $(this);
                var index = $testPart.data('bind-index');
                if(!testModel.testParts[index]){
                    testModel.testParts[index] = {};
                }

                testPartView.setUp(modelOverseer, testModel.testParts[index], $testPart);
            });
        }

        /**
         * Perform some binding once the property view is created
         * @private
         * @param {propView} propView - the view object
         */
        function propHandler(propView) {

            var $view = propView.getView();
            var $categoryScoreLine = $('.test-category-score', $view);
            var $cutScoreLine = $('.test-cut-score', $view);
            var $weightIdentifierLine = $('.test-weight-identifier', $view);
            var $descriptions = $('.test-outcome-processing-description', $view);
            var $title = $('.test-creator-test > h1 [data-bind=title]');

            function changeScoring(scoring) {
                var noOptions = !!scoring && ['none', 'custom'].indexOf(scoring.outcomeProcessing) === -1;
                hider.toggle($cutScoreLine, !!scoring && scoring.outcomeProcessing === 'cut');
                hider.toggle($categoryScoreLine, noOptions);
                hider.toggle($weightIdentifierLine, noOptions);
                hider.hide($descriptions);
                hider.show($descriptions.filter('[data-key="' + scoring.outcomeProcessing + '"]'));
            }

            $('[name=test-outcome-processing]', $view).select2({
                minimumResultsForSearch: -1,
                width: '100%'
            });

            $view.on('change.binder', function (e, model) {
                if (e.namespace === 'binder' && model['qti-type'] === 'assessmentTest') {
                    changeScoring(model.scoring);

                    //update the test part title when the databinder has changed it
                    $title.text(model.title);
                }
            });
            changeScoring(testModel.scoring);
        }

        /**
         * Enable to add new test parts
         * @private
         */
        function addTestPart () {

            $('.testpart-adder').adder({
                target: $('.testparts'),
                content : templates.testpart,
                templateData : function(cb){

                    //create an new testPart model object to be bound to the template
                    var testPartIndex = $('.testpart').length;
                    cb({
                        'qti-type' : 'testPart',
                        identifier : qtiTestHelper.getIdentifier('testPart', config.identifiers),
                        index  : testPartIndex,
                        navigationMode : 0,
                        submissionMode : 0,
                        assessmentSections : [{
                            'qti-type' : 'assessmentSection',
                            identifier : qtiTestHelper.getIdentifier('assessmentSection',  config.identifiers),
                            title : 'Section 1',
                            index : 0,
                            sectionParts : []
                        }]
                    });
                }
            });

            //we listen the event not from the adder but  from the data binder to be sure the model is up to date
            $(document)
                .off('add.binder', '.testparts')
                .on ('add.binder', '.testparts', function(e, $testPart, added){
                    if(e.namespace === 'binder' && $testPart.hasClass('testpart')){
                        //initialize the new test part
                        testPartView.setUp(modelOverseer, testModel.testParts[added.index], $testPart);
                    }
                });
        }
    }

    return testView;
});
