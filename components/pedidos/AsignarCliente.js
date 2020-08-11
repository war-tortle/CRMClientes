import React, { useState, useEffect, useContext } from 'react';
import Select from 'react-select';
import { useQuery, gql } from '@apollo/client';
import PedidoContext from '../../context/pedidos/PedidoContext';

const OBTENER_CLIENTES_USUARIO = gql `
	query obtenerClientesVendedor {
		obtenerClientesVendedor {
			id
			nombre
			apellido
			empresa
			email
		}
	}
`;

const clientes = [
	{ id: 1, nombre: 'Juan' },
  	{ id: 2, nombre: 'Pablo' },
  	{ id: 3, nombre: 'Juan Pablo' }
]

const AsignarCliente = () => {
	
	const [ cliente, setcliente ] = useState([]);

	// Context de pedidos
	const pedidoContext = useContext(PedidoContext);
	const { agregarCliente } = pedidoContext;

	// Consultar la BBDD
	const { data, loading, error } = useQuery(OBTENER_CLIENTES_USUARIO);

	//console.log(data);
	//console.log(loading);
	//console.log(error);

	useEffect(() => {
		agregarCliente(cliente);
	}, [cliente]);

	const seleccionarCliente = clientes => {
		setcliente(clientes);
	};

	// Resultados de la consulta
	if(loading) return null;

	const { obtenerClientesVendedor } = data;

	return (

		<>
			<p className="mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold">1.- Asigna un Cliente al pedido</p>
			<Select
				className="mt-3 "
				options={ obtenerClientesVendedor }
				isMulti={ false }
				onChange={ opcion => seleccionarCliente(opcion) }
				getOptionValue={ opciones => opciones.id }
				getOptionLabel={ opciones => opciones.nombre }
				placeholder="Busque o Seleccione el Cliente"
				noOptionsMessage={ () => "No hay resultados"}
			/>
		</>
	)
}

export default AsignarCliente;