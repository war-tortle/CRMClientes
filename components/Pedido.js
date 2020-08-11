import React, { useState, useEffect } from 'react';
import { useMutation, gql } from '@apollo/client';
import Swal from 'sweetalert2';

const ACTUALIZAR_PEDIDO = gql `
	mutation actualizarPedido($id: ID!, $input: PedidoInput) {
		actualizarPedido(id: $id, input: $input) {
			estado
		}
	}
`;

const ELIMINAR_PEDIDO = gql `
	mutation eliminarPedido($id: ID!) {
		eliminarPedido(id: $id)
	}
`;

const OBTENER_PEDIDOS = gql `
	query obtenerPedidosVendedor {
		obtenerPedidosVendedor {
			id
		}
	}
`;

const Pedido = ({ pedido }) => {

	const { id, total, cliente: { nombre, apellido, email, telefono }, estado } = pedido;

	// Mutation para cambiar el estado de un pedido
	const [ actualizarPedido ] = useMutation(ACTUALIZAR_PEDIDO);
	const [ eliminarPedido ] = useMutation(ELIMINAR_PEDIDO, {
		update(cache) {
			const { obtenerPedidosVendedor } = cache.readQuery({
				query: OBTENER_PEDIDOS
			});

			cache.writeQuery({
				query: OBTENER_PEDIDOS,
				data: {
					obtenerPedidosVendedor: obtenerPedidosVendedor.filter( pedido => pedido.id !== id )
				}
			})
		}
	});

	const [ estadoPedido, setEstadoPedido ] = useState(estado);
	const [ clase, setClase ] = useState('');

	useEffect(() => {
		if(estadoPedido) {
			setEstadoPedido(estadoPedido);
		}
		calsePedido(); 	
	}, [estadoPedido]);

	// Funcion modifica el color del pedido de acuerdo a su estado
	const calsePedido = () => {
		if(estadoPedido === 'PENDIENTE') {
			setClase('border-yellow-500')
		} else if(estadoPedido === 'COMPLETADO') {
			setClase('border-green-500')
		} else {
			setClase('border-red-800')
		}
	};

	const cambiarEstadoPedido = async nuevoEstado => {
		try {
			const { data } = await actualizarPedido({
				variables: {
					id,
					input: {
						estado: nuevoEstado,
						cliente: pedido.cliente.id
					}
				}
			});

			setEstadoPedido(data.actualizarPedido.estado);
		} catch (error) {
			console.log(error);
		}
	};

	const confirmarEliminarPedido = () => {
		Swal.fire({
		  title: "¿Deseas eliminar a este pedido?",
		  text: "Esta acción no se puede deshacer",
		  icon: 'warning',
		  showCancelButton: true,
		  confirmButtonColor: '#3085d6',
		  cancelButtonColor: '#d33',
		  confirmButtonText: "Si, Eliminar!",
		  cancelButtonText: "No, Cancelar"
		}).then( async (result) => {
		  	if (result.value) {
		  		try {
		  			const data = await eliminarPedido({
		  				variables: {
		  					id
		  				}
		  			});

		  			Swal.fire(
		  				'Eliminado',
		  				data.eliminarPedido,
		  				'success'
		  			)
		  		} catch(error) {
		  			console.log(error);
		  		}
			}  		
		})
	}

	return (
		<div className={`${clase} border-t-4 mt-4 bg-white rounded p-6 md:grid md:grid-cols-2 md:gap-4 shadow-lg`}>
			<div className="">
				<p className="font-bold text-gray-800">Cliente: {nombre} {apellido}</p>

				{email && (
					<p className="flex items-center my-2">
						<svg viewBox="0 0 20 20" fill="currentColor" className="mail w-4 h-4 mr-2">
							<path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
							<path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
						</svg>
						{email}
					</p>
				)}

				{telefono && (
					<p className="flex items-center my-2">
						<svg viewBox="0 0 20 20" fill="currentColor" className="phone w-4 h-4 mr-2">
							<path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
						</svg>
						{telefono}
					</p>
				)}

				<h2 className="text-gray-800 font-bold mt-10">Estado Pedido:</h2>

				<select
					className="mt-2 appearance-none bg-blue-600 border border-blue-600 text-white p-2 text-center rounded leading-tight focus:outline-none focus:bg-blue-600 focus:border-blue-500 uppercase text-xs font-bold"
					value={estadoPedido}
					onChange={e => cambiarEstadoPedido( e.target.value )}
				>
					<option value="COMPLETADO">COMPLETADO</option>
					<option value="PENDIENTE">PENDIENTE</option>
					<option value="CANCELADO">CANCELADO</option>
				</select>
			</div>
			<div>
				<h2 className="text-gray-800 font-bold mt-2">Resumen del pedido</h2>
				{ pedido.pedido.map(articulo => (
					<div key={articulo.id} className="mt-4">
						<p className="text-sm text-gray-600">Producto: {articulo.nombre}</p>
						<p className="text-sm text-gray-600">Cantidad: {articulo.cantidad}</p>
					</div>
				))}


				<p className="text-gray-800 mt-3 font-bold"> Total a pagar: 
					<span className="font-light"> $ {total}</span>
				</p>

				<button
					type="button"
					className="uppercase text-xs font-bold flex items-center mt-4 bg-red-800 px-5 py-2 inline-block text-white rounded leading-tight"
					onClick={ () => confirmarEliminarPedido() }
				>
					Eliminar pedido
					<svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 ml-2">
						<path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
					</svg>
				</button>
			</div>
		</div>
	);
}

export default Pedido;