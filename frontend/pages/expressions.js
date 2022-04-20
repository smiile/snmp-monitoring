import { useState } from 'react';
import Link from 'next/link';
import { snmpApi } from '../config';

export async function getServerSideProps() {
  // Fetch data from external API
  const res = await fetch(`${snmpApi}/expression`)
  const data = await res.json()

  // Pass data to the page via props
  return { props: { expressions: data.expressions } }
}

function Expression({ expression }) {
  const [ updatedName, setUpdatedName ] = useState(expression.name);
  const [ updatedExpression, setUpdatedExpression ] = useState(expression.expression);
  const [ isEditing, setEditing ] = useState(false);

  return (
    <li>
      <p>
        ID <strong>{expression.id}</strong> <button onClick={() => {
          setEditing(!isEditing);
        }}>Редактирай</button> &nbsp;
        <button onClick={async () => {
           const options = {
            method: 'DELETE'
           };

          const res = await fetch('/api/deleteExpression?id=' + expression.id, options);
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
        <strong>{expression.name}</strong> :
        <input value={updatedName} onChange={(event) => setUpdatedName(event.target.value)} />
      }
      </p>
      <p>
        Израз {
        !isEditing ?
        <strong>{expression.expression}</strong> :
        <input value={updatedExpression} onChange={(event) => setUpdatedExpression(event.target.value)} />
      }
      </p>
      {
        isEditing &&
        <button onClick={async () => {
          const options = {
            method: 'PUT'
           };

          const res = await fetch(`/api/updateExpression?id=${expression.id}&name=${updatedName}&expression=${updatedExpression}`, options);
          const parsedResponse = await res.json();
          if (parsedResponse.status == 'OK') {
            window.location.reload();
          } else if (parsedResponse.status == 'ERROR') {
            alert(`Грешка: ${parsedResponse.error}`);
          } else {
            alert(`Грешка`);
          }
        }}>Запази</button>
      }
    </li>
  );
}


export default function Expressions({ expressions }) {
  const [ name, setName ] = useState('');
  const [ expression, setExpression ] = useState('');

  const renderExpressions = expressions.map((expression) => (
    <Expression key={expression.id} expression={expression} />
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
        <Link href="/devices"><a>Устройства</a></Link>
      </div>
      Изрази:
      <div className="add">
        <div className="input">
          <label htmlFor="name">Име</label>
          <input id="name" type="text" value={name} onChange={(event) => setName(event.target.value)} />
        </div>
        <div className="input">
          <label htmlFor="expression">Израз на трансформация</label>
          <input id="expression" type="text" value={expression} onChange={(event) => setExpression(event.target.value)} />
        </div>
        <button onClick={async () => {
          const data = {
            name,
            expression,
          };

          const options = {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
          }
          const res = await fetch('/api/postExpression', options);
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
      {renderExpressions}
      </ul>
    </div>
  );
}