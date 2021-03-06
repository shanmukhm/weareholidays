(function() {
    'use strict';

    angular
        .module('weareholidaysApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('timeline', {
            parent: 'entity',
            url: '/timeline?page&sort&search',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'weareholidaysApp.timeline.home.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/timeline/timelines.html',
                    controller: 'TimelineController',
                    controllerAs: 'vm'
                }
            },
            params: {
                page: {
                    value: '1',
                    squash: true
                },
                sort: {
                    value: 'id,asc',
                    squash: true
                },
                search: null
            },
            resolve: {
                pagingParams: ['$stateParams', 'PaginationUtil', function ($stateParams, PaginationUtil) {
                    return {
                        page: PaginationUtil.parsePage($stateParams.page),
                        sort: $stateParams.sort,
                        predicate: PaginationUtil.parsePredicate($stateParams.sort),
                        ascending: PaginationUtil.parseAscending($stateParams.sort),
                        search: $stateParams.search
                    };
                }],
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('timeline');
                    $translatePartialLoader.addPart('global');
                    return $translate.refresh();
                }]
            }
        })
        .state('timeline-detail', {
            parent: 'timeline',
            url: '/timeline/{id}',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'weareholidaysApp.timeline.detail.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/timeline/timeline-detail.html',
                    controller: 'TimelineDetailController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('timeline');
                    return $translate.refresh();
                }],
                entity: ['$stateParams', 'Timeline', function($stateParams, Timeline) {
                    return Timeline.get({id : $stateParams.id}).$promise;
                }],
                previousState: ["$state", function ($state) {
                    var currentStateData = {
                        name: $state.current.name || 'timeline',
                        params: $state.params,
                        url: $state.href($state.current.name, $state.params)
                    };
                    return currentStateData;
                }]
            }
        })
        .state('timeline-detail.edit', {
            parent: 'timeline-detail',
            url: '/detail/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/timeline/timeline-dialog.html',
                    controller: 'TimelineDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['Timeline', function(Timeline) {
                            return Timeline.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('^', {}, { reload: false });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('timeline.new', {
            parent: 'timeline',
            url: '/new',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/timeline/timeline-dialog.html',
                    controller: 'TimelineDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: function () {
                            return {
                                albumContent: null,
                                daySummaryDummyContent: null,
                                intercityTravelLocationPin: null,
                                dayLocationPin: null,
                                checkInContent: null,
                                noteContent: null,
                                contentType: null,
                                contentTimeStamp: null,
                                displayOrder: null,
                                source: null,
                                thirdPartyId: null,
                                dayOrder: null,
                                dateInMilli: null,
                                id: null
                            };
                        }
                    }
                }).result.then(function() {
                    $state.go('timeline', null, { reload: 'timeline' });
                }, function() {
                    $state.go('timeline');
                });
            }]
        })
        .state('timeline.edit', {
            parent: 'timeline',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/timeline/timeline-dialog.html',
                    controller: 'TimelineDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['Timeline', function(Timeline) {
                            return Timeline.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('timeline', null, { reload: 'timeline' });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('timeline.delete', {
            parent: 'timeline',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/timeline/timeline-delete-dialog.html',
                    controller: 'TimelineDeleteController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['Timeline', function(Timeline) {
                            return Timeline.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('timeline', null, { reload: 'timeline' });
                }, function() {
                    $state.go('^');
                });
            }]
        });
    }

})();
