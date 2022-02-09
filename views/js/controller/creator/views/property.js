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
 * Copyright (c) 2014-2022 (original work) Open Assessment Technologies SA (under the project TAO-PRODUCT);
 */

/**
 * @author Bertrand Chevrier <bertrand@taotesting.com>
 */
define(['jquery', 'uikitLoader', 'core/databinder', 'taoQtiTest/controller/creator/templates/index'], function (
    $,
    ui,
    DataBinder,
    templates
) {
    'use strict';

    /**
     * @callback PropertyViewCallback
     * @param {propertyView} propertyView - the view object
     */

    /**
     * The PropertyView setup the property panel component
     * @param {String} tmplName
     * @param {Object} model
     * @exports taoQtiTest/controller/creator/views/property
     * @returns {Object}
     */
    const propView = function propView(tmplName, model) {
        const $container = $('.test-creator-props');
        const template = templates.properties[tmplName];
        let $view;

        /**
         * Opens the view for the 1st time
         */
        const open = function propOpen() {
            const binderOptions = {
                templates: templates.properties
            };
            $container.children('.props').hide().trigger('propclose.propview');
            $view = $(template(model)).appendTo($container).filter('.props');

            //start listening for DOM compoenents inside the view
            ui.startDomComponent($view);

            //start the data binding
            const databinder = new DataBinder($view, model, binderOptions);
            databinder.bind();

            propValidation();

            $view.trigger('propopen.propview');

            // contains identifier from model, needed for validation on keyup for identifiers
            // jQuesy selector for Id with dots don't work
            // dots are allowed for id by default see taoQtiItem/qtiCreator/widgets/helpers/qtiIdentifier
            // need to use attr
            const $identifier = $view.find(`[id="props-${model.identifier}"]`);
            $view.on('change.binder', function (e) {
                if (e.namespace === 'binder' && $identifier.length) {
                    $identifier.text(model.identifier);
                }
            });
        };

        /**
         * Get the view container element
         * @returns {jQueryElement}
         */
        const getView = function propGetView() {
            return $view;
        };

        /**
         * Check wheter the view is displayed
         * @returns {boolean} true id opened
         */
        const isOpen = function propIsOpen() {
            return $view.css('display') !== 'none';
        };

        /**
         * Bind a callback on view open
         * @param {PropertyViewCallback} cb
         */
        const onOpen = function propOnOpen(cb) {
            $view.on('propopen.propview', function (e) {
                e.stopPropagation();
                cb();
            });
        };

        /**
         * Bind a callback on view close
         * @param {PropertyViewCallback} cb
         */
        const onClose = function propOnClose(cb) {
            $view.on('propclose.propview', function (e) {
                e.stopPropagation();
                cb();
            });
        };

        /**
         * Removes the property view
         */
        const destroy = function propDestroy() {
            $view.remove();
        };

        /**
         * Toggles the property view display
         */
        const toggle = function propToggle() {
            $container.children('.props').not($view).hide().trigger('propclose.propview');
            if (isOpen()) {
                $view.hide().trigger('propclose.propview');
            } else {
                $view.show().trigger('propopen.propview');
            }
        };

        /**
         * Set up the validation on the property view
         * @private
         */
        function propValidation() {
            $view.on('validated.group', function(e, isValid){
                const activeButton = $('.tlb-button-on');
                const $warningIcon = $('span.icon-warning');
                //get data from properties input
                let $testPart = $(activeButton).parents('.testpart').attr('id');
                let $testSection = $(activeButton).parents('.section').attr('id');
                let $testSubsection = $(activeButton).parents('.subsection').attr('id');
                let $test = $(activeButton).parents('.test-creator-test');
                let $item = $(activeButton).parents('.itemref').attr('id');
                // adds # to form main test id's
                let testPartId = '#' + $testPart;
                let testSectionId = '#' + $testSection;
                let testSubsectionId = '#' + $testSubsection;
                let itemId = '#' + $item;
                // finds error in different elements if any
                let $propsSectionError = $('#section-props-'+ $testSection).find('span.validate-error');
                let $propsSubsectionError = $('#section-props-' + $testSubsection).find('span.validate-error');
                let $propsItemError = $('.itemref-props').find('span.validate-error');
                let $propsTestPartError = $('.testpart-props').find('span.validate-error');
                let $propsTestError = $('.test-props').find('span.validate-error');
                let propsErrorAllArray = [$propsTestError, $propsTestPartError , $propsSectionError, $propsSubsectionError, $propsItemError];
                
                if(e.namespace === 'group'){
                    for(let i= 0; i < propsErrorAllArray.length; i++) {
                        //hide warning icon if an element is validated
                        if (isValid && propsErrorAllArray[i].length === 0) {
                            if (propsErrorAllArray[i] === propsErrorAllArray[4] && propsErrorAllArray[4].length === 0) {
                                $(itemId).find($warningIcon).first().css('display', 'none');
                            } else if (propsErrorAllArray[i] === propsErrorAllArray[3] && propsErrorAllArray[3].length === 0) {
                                $(testSubsectionId).find($warningIcon).first().css('display', 'none');
                            } else if (propsErrorAllArray[i] === propsErrorAllArray[2] && propsErrorAllArray[2].length === 0) {
                                $(testSectionId).find($warningIcon).first().css('display', 'none');
                            } else if (propsErrorAllArray[i] === propsErrorAllArray[1] && propsErrorAllArray[1].length === 0) {
                                $(testPartId).find($warningIcon).first().css('display', 'none');
                            } else if (propsErrorAllArray[i] === propsErrorAllArray[0] && propsErrorAllArray[0].length === 0) {
                                $($test).find($warningIcon).first().css('display', 'none');
                            }

                        } else {
                       //add warning icon if validation fails
                            if  (propsErrorAllArray[i] === propsErrorAllArray[4] && propsErrorAllArray[4].length !== 0) {
                                $(itemId).find($warningIcon).first().css('display', 'inline');
                            }else if (propsErrorAllArray[i] === propsErrorAllArray[3] && propsErrorAllArray[3].length !== 0){
                                $(testSubsectionId).find($warningIcon).first().css('display', 'inline');
                            } else if(propsErrorAllArray[i] === propsErrorAllArray[2] && propsErrorAllArray[2].length !== 0){
                                $(testSectionId).find($warningIcon).first().css('display', 'inline');
                            } else if(propsErrorAllArray[i] === propsErrorAllArray[1] && propsErrorAllArray[1].length !== 0){
                                $(testPartId).find($warningIcon).first().css('display', 'inline');
                            } else if (propsErrorAllArray[i] === propsErrorAllArray[0] && propsErrorAllArray[0].length !== 0){
                                $($test).find($warningIcon).first().css('display', 'inline');
                            }
                       }
                    }
                }
            });

            $view.groupValidator({ events: ['keyup', 'change', 'blur'] });
        }

        return {
            open: open,
            getView: getView,
            isOpen: isOpen,
            onOpen: onOpen,
            onClose: onClose,
            destroy: destroy,
            toggle: toggle
        };
    };

    return propView;
});
