/**
 * This file contains all necessary Angular controller definitions for 'frontend.admin.login-history' module.
 *
 * Note that this file should only contain controllers and nothing else.
 */
(function () {
    'use strict';

    angular.module('frontend.settings').controller('SettingsController', [
        '_',
        '$scope',
        '$rootScope',
        '$log',
        'EmailTransport',
        'Settings',
        'MessageService',
        '$uibModal',
        '_integrations',
        function controller(
            _,
            $scope,
            $rootScope,
            $log,
            EmailTransport,
            Settings,
            MessageService,
            $uibModal,
            _integrations
        ) {
            $scope.settings = [
                {
                    id: 'general',
                    name: 'General Setting',
                    templateUrl: 'general-setting.html',
                    description: 'Make some settings like refresh page and base Url',
                    isAdded: false,
                    icon: 'mdi-home'
                },
                {
                    id: 'notification',
                    name: 'Notifications',
                    templateUrl: 'notification-setting.html',
                    description: 'Settings all notification in your system',
                    isAdded: false,
                    icon: 'mdi-message'
                },
                {
                    id: 'user-permissions',
                    name: 'User Permissions',
                    templateUrl: 'permissions-setting.html',
                    description: 'Configure permissions for users can be access',
                    isAdded: false,
                    icon: 'mdi-security-account'
                },
                {
                    id: 'auth-provider',
                    name: 'Auth Provider',
                    templateUrl: 'auth-provider-setting.html',
                    description: 'Configure mutliple Authentication Providers like internal, ldap, oidc...',
                    isAdded: false,
                    icon: 'mdi-security-lock'
                },

                {
                    id: 'signup-restriction',
                    name: 'Signup Restrictions',
                    templateUrl: 'signup-restriction-setting.html',
                    description: 'Enable/Disable Registristration ',
                    isAdded: false,
                    icon: 'mdi-security-close'
                },
            ];

            $scope.activeSetting = 'general';
            $scope.setActiveSetting = setActiveSetting;

            $scope.filterSetting = filterSetting;
            if (_integrations.data && _integrations.data.length) {
                $rootScope.integrations = _integrations.data;
            }

            $scope.updateKongaSettings = function () {
                updateKongaSettings();
            };

            $scope.setDefaultTransport = function (name) {
                if ($rootScope.KONGA_CONFIG.default_transport === name) {
                    $rootScope.KONGA_CONFIG.default_transport = null;
                } else {
                    $rootScope.KONGA_CONFIG.default_transport = name;
                }

                updateKongaSettings();
            };

            $scope.configureIntegration = function (item) {
                $uibModal.open({
                    animation: true,
                    ariaLabelledBy: 'modal-title',
                    ariaDescribedBy: 'modal-body',
                    size: 'sm',
                    templateUrl:
                        'js/app/settings/configure-integration-modal.html',
                    controller: function (
                        _,
                        $scope,
                        $rootScope,
                        $log,
                        $uibModalInstance,
                        MessageService,
                        _item
                    ) {
                        $scope.integration = _item;

                        $scope.close = function () {
                            $uibModalInstance.dismiss();
                        };

                        $scope.submit = function () {
                            updateKongaIntegration($scope.integration);
                            $uibModalInstance.dismiss();
                        };
                    },
                    resolve: {
                        _item: function () {
                            return item;
                        },
                    },
                });
            };

            $scope.configureTransport = function (transport) {
                $uibModal.open({
                    animation: true,
                    ariaLabelledBy: 'modal-title',
                    ariaDescribedBy: 'modal-body',
                    size: 'sm',
                    templateUrl:
                        'js/app/settings/configure-transport-modal.html',
                    controller: function (
                        _,
                        $scope,
                        $rootScope,
                        $log,
                        $uibModalInstance,
                        MessageService,
                        EmailTransport,
                        _transport
                    ) {
                        $scope.transport = _transport;
                        $log.info(
                            'configureTransport:transport => ',
                            $scope.transport
                        );

                        $scope.close = function () {
                            $uibModalInstance.dismiss();
                        };

                        $scope.submit = function () {
                            EmailTransport.update($scope.transport.id, {
                                settings: $scope.transport.settings,
                            }).then(function (updated) {
                                MessageService.success('Transport updated!');
                                $scope.close();
                            });
                        };

                        $scope.getModelParent = function (path) {
                            var segs = path.split('.');
                            var root = $scope.transport.settings;

                            while (segs.length > 1) {
                                var pathStep = segs.shift();
                                if (typeof root[pathStep] === 'undefined') {
                                    root[pathStep] = {};
                                }
                                root = root[pathStep];
                            }
                            return root;
                        };

                        $scope.getModelLeaf = function (path) {
                            var segs = path.split('.');
                            return segs[segs.length - 1];
                        };

                        $scope.getItemValue = function (item, path) {
                            return _.get(item, path, '');
                        };

                        $scope.setItemValue = function (item, path, value) {
                            return _.set(item, path, value);
                        };
                    },
                    resolve: {
                        _transport: function () {
                            return transport;
                        },
                    },
                });
            };
            function setActiveSetting(id) {
                $scope.activeSetting = id;
            }
            function filterSetting(setting) {
                return setting.id == $scope.activeSetting;
            }

            function updateKongaIntegration(integration) {
                var scopeIntegrationIndex = _.findIndex(
                    $scope.integrations,
                    function (item) {
                        return item.id === integration.id;
                    }
                );

                if (scopeIntegrationIndex > -1) {
                    $scope.integrations[scopeIntegrationIndex] = integration;
                }

                updateKongaSettings();
            }

            function updateKongaSettings() {
                Settings.update(window.KONGA_CONFIG_ID, {
                    data: _.merge($rootScope.KONGA_CONFIG, {
                        integrations: $scope.integrations || [],
                    }),
                }).then(
                    function (settings) {
                        $log.debug('Konga Settings updated', settings);
                        MessageService.success('Settings updated!');
                    },
                    function (error) {
                        $log.debug('Konga Settings failed to update', error);
                        MessageService.error('Failed to update settings!');
                    }
                );
            }

            function _fetchEmailTransports() {
                EmailTransport.load().then(function (transports) {
                    $scope.transports = transports;
                    $log.debug(
                        'NotificationsController:transports =>',
                        $scope.transports
                    );
                });
            }

            _fetchEmailTransports();
        },
    ]);
})();
