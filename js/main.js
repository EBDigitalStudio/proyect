/**
 * ============================================================================
 * PROYECTO: NIDO RURAL - E-COMMERCE ORGÁNICO
 * ARCHIVO: js/main.js
 * ============================================================================
 * 
 * GUÍA DIDÁCTICA PARA ALUMNOS / PRESENTACIÓN:
 * Este archivo implementa toda la interactividad del sitio web:
 * 1. Catálogo dinámico: Arreglo de objetos simulando una base de datos.
 * 2. Formato de Moneda Nacional: Función para formatear precios en Guaraníes (Gs. 25.000).
 * 3. Persistencia con localStorage: Los datos del carrito se guardan en el
 *    navegador del cliente para no perderse al recargar la página.
 * 4. Botones flotantes y sincronización de badges (Header y Botón Flotante).
 * 5. Integración con WhatsApp API: Generación de pedidos con texto formateado
 *    y codificado con `encodeURIComponent()`.
 * ============================================================================
 */

// Esperamos a que el DOM esté completamente cargado antes de ejecutar la lógica
document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. BASE DE DATOS SIMULADA (CATÁLOGO DE PRODUCTOS)
     --------------------------------------------------------------------------
     Un arreglo de objetos. Todos los precios se definen como números enteros
     en moneda local (Guaraníes paraguayos).
     
     CORRECCIÓN DE IMÁGENES:
     - 'Miel Orgánica Pura' cuenta con una imagen coherente de frasco de miel y panal.
     - Se añadió 'Sandía de Cosecha Propia' como producto independiente aprovechando
       la imagen de sandía fresca.
     ========================================================================== */
  const productos = [
    {
      id: 1,
      nombre: 'Huevos de Campo',
      precio: 25000, // Gs. 25.000
      categoria: 'Producción Ganadera',
      etiqueta: 'Pastoreo Libre',
      descripcion: 'Docena de huevos frescos de gallinas libres de jaula, alimentadas con granos naturales y pasturas.',
      imagen: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 2,
      nombre: 'Leche Fresca Entera',
      precio: 12000, // Gs. 12.000
      categoria: 'Lácteos Artesanales',
      etiqueta: '100% Pura',
      descripcion: 'Botella de vidrio de 1L. Leche pasteurizada sin conservantes químicos, directo de tambo pastoril.',
      imagen: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 3,
      nombre: 'Queso Artesanal de Campo',
      precio: 38000, // Gs. 38.000
      categoria: 'Lácteos Artesanales',
      etiqueta: 'Curación Natural',
      descripcion: 'Pieza de queso criollo madurado artesanalmente, con leche pura de vaca y sal marina natural.',
      imagen: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 4,
      nombre: 'Miel Orgánica Pura',
      precio: 35000, // Gs. 35.000
      categoria: 'Apicultura Ecológica',
      etiqueta: 'Cosecha Propia',
      descripcion: 'Frasco de 500g de miel pura de abejas multifloral, libre de jarabes y procesada en frío con su panal.',
      // Imagen auténtica de miel de abejas (corregida)
      imagen: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 5,
      nombre: 'Sandía de Cosecha Propia',
      precio: 20000, // Gs. 20.000
      categoria: 'Frutas de Estación',
      etiqueta: 'Dulce & Jugosa',
      descripcion: 'Sandía entera agroecológica, cosechada en su punto óptimo de maduración natural bajo el sol de campo.',
      // Imagen de sandía fresca de campo
      imagen: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 6,
      nombre: 'Canasta de Verduras',
      precio: 45000, // Gs. 45.000
      categoria: 'Huerta Agroecológica',
      etiqueta: 'Recién Cosechado',
      descripcion: 'Surtido de hortalizas y verduras de temporada (4 kg aprox.), cultivadas sin pesticidas con agua de vertiente.',
      imagen: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?q=80&w=800&auto=format&fit=crop'
    }
  ];

  /* ==========================================================================
     2. GESTIÓN DEL ESTADO Y LOCALSTORAGE
     --------------------------------------------------------------------------
     ¿Qué es localStorage?
     Es una memoria persistente en el navegador web (almacenamiento local)
     que conserva la información incluso si el usuario cierra el navegador
     o recarga la página (F5).
     
     - JSON.stringify(objeto): Convierte estructuras de datos de JS a texto (string).
     - JSON.parse(texto): Convierte texto en formato JSON de vuelta a arreglos u objetos.
     - Operador || []: Si la clave no existe en localStorage (devuelve null),
       asignamos un arreglo vacío [] por defecto para evitar errores.
     ========================================================================== */
  const CLAVE_LOCALSTORAGE = 'nido_rural_carrito';

  /**
   * Obtiene y parsea los productos almacenados en localStorage
   * @returns {Array} Arreglo con los ítems del carrito
   */
  function obtenerCarritoDeLocalStorage() {
    const datosGuardados = localStorage.getItem(CLAVE_LOCALSTORAGE);
    return datosGuardados ? JSON.parse(datosGuardados) : [];
  }

  /**
   * Guarda el estado actual del carrito en localStorage
   */
  function guardarCarritoEnLocalStorage() {
    localStorage.setItem(CLAVE_LOCALSTORAGE, JSON.stringify(carrito));
  }

  // Estado global del carrito en memoria
  let carrito = obtenerCarritoDeLocalStorage();

  /* ==========================================================================
     3. FORMATEO DE MONEDA LOCAL (GUARANÍES - PARAGUAY)
     --------------------------------------------------------------------------
     ¿Cómo funciona?
     En Paraguay la moneda oficial es el Guaraní (Gs.) y utiliza puntos (.)
     para la separación de miles (ej. Gs. 25.000).
     
     `Number(valor).toLocaleString('es-PY')` utiliza la API internacional nativa
     de JavaScript (Intl) aplicando las reglas numéricas oficiales de Paraguay.
     ========================================================================== */
  function formatearGuaranies(valor) {
    const numeroFormateado = Number(valor).toLocaleString('es-PY', {
      maximumFractionDigits: 0
    });
    return `Gs. ${numeroFormateado}`;
  }

  /* ==========================================================================
     4. REFERENCIAS AL DOM (SELECTORES)
     ========================================================================== */
  // Contenedor de la cuadrícula de productos en el catálogo
  const contenedorGrid = document.querySelector('#productos-contenedor .grid');

  // Botón y contador en el Header
  const btnAbrirCarritoHeader = document.getElementById('btn-carrito');
  const contadorCarritoHeader = document.getElementById('contador-carrito');

  // Botón y badge en el Botón Flotante (FAB)
  const btnCarritoFlotante = document.getElementById('btn-carrito-flotante');
  const contadorCarritoFlotante = document.getElementById('contador-carrito-flotante');

  // Modal / Drawer lateral del Carrito
  const modalCarrito = document.getElementById('modal-carrito');
  const backdropCarrito = document.getElementById('carrito-backdrop');
  const btnCerrarCarrito = document.getElementById('cerrar-carrito');
  const listaCarrito = document.getElementById('carrito-items');
  const totalCarritoTexto = document.getElementById('carrito-total');
  const btnConfirmarPedido = document.getElementById('btn-confirmar-pedido');

  /* ==========================================================================
     5. RENDERIZADO DEL CATÁLOGO DE PRODUCTOS
     --------------------------------------------------------------------------
     Recorre el arreglo 'productos' y crea dinámicamente las tarjetas en el DOM.
     ========================================================================== */
  function renderizarProductos() {
    if (!contenedorGrid) return;

    // Limpiamos contenido previo para evitar duplicados
    contenedorGrid.innerHTML = '';

    productos.forEach(producto => {
      const tarjeta = document.createElement('article');
      tarjeta.className = 'bg-white rounded-2xl border border-stone-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group';

      tarjeta.innerHTML = `
        <!-- Imagen del producto con badge de calidad -->
        <div class="relative h-56 w-full overflow-hidden bg-stone-100">
          <img 
            src="${producto.imagen}" 
            alt="${producto.nombre}" 
            loading="lazy"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onerror="this.onerror=null; this.src='img/favicon.svg';"
          >
          <span class="absolute top-3 left-3 bg-amarillo-sol text-verde-oscuro text-xs font-bold px-3 py-1 rounded-full shadow-sm">
            ${producto.etiqueta}
          </span>
        </div>

        <!-- Contenido descriptivo -->
        <div class="p-6 flex-grow flex flex-col justify-between">
          <div>
            <span class="text-xs uppercase tracking-wider font-semibold text-verde-claro">${producto.categoria}</span>
            <h3 class="font-display font-bold text-xl text-stone-900 mt-1">${producto.nombre}</h3>
            <p class="text-sm text-stone-600 mt-2 line-clamp-2">
              ${producto.descripcion}
            </p>
          </div>

          <!-- Precio y botón de agregar -->
          <div class="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between">
            <div>
              <span class="text-xs text-stone-500 block">Precio por unidad</span>
              <span class="text-xl sm:text-2xl font-bold text-verde-oscuro">${formatearGuaranies(producto.precio)}</span>
            </div>
            
            <!-- Botón Agregar al Carrito (almacena el ID del producto en data-id) -->
            <button 
              type="button"
              class="btn-agregar-carrito inline-flex items-center gap-1.5 bg-verde-oscuro hover:bg-verde-claro text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm hover:shadow transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-verde-claro active:scale-95"
              data-id="${producto.id}"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              <span>Agregar</span>
            </button>
          </div>
        </div>
      `;

      contenedorGrid.appendChild(tarjeta);
    });
  }

  /* ==========================================================================
     6. LÓGICA DE NEGOCIO DEL CARRITO
     --------------------------------------------------------------------------
     Funciones para manipular el arreglo: agregar, sumar, restar, eliminar, vaciar.
     ========================================================================== */

  /**
   * Agrega un producto al carrito o incrementa su cantidad si ya existe.
   * @param {number} idProducto - ID único del producto
   */
  function agregarAlCarrito(idProducto) {
    const productoOriginal = productos.find(p => p.id === idProducto);
    if (!productoOriginal) return;

    // Buscamos si ya se encuentra en el carrito
    const itemExistente = carrito.find(item => item.id === idProducto);

    if (itemExistente) {
      itemExistente.cantidad += 1;
    } else {
      carrito.push({
        id: productoOriginal.id,
        nombre: productoOriginal.nombre,
        precio: productoOriginal.precio,
        imagen: productoOriginal.imagen,
        cantidad: 1
      });
    }

    // Persistir y refrescar la pantalla
    guardarCarritoEnLocalStorage();
    actualizarInterfazCarrito();

    // Feedback visual animado en los botones de carrito
    animarBotonCarrito(btnAbrirCarritoHeader);
    animarBotonCarrito(btnCarritoFlotante);
  }

  /**
   * Modifica la cantidad de un ítem (+1 o -1).
   * Si la cantidad llega a 0, se elimina automáticamente.
   * @param {number} idProducto 
   * @param {number} delta 
   */
  function modificarCantidad(idProducto, delta) {
    const item = carrito.find(p => p.id === idProducto);
    if (!item) return;

    item.cantidad += delta;

    if (item.cantidad <= 0) {
      eliminarDelCarrito(idProducto);
      return;
    }

    guardarCarritoEnLocalStorage();
    actualizarInterfazCarrito();
  }

  /**
   * Elimina un producto por completo del carrito
   * @param {number} idProducto 
   */
  function eliminarDelCarrito(idProducto) {
    carrito = carrito.filter(item => item.id !== idProducto);
    guardarCarritoEnLocalStorage();
    actualizarInterfazCarrito();
  }

  /**
   * Vacía totalmente el carrito y limpia el localStorage
   */
  function vaciarCarrito() {
    carrito = [];
    guardarCarritoEnLocalStorage();
    actualizarInterfazCarrito();
  }

  /**
   * Suma el subtotal de todos los productos (precio * cantidad)
   * @returns {number} Monto total en Guaraníes
   */
  function calcularTotalCarrito() {
    return carrito.reduce((acumulado, item) => acumulado + (item.precio * item.cantidad), 0);
  }

  /**
   * Cuenta la cantidad total de unidades en el carrito
   * @returns {number} Cantidad de productos
   */
  function calcularTotalUnidades() {
    return carrito.reduce((acumulado, item) => acumulado + item.cantidad, 0);
  }

  /**
   * Aplica un sutil efecto de escala para feedback al agregar productos
   */
  function animarBotonCarrito(elemento) {
    if (!elemento) return;
    elemento.classList.add('scale-110');
    setTimeout(() => elemento.classList.remove('scale-110'), 200);
  }

  /* ==========================================================================
     7. ACTUALIZACIÓN DE LA INTERFAZ DEL CARRITO (UI)
     --------------------------------------------------------------------------
     Sincroniza:
     - Badge del Header (#contador-carrito)
     - Badge del Botón Flotante (#contador-carrito-flotante)
     - Total en Guaraníes (#carrito-total)
     - Lista de productos en el modal lateral (#carrito-items)
     ========================================================================== */
  function actualizarInterfazCarrito() {
    const totalUnidades = calcularTotalUnidades();

    // 1. Sincronización del contador en el Header
    if (contadorCarritoHeader) {
      contadorCarritoHeader.textContent = totalUnidades;
    }

    // 2. Sincronización del badge en el Botón Flotante
    if (contadorCarritoFlotante) {
      contadorCarritoFlotante.textContent = totalUnidades;
    }

    // 3. Actualización del total general en Guaraníes
    const totalPagar = calcularTotalCarrito();
    if (totalCarritoTexto) {
      totalCarritoTexto.textContent = formatearGuaranies(totalPagar);
    }

    // 4. Renderizado del listado de ítems dentro del modal lateral
    if (!listaCarrito) return;

    if (carrito.length === 0) {
      // Estado cuando no hay productos
      listaCarrito.innerHTML = `
        <div id="carrito-vacio" class="h-full flex flex-col items-center justify-center text-center py-12 text-stone-500">
          <svg class="w-16 h-16 text-stone-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <p class="font-medium text-stone-700">Tu carrito aún está vacío</p>
          <p class="text-xs text-stone-500 mt-1 max-w-xs">Agrega productos frescos de nuestro catálogo para comenzar tu pedido.</p>
        </div>
      `;
      return;
    }

    // Estado con productos agregados
    listaCarrito.innerHTML = '';
    carrito.forEach(item => {
      const subtotalItem = item.precio * item.cantidad;

      const filaProducto = document.createElement('div');
      filaProducto.className = 'py-4 flex items-center gap-4';

      filaProducto.innerHTML = `
        <!-- Miniatura de imagen -->
        <img 
          src="${item.imagen}" 
          alt="${item.nombre}" 
          class="w-16 h-16 object-cover rounded-xl border border-stone-200 flex-shrink-0"
          onerror="this.onerror=null; this.src='img/favicon.svg';"
        >

        <!-- Información del producto -->
        <div class="flex-1 min-w-0">
          <h4 class="font-medium text-stone-900 text-sm truncate">${item.nombre}</h4>
          <p class="text-xs text-stone-500 mt-0.5">Unitario: ${formatearGuaranies(item.precio)}</p>
          
          <!-- Controles de cantidad (+ / -) -->
          <div class="flex items-center gap-2 mt-2">
            <button 
              type="button" 
              class="btn-restar-cantidad w-6 h-6 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center text-xs font-bold transition focus:outline-none"
              data-id="${item.id}"
              aria-label="Restar una unidad"
            >-</button>

            <span class="text-xs font-semibold text-stone-800 min-w-[1.25rem] text-center">
              ${item.cantidad}
            </span>

            <button 
              type="button" 
              class="btn-sumar-cantidad w-6 h-6 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center text-xs font-bold transition focus:outline-none"
              data-id="${item.id}"
              aria-label="Sumar una unidad"
            >+</button>
          </div>
        </div>

        <!-- Subtotal y botón de eliminar -->
        <div class="flex flex-col items-end justify-between self-stretch">
          <button 
            type="button" 
            class="btn-eliminar-item text-stone-400 hover:text-red-500 p-1 transition focus:outline-none"
            data-id="${item.id}"
            title="Eliminar producto"
            aria-label="Eliminar producto del carrito"
          >
            <svg class="w-4 h-4 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>

          <span class="text-sm font-bold text-verde-oscuro">
            ${formatearGuaranies(subtotalItem)}
          </span>
        </div>
      `;

      listaCarrito.appendChild(filaProducto);
    });
  }

  /* ==========================================================================
     8. CONTROL DEL MODAL (ABRIR / CERRAR)
     ========================================================================== */
  function abrirCarrito() {
    if (modalCarrito) {
      modalCarrito.classList.remove('hidden');
      document.body.classList.add('overflow-hidden');
    }
  }

  function cerrarCarrito() {
    if (modalCarrito) {
      modalCarrito.classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
    }
  }

  /* ==========================================================================
     9. INTEGRACIÓN CON WHATSAPP (CHECKOUT)
     --------------------------------------------------------------------------
     ¿Cómo funciona la API 'wa.me' de WhatsApp?
     WhatsApp permite enviar un mensaje predeterminado a un número de teléfono
     mediante la URL:
     https://wa.me/<NUMERO>?text=<MENSAJE>

     Paraguay:
     - Código de país: 595
     - Número local: 0991211207 (se retira el 0 inicial en formato internacional: 595991211207).

     ¿Por qué es indispensable encodeURIComponent()?
     Las URLs no permiten caracteres como espacios, tildes, saltos de línea (\n)
     ni asteriscos (*). `encodeURIComponent()` convierte:
     - Saltos de línea (\n) -> %0A
     - Espacios -> %20
     - Puntuación especial en sus equivalentes percent-encoding.
     Esto asegura que en el chat de WhatsApp se visualicen las viñetas y el texto
     ordenado y en negrita.
     ========================================================================== */
  function enviarPedidoWhatsApp() {
    // 1. Validar que el carrito no esté vacío
    if (carrito.length === 0) {
      alert('Tu carrito está vacío. Agrega productos orgánicos antes de confirmar tu pedido.');
      return;
    }

    // 2. Encabezado del mensaje
    let mensaje = '¡Hola Nido Rural! Quiero realizar el siguiente pedido:\n\n';

    // 3. Iteración sobre cada producto detallando Nombre, Cantidad, Costo individual y Subtotal
    carrito.forEach((item, indice) => {
      const subtotalItem = item.precio * item.cantidad;
      mensaje += `${indice + 1}. *${item.nombre}*\n`;
      mensaje += `   • Cantidad: ${item.cantidad}\n`;
      mensaje += `   • Costo individual: ${formatearGuaranies(item.precio)}\n`;
      mensaje += `   • Subtotal: ${formatearGuaranies(subtotalItem)}\n\n`;
    });

    // 4. Resumen final con el costo total en Guaraníes
    const totalFinal = calcularTotalCarrito();
    mensaje += '------------------------------------\n';
    mensaje += `*Total a pagar: ${formatearGuaranies(totalFinal)}*\n`;
    mensaje += '------------------------------------\n\n';
    mensaje += '¡Quedo a la espera de su confirmación para coordinar la entrega! Muchas gracias.';

    // 5. Codificación de caracteres para la URL
    const mensajeCodificado = encodeURIComponent(mensaje);

    // 6. Número oficial de destino (595 991 211207)
    const numeroWhatsApp = '595991211207';
    const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensajeCodificado}`;

    // 7. Abrir WhatsApp en una pestaña nueva
    window.open(urlWhatsApp, '_blank');

    // 8. Limpiar el carrito y el localStorage tras confirmar, y cerrar el modal
    vaciarCarrito();
    cerrarCarrito();
  }

  /* ==========================================================================
     10. ASIGNACIÓN DE EVENTOS (EVENT LISTENERS)
     ========================================================================== */

  // A) Abrir carrito desde el botón del Header
  if (btnAbrirCarritoHeader) {
    btnAbrirCarritoHeader.addEventListener('click', abrirCarrito);
  }

  // B) Abrir carrito desde el Botón Flotante
  if (btnCarritoFlotante) {
    btnCarritoFlotante.addEventListener('click', abrirCarrito);
  }

  // C) Cerrar carrito (botón 'X', clic en backdrop o tecla Escape)
  if (btnCerrarCarrito) {
    btnCerrarCarrito.addEventListener('click', cerrarCarrito);
  }
  if (backdropCarrito) {
    backdropCarrito.addEventListener('click', cerrarCarrito);
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalCarrito && !modalCarrito.classList.contains('hidden')) {
      cerrarCarrito();
    }
  });

  // D) Delegación de eventos para agregar productos desde el catálogo
  if (contenedorGrid) {
    contenedorGrid.addEventListener('click', (e) => {
      const botonAgregar = e.target.closest('.btn-agregar-carrito');
      if (botonAgregar) {
        const idProducto = parseInt(botonAgregar.dataset.id, 10);
        agregarAlCarrito(idProducto);
      }
    });
  }

  // E) Delegación de eventos dentro del modal (+, -, eliminar)
  if (listaCarrito) {
    listaCarrito.addEventListener('click', (e) => {
      // Sumar cantidad (+)
      const botonSumar = e.target.closest('.btn-sumar-cantidad');
      if (botonSumar) {
        const id = parseInt(botonSumar.dataset.id, 10);
        modificarCantidad(id, 1);
        return;
      }

      // Restar cantidad (-)
      const botonRestar = e.target.closest('.btn-restar-cantidad');
      if (botonRestar) {
        const id = parseInt(botonRestar.dataset.id, 10);
        modificarCantidad(id, -1);
        return;
      }

      // Eliminar producto
      const botonEliminar = e.target.closest('.btn-eliminar-item');
      if (botonEliminar) {
        const id = parseInt(botonEliminar.dataset.id, 10);
        eliminarDelCarrito(id);
        return;
      }
    });
  }

  // F) Evento para confirmar pedido por WhatsApp
  if (btnConfirmarPedido) {
    btnConfirmarPedido.addEventListener('click', enviarPedidoWhatsApp);
  }

  /* ==========================================================================
     11. INICIALIZACIÓN DE LA APLICACIÓN
     ========================================================================== */
  renderizarProductos();       // Carga las tarjetas en la grilla del catálogo
  actualizarInterfazCarrito();  // Recupera ítems de localStorage y sincroniza badges

  console.log('🌾 Nido Rural cargado: Moneda Guaraníes configurada y badges sincronizados.');
});
