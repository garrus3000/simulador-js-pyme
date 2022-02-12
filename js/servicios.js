let dolar;
let upd;

function getDolar() {
    $.ajax({
        type: "GET",
        url: "https://api.bluelytics.com.ar/v2/latest",
        dataType: "json",
        success: (data) => {
            (dolar = parseInt(data.oficial.value_avg)),
            (upd = data.last_update),
            //precio por servicio
            $("#precioP1").val(dolar * 15);
            $("#precioP2").val(dolar * 30);
            $("#precioP3").val(dolar * 35);
            //status
            $("#upd").children("span").text(upd.split("T", 1));
            $("#dolar").text(dolar);
            //btn Calcular habilitado
            $("#calcular").removeAttr("disabled", "disabled");
        },
        error: () => {
            //creo msj y btn Error dentro de menu eleccion servicios
            $("#calcular").text("Error data");
            $("#errorMsj").html(`<div class="container-fluid">
            <p class="fs-4 text-end">Error en datos dolar</p>
            <div type="button" class="my-container btn btn-danger fs-5 fw-bold" onclick="btnError()">Recargar</div>
        </div>`);
        },
    });
}

function btnError() {
    localStorage.clear();
    location.reload();
}

const crearDivSelectores = `<form>
<div class="my-tarjeta my-tarjeta__titulo" id="errorMsj">
<h4> Elegí tu Aventura</h4>
<select id="paquetes" class="text-black m-2">
<option value="0" disabled selected>Elige un servicio</option>
<option id="precioP1" value="">Paquete básico &#128675 Usd$15</></option>
<option id="precioP2" value="">Paquete completo &#128010 Usd$30</option>
<option id="precioP3" value="">Paquete Ranger &#128170 Usd$35</option>
</select>
<h4 class="mt-3">Somos un grupo</h4>
<select id="cantidad" class="text-black m-2">
<option value="0" disabled selected>Elige una cantidad</option>
<option value="1">1 Persona</option>
<option value="2">2 Personas</option>
<option value="4">4 Personas </option>
<option value="8">8 Personas</option>
</select>
<button type="button" id="calcular" data-id="errorBtn" class="btn btn-outline-primary 
m-3" disabled="disabled">Calcular</button>
<p  class="fs-5 text-primary text-opacity-75 
text-start ps-4">Precio final AR$ <span id="resultado">0</span>
</p>
</form>
<div>
    <p>Nuestros precios son calculados por el dolar oficial sin impuestos</p>
    <p id="upd" class="fw-light">Dolar actualizado...<br>
        <span>Calculando...</span>
        <div class="fs-6 text-black fw-light">Dolar oficial $ <span id="dolar">Calculando...</span> </div>
    </p>
</div>`;

const crearFormularioCompra = `<form>
<div class="form-group">
<label for="nombreCompleto" class="text-black fs-6">Introduzca su nombre completo</label>
<input type="text" class="form-control mb-3 mt-3" placeholder="ej:     Juan Perez" id="nombreCompleto" required>
</div>
<div class="form-group">
<label for="email" class="text-black fs-6">Introduzca un email valido</label>
<input type="email" class="form-control" placeholder="ej:     jaime@gmail.com" id="email" required>
</div>
<div class="form-check form-switch pt-3">
<input type="checkbox" class="form-check-input" role="switch" id="checked" >
<label class="form-check-label mb-2 text-black fs-6">Confirmar pedido</label>
</div>
</form>`;

const DIVcrearFormularioCompra = `<div class="my-tarjeta my-tarjeta__titulo">
<h3> Gracias por elegirnos &#128075; </h3>
<div id="form_compra"> ${crearFormularioCompra} </div>
<p id="faltanDatos" style="display: none;" class="fs-4 text-danger">FALTAN DATOS<p> 
<div>
    <div type="button" id="confirmar-pedido"
    class="btn btn-success fw-bold m-2">Aceptar</div>
    <div type="button" id="cancelar-pedido"
    class="btn btn-danger fw-bold m-2">Cancelar</div>
    </div>
</div>`;

function elegirServicio() {
    const menu_servicios = document.createElement("div");
    menu_servicios.classList.add("my-container");
    app.appendChild(menu_servicios);
    //creo div hijo sub de app y selectores
    let opcion_servicio = document.createElement("div");
    opcion_servicio.classList.add("my-container");
    opcion_servicio.innerHTML = crearDivSelectores;
    menu_servicios.appendChild(opcion_servicio);
    //div esqueleto de form con btn y formulario
    const menu_post_compras = document.createElement("div");
    menu_post_compras.classList = "my-container";
    menu_post_compras.innerHTML = DIVcrearFormularioCompra;
    $(app).append(menu_post_compras).hide().slideDown(2000);

    //btn cancela pedido
    const btn_cancel_compra = document.getElementById("cancelar-pedido");
    btn_cancel_compra.addEventListener("click", () => {
        localStorage.removeItem("nombre_usuario");
        localStorage.removeItem("email");
        localStorage.removeItem("nombreCompleto");
        location.reload();
    });

    //btn confirma pedido
    const btn_conf_compra = document.getElementById("confirmar-pedido");
    btn_conf_compra.addEventListener("click", function btnAceptar() {
        let nombreCompleto = document.getElementById("nombreCompleto").value;
        guardarStorage("nombreCompleto", nombreCompleto);
        let email = document.getElementById("email").value;
        let checkbox = document.getElementById("checked").checked;
        guardarStorage("email", email);
        let regex = new RegExp("[a-z0-9]+@[a-z]+.[a-z]{2,3}");
        if (
            nombreCompleto !== "" &&
            checkbox === true &&
            email &&
            regex.test(email)
            && (recuperarStorage("precioFinal")) ) {
                pedidoConfirmado();
                this.removeEventListener("click", btnAceptar);
        } else {
            faltanDatos();
        }
    });
    servElegido();
}

//else btnAceptar
function faltanDatos() {
    $("#faltanDatos")
        .slideDown(300)
        .delay(300)
        .fadeOut(300)
        .fadeIn(300)
        .fadeOut(300, () => {
            $("#faltanDatos").fadeIn(300).delay(300).slideUp(300);
        });
}

//selectores y btn Calcular
function servElegido() {
    let btn_opciones = document.getElementById("calcular");
    btn_opciones.addEventListener("click", () => {
        let op1 = document.getElementById("paquetes");
        let precio = parseInt(op1.options[op1.selectedIndex].value);
        let op2 = document.getElementById("cantidad");
        let cantidad = parseInt(op2.options[op2.selectedIndex].value);
        let total = `${precio * cantidad}`;
        document.getElementById("resultado").innerText = total;
        if ( total != 0) {
            guardarStorage("precioFinal", total);
        }
    });
}

// es arrow function pq llama a recuperarStorage()
const CarritoBoxMensaje = () => `<div class="my-tarjeta ">
<h3>¡Gracias ${recuperarStorage("nombre_usuario").toUpperCase()} ! &#129303</h3>
<p class="fs-6 text-secondary pt-1 mb-0">${recuperarStorage(
    "nombreCompleto"
).toUpperCase()}</p>
<p class="fs-5 text-center text-primary">Su pedido fué procesado </p>
<img class=" my-tarjeta rounded bg-black bg-opacity-75 m-1"
src="./multimedia/logo-empresa-blanco.png" id="imagenForm">
<p class="fs-5 fw-normal mt-2">Su total es de AR$${parseInt( recuperarStorage("precioFinal"))} </p>
<p>Factura y detalles enviados: <br><span class="fs-6"
>${recuperarStorage("email")}</span></p>
<p class="fs-6 fw-normal text-center text-decoration-underline m-2">Recuerde revisar su email</p>
<div id="borrar_datos" type="button"
class="btn btn-warning fw-bold m-2" required>Aceptar</div>
</div>`;

//if btnAceptar
function pedidoConfirmado() {
    let carritoContainer = document.getElementById("pedidoConfirmado");
    let carritoBox = document.createElement("div");
    carritoBox.classList.add("my-container", "titulo-parrafo");
    carritoBox.innerHTML = CarritoBoxMensaje();
    //guardo varible para function checkPedidoStorage
    let pedidoAnterior = true;
    guardarStorage("pedidoAnterior", pedidoAnterior);
    //oculto selectores y formulario
    $("#app").children().parent().slideUp(1900);
    //muestro pedido confirmado
    $(carritoContainer)
        .append(carritoBox)
        .hide()
        .slideDown(1500, () => {
            centerThis = document
                .getElementById("servicios")
                .scrollIntoView({ block: "center", behavior: "smooth" });
        });
    //btn borra los datos, menos theme y refresh
    $("#borrar_datos").click(() => {
        localStorage.removeItem("nombre_usuario");
        localStorage.removeItem("nombreCompleto");
        localStorage.removeItem("email");
        localStorage.removeItem("pedidoAnterior");
        localStorage.removeItem("precioFinal");
        location.reload();
    });
}
