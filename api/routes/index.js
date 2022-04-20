const express = require('express');
const {
    fetchExpressions,
    recordExpression,
    updateExpression,
    deleteExpression,
    fetchMeasurements,
    fetchMeasurementsInRange,
    recordMeasurement,
    fetchDeviceByName,
    fetchDeviceByID,
    fetchDevices,
    recordDevice,
    updateDevice,
    deleteDevice,
} = require('../db');
const router = express.Router();

router.get('/measurements', function(req, res, next) {
    if (!req.query.deviceId) {
        res.json({ status: 'ERROR', error: 'deviceId missing' });
        return;
    }

    const { deviceId } = req.query;

    if (req.query.startDate && req.query.endDate) {
        fetchMeasurementsInRange(deviceId, req.query.startDate, req.query.endDate)
            .then((measures) => res.json({ status: 'OK', measures }))
            .catch((error) => res.json({ status: 'ERROR', error }));
    } else {
        fetchMeasurements(deviceId)
            .then((measures) => res.json({ status: 'OK', measures }))
            .catch((error) => res.json({ status: 'ERROR', error }));
    }
});

router.post('/measurement', function(req, res, next) {
    recordMeasurement(req.body)
        .then(() => res.json({ status: 'OK' }))
        .catch((error) => res.json({ status: 'ERROR', error }));
});

router.get('/device', function(req, res, next) {
    if (req.query.name) {
        fetchDeviceByName(req.query.name)
            .then((devices) => res.json({ status: 'OK', device: devices[0] }))
            .catch((error) => res.json({ status: 'ERROR', error}));
    } else if (req.query.id) {
        fetchDeviceByID(req.query.id)
            .then((devices) => res.json({ status: 'OK', device: devices[0] }))
            .catch((error) => res.json({ status: 'ERROR', error }));
    } else {
        fetchDevices()
            .then((devices) => res.json({ status: 'OK', devices }))
            .catch((error) => res.json({ status: 'ERROR', error }));
    }
});

router.post('/device', function(req, res, next) {
    if (req.body.name && req.body.host && req.body.oid && req.body.expressionID) {
        recordDevice(req.body.name, req.body.host, req.body.oid, req.body.expressionID)
            .then((result) => res.json({ status: 'OK', affectedRows: result.affectedRows }))
            .catch((error) => res.json({ status: 'ERROR', error }));
    } else {
        res.json({ status: 'ERROR', error: 'Invalid input' });
    }
});

router.delete('/device', function(req, res, next) {
    if (req.query.id) {
        deleteDevice(req.query.id)
            .then((result) => res.json({ status: 'OK', affectedRows: result.affectedRows }))
            .catch((error) => res.json({ status: 'ERROR', error }));
    } else {
        res.json({ status: 'ERROR', error: 'Invalid input'});
    }
});

router.put('/device', function(req, res, next) {
    if (req.query.id && req.query.name && req.query.host && req.query.oid && req.query.expressionId) {
        const { id, name, host, oid, expressionId } = req.query;
        updateDevice(id, name, host, oid, expressionId)
            .then((result) => res.json({ status: 'OK', affectedRows: result.affectedRows}))
            .catch((error) => res.json({ status: 'ERROR', error}));
    } else {
        res.json({ status: 'ERROR', error: 'Invalid input'});
    }
});

router.get('/expression', function(req, res, next) {
    fetchExpressions()
        .then((expressions) => res.json({ status: 'OK', expressions }))
        .catch((error) => res.json({ status: 'ERROR', error}));
});

router.post('/expression', function(req, res, next) {
    if (req.body.name && req.body.expression) {
        recordExpression(req.body.name, req.body.expression)
            .then((result) => res.json({ status: 'OK', insertId: result.insertId }))
            .catch((error) => res.json({ status: 'ERROR', error }));
    } else {
        res.json({ status: 'ERROR', error: 'Invalid input' });
    }
});

router.put('/expression', function(req, res, next) {
    if (req.query.id && req.query.name && req.query.expression) {
        const { id, name, expression } = req.query;
        updateExpression(id, name, expression)
            .then((result) => res.json({ status: 'OK', affectedRows: result.affectedRows }))
            .catch((error) => res.json({ status: 'ERROR', error }));
    } else {
        res.json({ status: 'ERROR', error: 'Invalid input' });
    }
});

router.delete('/expression', function(req, res, next) {
    if (req.query.id) {
        deleteExpression(req.query.id)
            .then((result) => res.json({ status: 'OK', affectedRows: result.affectedRows }))
            .catch((error) => res.json({ status: 'ERROR', error }));
    } else {
        res.json({ status: 'ERROR', error: 'ID missing' });
    }
});


module.exports = router;
