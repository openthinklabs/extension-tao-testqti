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
 * Copyright (c) 2021 (original work) Open Assessment Technologies SA;
 */

declare(strict_types=1);

namespace oat\taoQtiTest\models\render\CustomInteraction\ServiceProvider;

use oat\generis\model\DependencyInjection\ContainerServiceProviderInterface;
use oat\taoItems\model\render\ItemAssetsReplacement;
use oat\taoQtiTest\models\render\CustomInteraction\CustomInteractionPostProcessorAllocator;
use oat\taoQtiTest\models\render\CustomInteraction\PostProcessor\FallbackInteractionPostProcessor;
use oat\taoQtiTest\models\render\CustomInteraction\PostProcessor\TextReaderPostProcessor;
use Symfony\Component\DependencyInjection\Loader\Configurator\ContainerConfigurator;
use function Symfony\Component\DependencyInjection\Loader\Configurator\service;

class CustomInteractionPostProcessingServiceProvider implements ContainerServiceProviderInterface
{
    public function __invoke(ContainerConfigurator $configurator): void
    {
        $services = $configurator->services();

        $services
            ->set(TextReaderPostProcessor::class, TextReaderPostProcessor::class)
            ->public()
            ->args([
                service(ItemAssetsReplacement::SERVICE_ID)
            ]);

        $services
            ->set(FallbackInteractionPostProcessor::class, FallbackInteractionPostProcessor::class)
            ->public()
            ->args([
                service(ItemAssetsReplacement::SERVICE_ID)
            ]);

        $services
            ->set(CustomInteractionPostProcessorAllocator::class, CustomInteractionPostProcessorAllocator::class)
            ->public()
            ->args([
                [
                    TextReaderPostProcessor::INTERACTION_IDENTIFIER => service(TextReaderPostProcessor::class),
                    FallbackInteractionPostProcessor::INTERACTION_IDENTIFIER => service(FallbackInteractionPostProcessor::class)
                ]
            ]);
    }
}
