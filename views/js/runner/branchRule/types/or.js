define(function() {
    'use strict';

    return function orBranchRuleFactory(branchRuleDefinition, item, navigationParams, branchRuleMapper, responseStore) {
        return {
            validate: function validate() {
                return Object.keys(branchRuleDefinition)
                    .filter(function(definitionName) {
                        return definitionName !== '@attributes';
                    })
                    .map(function(definitionName) {
                        return branchRuleMapper(
                            definitionName,
                            branchRuleDefinition[definitionName],
                            item,
                            navigationParams,
                            responseStore
                        ).validate();
                    })
                    .map(function(resultSet) {
                        return resultSet
                            .map(function(result) {
                                if (Array.isArray(result)) {
                                    result = result[0];
                                }

                                return result;
                            })
                            .some(function(expression) {
                                return expression;
                            });
                    })
                    .some(function(expression) {
                        return expression;
                    });
            },
        }
    };
});
