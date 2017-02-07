angular.module('orsApp.ors-aa-queries', ['orsApp.ors-aa-query', 'orsApp.ors-export-query']).component('orsAaQueries', {
    templateUrl: 'components/ors-panel-accessibilityanalysis/ors-aa-queries/ors-aa-queries.html',
    bindings: {},
    controller: ['orsMessagingService', 'orsAaService', function(orsMessagingService, orsAaService) {
        let ctrl = this;
        ctrl.aaQueries = orsAaService.aaQueries;
        orsAaService.subscribeToAaQueries(function onNext(d) {
            ctrl.aaQueries.push(d);
            // add newest isochrone to map with addToMap()
            ctrl.toggleQuery(ctrl.aaQueries.length - 1);
        });
        ctrl.deleteQuery = (isoidx) => {
            // turn off isochrones with this index
            ctrl.removeQuery(isoidx);
            // remove from ng repeat
            ctrl.aaQueries.splice(isoidx, 1);
            // re-add all indices as custom indices won't correspond anymore
            orsAaService.reshuffle();
        };
        ctrl.toggleQuery = (isoidx) => {
            orsAaService.toggleQuery(isoidx, ctrl.aaQueries[isoidx]);
        };
        ctrl.removeQuery = (isoidx) => {
            orsAaService.removeQuery(isoidx);
        };
        ctrl.downloadQuery = (isoidx) => {
            ctrl.selectedIsochroneData = ctrl.aaQueries[isoidx];
            ctrl.showExport = !ctrl.showExport;
        };
        ctrl.zoomTo = (isoidx, isonum = -1) => {
            let geometry;
            geometry = ctrl.aaQueries[isoidx].features[isonum].geometry.coordinates[0];
            orsAaService.zoomTo(geometry);
        };
        ctrl.emph = (isoidx, isonum = -1) => {
            let geometry;
            if (isonum > -1) {
                geometry = ctrl.aaQueries[isoidx].features[isonum].geometry.coordinates[0];
            } else {
                let isolargest = ctrl.aaQueries[isoidx].features.length - 1;
                geometry = ctrl.aaQueries[isoidx].features[isolargest].geometry.coordinates[0];
            }
            orsAaService.Emph(geometry);
        };
        ctrl.deEmph = () => {
            orsAaService.DeEmph();
        };
        // coming back?
        if (ctrl.aaQueries.length > 0) {
            for (let i = 0; i < ctrl.aaQueries.length; i++) {
                orsAaService.toggleQuery(i, ctrl.aaQueries[i].features, ctrl.aaQueries[i].info.query.locations[0]);
            }
        }
    }]
});