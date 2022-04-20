import Link from 'next/link';
import { useState, Fragment } from 'react';
import { snmpApi } from '../config';

export async function getServerSideProps() {
  const resDevices = await fetch(`${snmpApi}/device`);
  const devicesData = await resDevices.json();

  const resExpressions = await fetch(`${snmpApi}/expression`);
  const expressionsData = await resExpressions.json();


  return { props: { devices: devicesData.devices, expressions: expressionsData.expressions } }
}

function Device({ device, expressions }) {
  const [ isEditing, setEditing ] = useState(false);
  const [ name, setName ] = useState(device.name);
  const [ host, setHost ] = useState(device.host);
  const [ oid, setOID ] = useState(device.oid);
  const [ expressionId, setExpressionId ] = useState(device.expressionId)

  return (
    <li >
      <p>
        ID <strong>{device.id}</strong> <button onClick={() => {
          setEditing(!isEditing);
        }}>Редактирай</button> &nbsp;<button onClick={async () => {
           const options = {
            method: 'DELETE'
           };

          const res = await fetch('/api/deleteDevice?id=' + device.id, options);
          const parsedResponse = await res.json();
          if (parsedResponse.status == 'OK') {
            window.location.reload();
          } else if (parsedResponse.status == 'ERROR') {
            alert(`Грешка: ${parsedResponse.error}`);
          } else {
            alert(`Грешка`);
          }

        }}>Изтрий</button>
      </p>
      <p>
        Име {
          !isEditing ?
          <Link href={{ pathname: '/', query: { deviceId: device.id }}}><a><strong>{device.name}</strong></a></Link> :
          <input type='text' value={name} onChange={(event) => setName(event.target.value)} />
        }
      </p>
      <p>
        Хост {
          !isEditing ?
          <strong>{device.host}</strong> :
          <input type='text' value={host} onChange={(event) => setHost(event.target.value)} />
        }
      </p>
      <p>
        OID (SNMP идентификатор на устройството) {
          !isEditing ?
          <strong>{device.oid}</strong> :
          <input type='text' value={oid} onChange={(event) => setOID(event.target.value)} />
        }
      </p>
      {
        !isEditing ?
        <Fragment>
          <p>
            Асоциирана трансформация <strong>{device.expressionName}</strong>
          </p>
          <p>
            Израз на трансформацията <strong>{device.expression}</strong>
          </p>
        </Fragment> :
        <Fragment>
          <p>
          <label htmlFor="expressions">Израз на трансформация</label> &nbsp;
          <select value={expressionId} onChange={(event) => setExpressionId(event.target.value)}>
            <option></option>
            { expressions.map((expression) => <option key={expression.id} value={expression.id}>{expression.name}</option>) }
          </select>
          </p>
          <button onClick={async () => {
          const options = {
            method: 'PUT'
           };

          const res = await fetch(`/api/updateDevice?id=${device.id}&name=${name}&host=${host}&oid=${oid}&expressionId=${expressionId}`, options);
          const parsedResponse = await res.json();
          if (parsedResponse.status == 'OK') {
            window.location.reload();
          } else if (parsedResponse.status == 'ERROR') {
            alert(`Грешка: ${parsedResponse.error}`);
          } else {
            alert(`Грешка`);
          }
        }}>Запази</button>
        </Fragment>
      }
    </li>
  )
}


export default function Devices({ devices, expressions }) {
  const [ name, setName ] = useState('');
  const [ host, setHost ] = useState('');
  const [ oid, setOID ] = useState('');
  const [ expressionID, setExpressionID ] = useState('');

  const renderDevices = devices.map((device) => (
    <Device key={device.id} device={device} expressions={expressions} />
  ));

  return (
    <div>
      <style jsx>{`
        .add {
          margin-top: 15px;
          display: flex;
        }

        .add > .input {
          margin-right: 20px;
        }

        .add > .input > label {
          margin-right: 10px;
        }
        
        .links {
          margin-bottom: 15px;
        }
        .links > a {
          margin-right: 15px;
          text-decoration: none;
        }
      `}
      </style>
      <div className='links'>
        <Link href="/"><a>Графика</a></Link>
        <Link href="/expressions"><a>Изрази</a></Link>
      </div>
      Устройства:
      <div className="add">
        <div className="input">
          <label htmlFor="name">Име</label>
          <input id="name" type="text" value={name} onChange={(event) => setName(event.target.value)} />
        </div>
        <div className="input">
          <label htmlFor="host">Хост</label>
          <input id="host" type="text" value={host} onChange={(event) => setHost(event.target.value)} />
        </div>
        <div className="input">
          <label htmlFor="OID">OID</label>
          <input id="OID" type="text" value={oid} onChange={(event) => setOID(event.target.value)} />
        </div>
        <div className="input">
          <label htmlFor="expressions">Израз на трансформация</label>
          <select value={expressionID} onChange={(event) => setExpressionID(event.target.value)}>
            <option></option>
            { expressions.map((expression) => <option key={expression.id} value={expression.id}>{expression.name}</option>) }
          </select>
        </div>
        <button onClick={async () => {
          const data = {
            name,
            host,
            oid,
            expressionID,
          };

          const options = {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
          }
          const res = await fetch('/api/postDevice', options);
          const parsedResponse = await res.json();
          if (parsedResponse.status == 'OK') {
            window.location.reload();
          } else if (parsedResponse.status == 'ERROR') {
            alert(`Грешка: ${parsedResponse.error}`);
          } else {
            alert(`Грешка`);
          }
        }}>Добави</button>
      </div>
      <ul>
      {renderDevices}
      </ul>
    </div>
  );
}