// campos formulario
const mascotaInput = document.querySelector('#mascota');
const propietarioInput = document.querySelector('#propietario');
const telefonoInput = document.querySelector('#telefono');
const fechaInput = document.querySelector('#fecha');
const horaInput = document.querySelector('#hora');
const sintomasInput = document.querySelector('#sintomas');

// UI
const formulario = document.querySelector('#nueva-cita');
const contenedorCitas =  document.querySelector('#citas');

let editando;
// events
evetnListeners();
function evetnListeners(){
    mascotaInput.addEventListener('input', datosCita);
    propietarioInput.addEventListener('input', datosCita);
    telefonoInput.addEventListener('input', datosCita);
    fechaInput.addEventListener('input', datosCita);
    horaInput.addEventListener('input', datosCita);
    sintomasInput.addEventListener('input', datosCita);

    formulario.addEventListener('submit', nuevaCita);
}

// CLASES
class Citas{
    constructor() {
        this.citas = [];
    }

    agregarCitas(cita){
        this.citas = [...this.citas, cita];
    }

    eliminarCita(id){
        console.log(id);
        this.citas = this.citas.filter(cita => cita.id !== id);
    }

    editarCita(citaAct){
        this.citas = this.citas.map( cita => cita.id === citaAct.id ? citaAct : cita);
    }
}

class UI {
    imprimirAlerta(mensaje,error){
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert', 'd-block','col-12');
        
        if(error === 'error'){
            divMensaje.classList.add('alert-warning');            
        } else{
            divMensaje.classList.add('alert-success');
        }

        divMensaje.textContent = mensaje;
        document.querySelector('#contenido').insertBefore(divMensaje, document.querySelector('.agregar-cita'));

        setTimeout(() => {
            divMensaje.remove();
        }, 3000);
    }

    imprimirCitas({citas}){

        this.limpiarHTML();

        citas.forEach( cita => {
            const { mascota,propietario,telefono,fecha,hora,sintomas,id} = cita;

            const divCita = document.createElement('div');
            divCita.classList.add('cita', 'p-3');
            divCita.dataset.id = id;

            // scripting elementos de la cita
            const mascotaParrafo = document.createElement('h2');
            mascotaParrafo.classList.add('card-title', 'font-weight-bolder');
            mascotaParrafo.textContent = mascota;

            const propietarioParrafo = document.createElement('p');
            propietarioParrafo.innerHTML = `
            <span class='font-weight-bolder'>Propietario: </span> ${propietario}
            `;

            const telefonoParrafo = document.createElement('p');
            telefonoParrafo.innerHTML = `
            <span class='font-weight-bolder'>Teléfono: </span> ${telefono}
            `;

            const fechaParrafo = document.createElement('p');
            fechaParrafo.innerHTML = `
            <span class='font-weight-bolder'>Fecha: </span> ${fecha}
            `;

            const horaParrafo = document.createElement('p');
            horaParrafo.innerHTML = `
            <span class='font-weight-bolder'>Hora: </span> ${hora}
            `;

            const sintomasParrafo = document.createElement('p');
            sintomasParrafo.innerHTML = `
            <span class='font-weight-bolder'>Síntomas: </span> ${sintomas}
            `;

            // boton para eliminar cita
            const btnEliminar = document.createElement('button');
            btnEliminar.classList.add('btn', 'btn-danger', 'mr-2');
            btnEliminar.innerHTML = `
            Eliminar <svg fill="none" stroke-linecap="round" stroke-linejoin="round" 
            stroke-width="2" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            `;
            btnEliminar.onclick = () => eliminarCita(id);

            // boton editar cita

            const btnEditar = document.createElement('button');
            btnEditar.classList.add('btn', 'btn-info');
            btnEditar.innerHTML=`
            Editar <svg fill="none" stroke-linecap="round" stroke-linejoin="round" 
            stroke-width="2" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
            `;
            btnEditar.onclick = () => editarCita(cita);
            

            // aggregar los parrafos al divCita
            divCita.appendChild(mascotaParrafo);
            divCita.appendChild(propietarioParrafo);
            divCita.appendChild(telefonoParrafo);
            divCita.appendChild(fechaParrafo);
            divCita.appendChild(horaParrafo);
            divCita.appendChild(sintomasParrafo);
            divCita.appendChild(btnEliminar);
            divCita.appendChild(btnEditar);

            // agregar citas al html
            contenedorCitas.appendChild(divCita);
        });
    }

    limpiarHTML(){
        while(contenedorCitas.firstChild){
            contenedorCitas.removeChild(contenedorCitas.firstChild);
        }
    }
}

// instanciar objetos de la clase
const ui =  new UI();
const administrarCitas = new Citas();

// obj info cita
const citaObj = {
    mascota: '',
    propietario : '',
    telefono :'',
    fecha: '',
    hora:'',
    sintomas: ''
}

// add datos a citaObj
function datosCita(e){
    citaObj[e.target.name] = e.target.value;
}

// valida y agrega una nueva cita
function nuevaCita(e){
    e.preventDefault();

    // extraer info de citaObj
    const { mascota,propietario,telefono,fecha,hora,sintomas} = citaObj;
    if( mascota === '' || propietario === '' || telefono === '' || fecha === '' || hora === '' || sintomas === ''){
        ui.imprimirAlerta('Todos los campos son obligatorios', 'error');
        return;
    }
    
    if(editando){
        console.log('Modo Edicion');

        // pasar a editar
        administrarCitas.editarCita({...citaObj});
        
        // mostrar mensaje
        ui.imprimirAlerta('Editado correctamente');
        
        // cambiar texto boton
        formulario.querySelector('button[type="submit"]').textContent = 'Crear Cita';
        
        // quitar modo edicion
        editando = false;

    }else{
       
        // generar id
        citaObj.id = Date.now();

        // creando una nueva cita
        administrarCitas.agregarCitas({...citaObj});

        // mostrar mensaje
        ui.imprimirAlerta('Se agregó correctamente');
    }

    // reset citasObj
    reiniciarObj();

    // form reset
    formulario.reset();

    // mostrar HTML de las citas
    ui.imprimirCitas(administrarCitas);

}

function reiniciarObj(){
    citaObj.mascota = '';
    citaObj.propietario = '';
    citaObj.telefono = '';
    citaObj.fecha = '';
    citaObj.hora ='';
    citaObj.sintomas = '';
}

function eliminarCita(id){
    // eliminar cita
    administrarCitas.eliminarCita(id);

    // show mensaje
    ui.imprimirAlerta('La cita se elimino correctamente');

    // imprimir citas
    ui.imprimirCitas(administrarCitas);
}

// carga datos y modo edicion
function editarCita(cita){
    const { mascota,propietario,telefono,fecha,hora,sintomas,id} = cita;

    // llenar inputs
    mascotaInput.value = mascota;
    propietarioInput.value = propietario;
    telefonoInput.value = telefono;
    fechaInput.value = fecha;
    horaInput.value = hora;
    sintomasInput.value = sintomas;

    // llenar obj
    citaObj.mascota = mascota;
    citaObj.propietario = propietario;
    citaObj.telefono = telefono;
    citaObj.fecha = fecha;
    citaObj.hora = hora;
    citaObj.sintomas = sintomas;
    citaObj.id = id;
    

    // cambiar texto boton
    formulario.querySelector('button[type="submit"]').textContent = 'Guardar Cambios';
    
    editando=true;
}