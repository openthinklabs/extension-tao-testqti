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
 * QTI test packages with 3 items
 */

const base64NonLinearTest = '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';

export default base64NonLinearTest;
