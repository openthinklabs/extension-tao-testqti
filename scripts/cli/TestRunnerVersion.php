<?php
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
 * Copyright (c) 2016 (original work) Open Assessment Technologies SA;
 */
namespace oat\taoQtiTest\scripts\cli;

use oat\taoQtiItem\model\ItemModel;
use oat\taoDelivery\model\execution\DeliveryServerService;
use oat\oatbox\extension\AbstractAction;
use oat\taoQtiTest\models\TestModelService;
use oat\taoQtiTest\models\compilation\CompilationService;
use common_report_Report as Report;
/**
 * Class TestRunnerVersion
 *
 * Displays the version of the Test Runner
 *
 * @package oat\taoQtiTest\scripts\install
 */
class TestRunnerVersion extends AbstractAction
{
    /**
     * Builds a result set
     * @param string $message
     * @param bool $newRunner
     * @param bool $correct
     * @return array
     */
    private function resultData($message, $newRunner, $correct)
    {
        return [
            'message' => $message,
            'new' => $newRunner,
            'correct' => !!$correct
        ];
    }

    /**
     * Checks if a class complies to the wanted one
     * @param string $configClass
     * @param string $checkClass
     * @return bool
     */
    private function isClass($configClass, $checkClass)
    {
        return $configClass == $checkClass || is_subclass_of($configClass, $checkClass);
    }

    /**
     * Checks the version of the DeliveryServer Test Runner container
     * @return array
     * @throws \common_ext_ExtensionException
     */
    private function checkDeliveryServer()
    {
        $service = $this->getServiceLocator()->get(DeliveryServerService::SERVICE_ID);
        if ($service->hasOption('deliveryContainer')) {
            $deliveryContainerClass = $service->getOption('deliveryContainer');
            $oldRunnerClass = 'oat\\taoDelivery\\helper\\container\\DeliveryServiceContainer';
            $newRunnerClass = 'oat\\taoDelivery\\helper\\container\\DeliveryClientContainer';
            if ($this->isClass($deliveryContainerClass, $newRunnerClass)) {
                $result = $this->resultData('Default Container: New TestRunner', true, true);
            } else if ($this->isClass($deliveryContainerClass, $oldRunnerClass)) {
                $result = $this->resultData('Default Container: Old TestRunner', false, true);
            } else {
                $result = $this->resultData('Default Container: Unknown version / bad config (' . $deliveryContainerClass . ')', false, false);
            }
        } else {
            $result = $this->resultData('No container set for legacy deliveries', null, true);
        }

        return $result;
    }

    /**
     * Checks the version of the Item Compiler
     * @return array
     * @throws \common_ext_ExtensionException
     */
    private function checkCompiler()
    {
        $testModelService = $this->getServiceManager()->get(TestModelService::SERVICE_ID);
        $compiler = $testModelService->getOption(TestModelService::SUBSERVICE_COMPILATION);
        if ($compiler->hasOption(CompilationService::OPTION_CLIENT_TESTRUNNER)) {
            $newRunner = $compiler->getOption(CompilationService::OPTION_CLIENT_TESTRUNNER);
            $descString = $newRunner ? 'Compiler Class: New TestRunner' : 'Compiler Class: Old TestRunner';
            $result = $this->resultData($descString, $newRunner, true);
        } else {
            /** @var ItemModel $itemModelService */
            $itemModelService = $this->getServiceManager()->get(ItemModel::SERVICE_ID);
            $compilerClass = $itemModelService->getOption(ItemModel::COMPILER);

            $oldRunnerClass = 'oat\\taoQtiItem\\model\\QtiItemCompiler';
            $newRunnerClass = 'oat\\taoQtiItem\\model\\QtiJsonItemCompiler';

            if ($this->isClass($compilerClass, $newRunnerClass)) {
                $result = $this->resultData('No Runner set, fallback item compiler class: New TestRunner', true, true);
            } else if ($this->isClass($compilerClass, $oldRunnerClass)) {
                $result = $this->resultData('No Runner set, fallback item compiler class: Old TestRunner', false, true);
            } else {
                $result = $this->resultData('No Runner set, fallback item compiler class: Unknown version / bad config (' . $compilerClass . ')', false, false);
            }
        }
        return $result;
    }

    /**
     * Checks the version of the Test Runner Session
     * @return array
     * @throws \common_ext_ExtensionException
     */
    private function checkTestSession()
    {
        $ext = \common_ext_ExtensionsManager::singleton()->getExtensionById('taoQtiTest');
        $config = $ext->getConfig('testRunner');

        if (isset($config['test-session'])) {
            $testSessionClass = $config['test-session'];
        } else {
            $testSessionClass = '';
        }

        $oldRunnerClass = '\\taoQtiTest_helpers_TestSession';
        $newRunnerClass = 'oat\\taoQtiTest\\models\\runner\\session\\TestSession';

        if ($this->isClass($testSessionClass, $newRunnerClass)) {
            $result = $this->resultData('Test Session: New TestRunner', true, true);
        } else if ($this->isClass($testSessionClass, $oldRunnerClass)) {
            $result = $this->resultData('Test Session: Old TestRunner', false, true);
        } else {
            $result = $this->resultData('Test Session: Unknown version / bad config (' . $testSessionClass . ')', false, false);
        }

        return $result;
    }

    /**
     * Checks the version of the Test Runner
     * @param $params
     * @return Report
     */
    public function __invoke($params)
    {
        $checks = [
            $this->checkDeliveryServer(),
            $this->checkCompiler(),
            $this->checkTestSession(),
        ];

        $messages = [];
        $correct = true;
        $someOld = false;
        $someNew = false;
        foreach ($checks as $check) {
            $messages[] = $check['message'];
            $correct = $correct && $check['correct'];
            if ($check['new'] === true) {
                $someNew = true;
            } elseif ($check['new'] === false) {
                $someOld = true;
            }
        }

        $correct = $correct && ($someNew xor $someOld);
        if (!$correct) {
            $report = new Report(Report::TYPE_ERROR, "WARNING!\nThe Test Runner does not seem to be well configured!");
            if ($someNew && $someOld) {
                $report->add(new Report(Report::TYPE_ERROR, "There is a mix of different versions!"));
            }
        } else if ($someNew) {
            $report = new Report(Report::TYPE_SUCCESS, "The New Test Runner is activated");
        } else {
            $report = new Report(Report::TYPE_SUCCESS, "The Old Test Runner is activated");
        }

        foreach ($messages as $message) {
            $report->add(new Report(Report::TYPE_INFO, $message));
        }

        return $report;
    }
}
