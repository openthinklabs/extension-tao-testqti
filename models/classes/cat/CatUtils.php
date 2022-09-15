<?php

namespace oat\taoQtiTest\models\cat;

use qtism\data\AssessmentTest;
use qtism\data\AssessmentSection;
use DOMDocument;
use DOMXPath;

/**
 * Computerized Assessment Test Utilities.
 *
 * This class provide utility methods for CAT support in TAO.
 */
class CatUtils
{
    /**
     * Extract CAT Information from Test Definition.
     *
     * This method extracts CAT Information from a given $test defintion. Please find below an example
     * of return value with an adaptive section with QTI Assessment Section Identifier 'S01'.
     *
     * [
     *      'S01' =>
     *      [
     *          'adaptiveEngineRef' => 'http://somewhere.com/api',
     *          'adaptiveSettingsRef' => 'file.xml'
     *      ]
     * ]
     *
     * @param \qtism\data\AssessmentTest $test
     * @param string $namespace (optional) The namespace where to search the "adaptivity" information in the $test definition. If not given, a default namespace will be traversed.
     * @return array
     */
    public static function getCatInfo(AssessmentTest $test, $namespace = '')
    {
        if ($namespace === '') {
            $namespace = CatService::QTI_2X_ADAPTIVE_XML_NAMESPACE;
        }

        $info = [];

        /** @var AssessmentSection $assessmentSection */
        foreach ($test->getComponentsByClassName('assessmentSection') as $assessmentSection) {
            $selection = $assessmentSection->getSelection();
            if (null === $selection) {
                continue;
            }

            $selectionXml = (string)$selection->getXml();
            if (empty($selectionXml)) {
                continue;
            }

            $xmlExtension = new DOMDocument();
            if (!$xmlExtension->loadXML($selectionXml)) {
                continue;
            }

            $xpath = new DOMXPath($xmlExtension);
            $xpath->registerNamespace('ais', $namespace);

            // Reference QTI assessmentSection identifier.
            $sectionIdentifier = $assessmentSection->getIdentifier();
            $sectionInfo = [];

            // Get the adaptiveEngineRef.
            foreach ($xpath->query('.//ais:adaptiveItemSelection/ais:adaptiveEngineRef', $xmlExtension) as $adaptiveEngineRef) {
                $sectionInfo['adaptiveEngineRef'] = $adaptiveEngineRef->getAttribute('href');
            }

            // Get the adaptiveSettingsRef.
            foreach ($xpath->query('.//ais:adaptiveItemSelection/ais:adaptiveSettingsRef', $xmlExtension) as $adaptiveSettingsRef) {
                $sectionInfo['adaptiveSettingsRef'] = $adaptiveSettingsRef->getAttribute('href');
            }

            // Get the qtiUsagedataRef.
            foreach ($xpath->query('.//ais:adaptiveItemSelection/ais:qtiUsagedataRef', $xmlExtension) as $qtiUsagedataRef) {
                $sectionInfo['qtiUsagedataRef'] = $qtiUsagedataRef->getAttribute('href');
            }

            // Get the qtiUsagedataRef.
            foreach ($xpath->query('.//ais:adaptiveItemSelection/ais:qtiMetadataRef', $xmlExtension) as $qtiMetadataRef) {
                $sectionInfo['qtiMetadataRef'] = $qtiMetadataRef->getAttribute('href');
            }

            if (!empty($sectionInfo)) {
                $info[$sectionIdentifier] = $sectionInfo;
            }
        }

        return $info;
    }

    /**
     * Is a Given Section Adaptive
     *
     * This method checks whether a given AssessmentSection object $section is adaptive.
     *
     * @param \qtism\data\AssessmentSection $section
     * @param string $namespace (optional) The namespace where to search the "adaptivity" information in the $test definition. If not given, a default namespace will be traversed.
     *
     * @return boolean
     */
    public static function isAssessmentSectionAdaptive(AssessmentSection $section, $namespace = '')
    {
        if ($namespace === '') {
            $namespace = CatService::QTI_2X_ADAPTIVE_XML_NAMESPACE;
        }

        $selection = $section->getSelection();
        if (null === $selection) {
            return false;
        }

        $selectionXml = (string)$selection->getXml();
        if (empty($selectionXml)) {
            return false;
        }

        $xmlExtension = new DOMDocument();
        if (!$xmlExtension->loadXML($selectionXml)) {
            return false;
        }

        $xpath = new DOMXPath($xmlExtension);
        $xpath->registerNamespace('ais', $namespace);

        return $xpath->query('.//ais:adaptiveItemSelection', $xmlExtension)->length > 0;
    }
}
