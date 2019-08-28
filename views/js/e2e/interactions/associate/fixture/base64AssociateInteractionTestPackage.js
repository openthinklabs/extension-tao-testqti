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
 * Copyright (c) 2019 (original work) Open Assessment Technologies SA ;
 */

/**
 * QTI test package with:
 * - single item
 * - single choice interaction
 * - tools enabled: none
 */
const base64Test = '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';

export default base64Test;
