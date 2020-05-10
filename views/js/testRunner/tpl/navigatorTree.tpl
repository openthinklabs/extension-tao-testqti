                <ul class="qti-navigator-parts plain">
                    {{#each parts}}
                    <li class="qti-navigator-part collapsible {{#if active}}active{{else}}collapsed{{/if}}" data-id="{{id}}">
                        <span class="qti-navigator-label" title="{{label}}">
                            <span class="qti-navigator-text">{{label}}</span>
                            <span class="icon-up"></span>
                            <span class="icon-down"></span>
                        </span>
                        {{#if sections.length}}
                        <ul aria-label="{{label}}" class="qti-navigator-sections collapsible-panel plain">
                            {{#each sections}}
                            <li class="qti-navigator-section collapsible {{#if active}}active{{else}}collapsed{{/if}}" data-id="{{id}}">
                                <span class="qti-navigator-label" title="{{label}}">
                                    <span class="qti-navigator-text">{{label}}</span>
                                    <span class="qti-navigator-counter">{{answered}}/{{items.length}}</span>
                                </span>
                                <ul aria-label="{{label}}" class="qti-navigator-items collapsible-panel plain">
                                    {{#each items}}
                                    <li class="qti-navigator-item {{cls}}" data-id="{{id}}" data-position="{{position}}">
                                        <span class="qti-navigator-label truncate" title="{{label}}" tabindex="0"
                                              role="link" aria-disabled="{{#if viewed}}false{{else}}true{{/if}}"
                                              {{#if active}}aria-current="page"{{/if}}
                                              aria-label="{{icon}} {{@index}} of {{../stats.questions}}">
                                            <span class="qti-navigator-icon icon-{{icon}}"></span>
                                            <span class="qti-navigator-number">{{@index}}</span>
                                            {{label}}
                                        </span>
                                    </li>
                                    {{/each}}
                                </ul>
                            </li>
                            {{/each}}
                        </ul>
                        {{else}}
                        <div class="qti-navigator-linear-part collapsible-panel">
                            <span class="icon icon-info" title="{{__ 'In this part of the test navigation is not allowed.'}}"></span>
                            <p class="qti-navigator-message">
                                {{__ 'In this part of the test navigation is not allowed.'}}
                            </p>
                            <p class="qti-navigator-actions">
                                <button class="btn-info small" data-id="{{itemId}}" data-position="{{position}}" title="{{__ 'Start Test-part'}}">
                                    <span class="qti-navigator-text">{{__ 'Start Test-part'}}</span>
                                    <span class="icon-play r"></span>
                                </button>
                            </p>
                        </div>
                        {{/if}}
                    </li>
                    {{/each}}
                </ul>
