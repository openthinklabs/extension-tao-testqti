<?php
/**
 * Default config header created during install
 */

return new oat\oatbox\config\ConfigurationService(array(
    'config' => array(
        'timerWarning' => array(
            'assessmentItemRef' => array(999 => 'info', 300 => 'warning', 120 => 'error'),
            'assessmentSection' => array(999 => 'info', 300 => 'warning', 120 => 'error'),
            'testPart' => array(999 => 'info', 300 => 'warning', 120 => 'error'),
            'assessmentTest' => array(999 => 'info', 300 => 'warning', 120 => 'error')
        ),
        'progress-indicator' => 'position',
        'progress-categories' => array(
        ),
        'progress-indicator-renderer' => 'percentage',
        'progress-indicator-scope' => 'position',
        'progress-indicator-forced' => true,
        'progress-indicator-show-label' => true,
        'progress-indicator-show-total' => true,
        'test-taker-review' => true,
        'test-taker-review-region' => 'left',
        'test-taker-review-show-legend' => true,
        'test-taker-review-default-open' => true,
        'test-taker-review-use-title' => true,
        'test-taker-review-force-title' => true,
        'test-taker-review-item-title' => 'Hal. %d',
        'test-taker-review-force-informational-title' => true,
        'test-taker-review-informational-item-title' => 'Petunjuk',
        'test-taker-review-scope' => 'testSection',
        'test-taker-review-prevents-unseen' => true,
        'test-taker-review-can-collapse' => false,
        'test-taker-review-display-subsection-title' => true,
        'test-taker-review-skipahead' => false,
        'test-taker-unanswered-items-message' => true,
        'exitButton' => false,
        'next-section' => false,
        'reset-timer-after-resume' => true,
        'extraContextBuilder' => null,
        'plugins' => array(
            'answer-masking' => array(
                'restoreStateOnToggle' => true,
                'restoreStateOnMove' => true
            ),
            'validateResponses' => array(
                'validateOnPreviousMove' => true
            ),
            'overlay' => array(
                'full' => false
            ),
            'collapser' => array(
                'collapseTools' => true,
                'collapseNavigation' => false,
                'collapseInOrder' => false,
                'hover' => false,
                'collapseOrder' => array(
                )
            ),
            'magnifier' => array(
                'zoomMin' => 2,
                'zoomMax' => 8,
                'zoomStep' => 0.5
            ),
            'calculator' => array(
                'template' => '',
                'degree' => true
            ),
            'dialog' => array(
                'alert' => array(
                    'focus' => 'navigable-modal-body'
                ),
                'confirm' => array(
                    'focus' => 'navigable-modal-body'
                )
            ),
            'keyNavigation' => array(
                'contentNavigatorType' => 'default'
            ),
            'review' => array(
                'reviewLayout' => 'default',
                'displaySectionTitles' => true
            )
        ),
        'csrf-token' => true,
        'timer' => array(
            'target' => 'client'
        ),
        'test-session' => 'oat\\taoQtiTest\\models\\runner\\session\\TestSession',
        'test-session-storage' => '\\taoQtiTest_helpers_TestSessionStorage',
        'bootstrap' => array(
            'serviceExtension' => 'taoQtiTest',
            'serviceController' => 'Runner',
            'timeout' => 5,
            'communication' => array(
                'enabled' => true,
                'type' => 'poll',
                'extension' => null,
                'controller' => null,
                'action' => 'messages',
                'syncActions' => array(
                    'move',
                    'skip',
                    'storeTraceData',
                    'timeout',
                    'exitTest'
                ),
                'service' => null,
                'params' => array(
                )
            )
        ),
        'enable-allow-skipping' => true,
        'enable-validate-responses' => true,
        'force-branchrules' => false,
        'force-preconditions' => false,
        'path-tracking' => false,
        'always-allow-jumps' => false,
        'check-informational' => true,
        'keep-timer-up-to-timeout' => false,
        'allow-shortcuts' => true,
        'shortcuts' => array(
            'calculator' => array(
                'toggle' => 'C'
            ),
            'zoom' => array(
                'in' => 'I',
                'out' => 'O'
            ),
            'comment' => array(
                'toggle' => 'A'
            ),
            'itemThemeSwitcher' => array(
                'toggle' => 'T'
            ),
            'review' => array(
                'toggle' => 'R',
                'flag' => 'M'
            ),
            'keyNavigation' => array(
                'previous' => 'Shift+Tab',
                'next' => 'Tab'
            ),
            'next' => array(
                'trigger' => 'J',
                'triggerAccessibility' => 'Alt+Shift+N'
            ),
            'previous' => array(
                'trigger' => 'K',
                'triggerAccessibility' => 'Alt+Shift+P'
            ),
            'dialog' => array(
            ),
            'magnifier' => array(
                'toggle' => 'L',
                'in' => 'Shift+I',
                'out' => 'Shift+O',
                'close' => 'esc'
            ),
            'highlighter' => array(
                'toggle' => 'Shift+U'
            ),
            'area-masking' => array(
                'toggle' => 'Y'
            ),
            'line-reader' => array(
                'toggle' => 'G'
            ),
            'answer-masking' => array(
                'toggle' => 'D'
            ),
            'apiptts' => array(
                'enterTogglePlayback' => 'Enter',
                'togglePlayback' => 'P',
                'spaceTogglePlayback' => 'Space'
            ),
            'jumplinks' => array(
                'goToQuestion' => 'Alt+Shift+Q',
                'goToTop' => 'Alt+Shift+T'
            )
        ),
        'allow-browse-next-item' => false,
        'item-cache-size' => 3,
        'item-store-ttl' => 900,
        'guidedNavigation' => false,
        'tool-state-server-storage' => array(
        ),
        'force-enable-linear-next-item-warning' => false,
        'enable-linear-next-item-warning-checkbox' => true,
        'enable-read-aloud-text-to-speech' => false
    )
));