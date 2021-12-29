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
 * Copyright (c) 2014-2019 (original work) Open Assessment Technologies SA (under the project TAO-PRODUCT);
 */

/**
 * @author Bertrand Chevrier <bertrand@taotesting.com>
 */
define([
    'jquery',
    'uikitLoader',
    'core/databinder',
    'taoQtiTest/controller/creator/templates/index'
],
function($, ui, DataBinder, templates){
    'use strict';

    /**
     * @callback PropertyViewCallback
     * @param {propertyView} propertyView - the view object
     */

    /**
     * The PropertyView setup the property panel component
     *
     * @exports taoQtiTest/controller/creator/views/property
     */
    var propView = function propView(tmplName, model){
        var $container = $('.test-creator-props');
        var template = templates.properties[tmplName];
        var $view;

        /**
         * Opens the view for the 1st time
         */
        var open = function propOpen(){
            var databinder,
                binderOptions = {
                    templates: templates.properties
                };
            $container.children('.props').hide().trigger('propclose.propview');
            $view = $(template(model)).appendTo($container).filter('.props');

            //start listening for DOM compoenents inside the view
            ui.startDomComponent($view);

            //start the data binding
            databinder = new DataBinder($view, model, binderOptions);
            databinder.bind();

            propValidation();

            $view.trigger('propopen.propview');
        };

       /**
        * Get the view container element
        * @returns {jQueryElement}
        */
        var getView = function propGetView(){
            return $view;
        };

       /**
        * Check wheter the view is displayed
        * @returns {boolean} true id opened
        */
        var isOpen = function propIsOpen(){
            return $view.css('display') !== 'none';
        };

       /**
        * Bind a callback on view open
        * @param {PropertyViewCallback} cb
        */
        var onOpen = function propOnOpen(cb){
            $view.on('propopen.propview', function(e){
                e.stopPropagation();
                cb();
            });
        };


        /**
         * Bind a callback on view close
         * @param {PropertyViewCallback} cb
         */
        var onClose = function propOnClose(cb){
            $view.on('propclose.propview', function(e){
                e.stopPropagation();
                cb();
            });
        };

        /**
         * Removes the property view
         */
        var destroy = function propDestroy(){
            $view.remove();
        };

        /**
         * Toggles the property view display
         */
        var toggle = function propToggle(){
            $container.children('.props').not($view).hide().trigger('propclose.propview');
            if(isOpen()){
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
            const $togglers = $('#authoringBack, #saver, #previewer');

            $view.on('validated.group', function(e, isValid){
                let classErrorAll = $container.find('span.validate-error');
                let $testSection = $('.tlb-button-on').parents('.section').attr('id');
                let testSectionId = '#' + $testSection;
                let $propsSectionError = $('#section-props-'+ $testSection).find('span.validate-error');
                let $propsItemError = $('.itemref-props').find('span.validate-error');
                let $sectionTogglers = $(testSectionId).find('.tlb-button-off:not(.property-toggler)');
                let $rudblocksButtonInCurrentSection = $(testSectionId).find('.rub-toggler');

                if(e.namespace === 'group'){
                   if (isValid && $propsItemError.length === 0 && $propsSectionError.length === 0 ) {
                       $(testSectionId).removeClass('section-error');
                       $sectionTogglers.removeClass('disabled');
                       $rudblocksButtonInCurrentSection.removeClass('disabled')
                           .unbind('click');
                    } else {
                        $(testSectionId).addClass('section-error');
                        $sectionTogglers.addClass('disabled');
                        $rudblocksButtonInCurrentSection
                            .addClass('disabled')
                            .on('click', e => {
                                e.stopImmediatePropagation();
                                e.preventDefault();
                            });
                    }
                    //disables save, authoringBack and preview buttons if span.validate-error is present in any property input
                    if (classErrorAll.length > 0 ){
                        $togglers.addClass('disabled');
                        $togglers.attr('disabled', 'disabled')

                    } else {
                        $togglers.removeClass('disabled');
                        $togglers.removeAttr('disabled');
                    }
                }
            });

            $view.groupValidator();
        }

        return {
            open : open,
            getView : getView,
            isOpen : isOpen,
            onOpen : onOpen,
            onClose : onClose,
            destroy : destroy,
            toggle : toggle
        };
    };

    return propView;
});
