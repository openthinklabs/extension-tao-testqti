define([
    'lodash',
    'i18n',
], function(
    _,
    __,
) {
    'use strict';

    return {
        /**
         * Error type in case when the test taker is unable to navigate offline
         * @type {Error}
         */
        offlineNavError: _.assign(
            new Error(__('We are unable to connect to the server to retrieve the next item.')),
            {
                success : false,
                source: 'navigator',
                purpose: 'proxy',
                type: 'nav',
                code : 404
            }
        ),

        /**
         * Error type in case when the test taker is unable to exit the test offline
         * @type {Error}
         */
        offlineExitError: _.assign(
            new Error(__('We are unable to connect the server to submit your results.')),
            {
                success : false,
                source: 'navigator',
                purpose: 'proxy',
                type: 'finish',
                code : 404
            }
        ),

        /**
         * Error type in case when the test get paused in offline mode
         * @type {Error}
         */
        offlinePauseError: _.assign(
            new Error(__('The test has been paused, we are unable to connect to the server.')),
            {
                success : false,
                source: 'navigator',
                purpose: 'proxy',
                type: 'pause',
                code : 404
            }
        )
    }
});
