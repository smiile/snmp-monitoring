const mysql = require('mysql');


const connection = mysql.createConnection({
  host: process.env.DBhost,
  user: process.env.DBuser,
  password: process.env.DBpassword,
  database: process.env.DBdatabase,
});

connection.connect();

const queryRunner = (query) => {
  return new Promise((resolve, reject) => {
    connection.query(query, function (error, results, fields) {
      console.log(`query executed: ${query}`);
  
      if (error) {
        console.error(error);
        reject(error);
      }
  
      resolve(results);
    });
  });
};

const fetchExpressions = async function() {
  const expressions = await queryRunner(`SELECT * FROM expressions;`);

  return expressions;
}

const recordExpression = async function(name, expression) {
  const result = await queryRunner(`INSERT INTO expressions (id, name, expression) VALUES(NULL, '${name}', '${expression}');`);

  return result;
};

const deleteExpression = async function(id) {
  const result = await queryRunner(`DELETE FROM expressions where id=${id};`);

  return result;
}

const updateExpression = async function(id, name, expression) {
  const result = await queryRunner(`UPDATE expressions SET name ='${name}', expression ='${expression}' WHERE id=${id}`);

  return result;
}

const fetchDeviceByName = async function(name) {
  const device = await queryRunner(`SELECT * FROM devices WHERE name = '${name}';`);

  return device;
}

const fetchDevices = async function() {
  const device = await queryRunner(`SELECT devices.id, devices.name, devices.oid, devices.host, expression_id as expressionId, expressions.name as expressionName, expressions.expression FROM devices JOIN expressions on devices.expression_id=expressions.id;`);

  return device;
}

const fetchDeviceByID = async function(id) {
  const device = await queryRunner(`SELECT devices.id, devices.name, devices.oid, devices.host, expressions.name as expressionName, expressions.expression FROM devices JOIN expressions on devices.expression_id=expressions.id where devices.id = ${id};`);

  return device;
}

const recordDevice = async function(name, host, oid, expressionId) {
  const result = await queryRunner(`INSERT INTO devices (id, name, oid, host, expression_id) VALUES (NULL, '${name}', '${host}', '${oid}', ${expressionId});`)

  return result;
}

const deleteDevice = async function(id) {
  const result = await queryRunner(`DELETE from devices WHERE id=${id};`);

  return result;
}

const updateDevice = async function(id, name, host, oid, expressionId) {
  const result = await queryRunner(`UPDATE devices SET name = '${name}', host = '${host}', oid = '${oid}', expression_id = ${expressionId} WHERE id = ${id}`);

  return result;
}

const fetchMeasurements = async function(deviceId) {
  const measurements = await queryRunner("SELECT * FROM `measurements` where " + `device_id = ${deviceId};`);

  return measurements;
}

const fetchMeasurementsInRange = async function(deviceId, start, end) {
  const measurements = await queryRunner("SELECT * FROM `measurements` where "+`timestamp >= '${start}' and timestamp <= '${end}' and device_id = ${deviceId};`);

  return measurements;
}

const recordMeasurement = async function(measurement) {
  const result = await queryRunner(
    "INSERT INTO `measurements` (`id`, `raw_measurement`, `device_id`, `timestamp`) VALUES "
    +
    `(NULL, '${measurement.analogValue}', ${measurement.deviceId} , '${measurement.date}');`
  );

  return result;
}

module.exports = {
  fetchMeasurements,
  fetchMeasurementsInRange,
  recordMeasurement,
  fetchDeviceByName,
  fetchDeviceByID,
  fetchDevices,
  recordDevice,
  deleteDevice,
  updateDevice,
  fetchExpressions,
  recordExpression,
  deleteExpression,
  updateExpression,
};
