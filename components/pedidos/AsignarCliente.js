import React, { useState, useEffect } from 'react';
import Select from 'react-relect';

const clientes = [
	{ id: 1, nombre: 'Juan' },
  	{ id: 2, nombre: 'Pablo' },
  	{ id: 3, nombre: 'Juan Pablo' }
]

const AsignarCliente = () => {
	
	const [ cliente, setcliente ] = useState([]);

	useEffect(() => {
		console.log(cliente);
	}, [cliente])

	const seleccionarCliente = clientes => {
		setcliente(clientes);
	}

	return (
		<Select
			options={ clientes }
			isMulti={ true }
			onChange={ opcion => seleccionarCliente(opcion) }
			getOptionValue={ opciones => opciones.id }
			getOptionLabel={ opciones => opciones.nombre }
			placeholder="Busque o Seleccione el Cliente"
			noOptionsMessage={ () => "No hay resultados"}
		/>
	)
}