const snmp = require ("net-snmp");
const axios = require('axios');
const moment = require('moment');
const config = require('./config.js')
const args = process.argv.slice(2);


if (args.length != 2 || isNaN(args[1])) {
  console.error("Грешни аргументи");
  console.log("Пример: ./node index.js temp_sensor 5");
  console.log("-- всеки 5 секунди ще се изпълнява --");
  return;
}

const [ deviceName, callInterval ] = args;

function getDeviceParameters() {
  axios.get(`${config.snmpApi}/device?name=${deviceName}`)
    .then((response) => {
      const { oid, host, id: deviceId } = response.data.device;
      const [ ip, port ] = host.split(":");

      performRequestAndWrite(ip, port, oid, deviceId);
      setInterval(performRequestAndWrite, callInterval * 1000, ip, port, oid, deviceId);
    })
    .catch((error) => console.log(error));
}

function performRequestAndWrite(ip, port, oid, deviceId) {
  const session = snmp.createSession(ip, "private", { port, version: snmp.Version1 });
  const oids = [ oid ];
  let response = null;

  session.get(oids, function (error, varbinds) {
    if (error) {
      console.error (error);
    } else {
      for (let i = 0; i < varbinds.length; i++) {
        if (snmp.isVarbindError (varbinds[i])) {
          console.error (snmp.varbindError (varbinds[i]));
        } else {
          response = varbinds[i].value;
        }
      }
    }

    session.close ();
    console.log(moment().format('YYYY-MM-DD HH:mm:ss'));
    const body = {analogValue: response, date: moment().format('YYYY-MM-DD HH:mm:ss'), deviceId }
  
    axios
      .post(`${config.snmpApi}/measurement`, body)
      .then(res => {
        console.log(`statusCode: ${res.status}`)
        console.log(res.data)
      })
      .catch(error => {
        console.error(error)
      });
  });
}

getDeviceParameters()





    