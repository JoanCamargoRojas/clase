const TASA_CAMBIO_USD_COP = 3900; 

const FORMATO_COP = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
});

const DESCRIPCIONES_PERSONALIZADAS = {
    1: "Una increíble chaqueta para todo clima, perfecta para la aventura.",
    2: "El mejor gadget para organizar tus días y mantenerte al tanto de todo.",
    3: "Una joya que irradia elegancia y sofisticación, ideal para cualquier evento.",
    4: "La compañera perfecta para la oficina o la universidad. Amplia y resistente.",
};

const carrito = {
    items: [],

    agregarItem(producto) {
        const itemExistente = this.items.find(item => item.id === producto.id);

        if (itemExistente) {
            itemExistente.cantidad++;
        } else {
            const descripcion = DESCRIPCIONES_PERSONALIZADAS[producto.id] || producto.description;

            this.items.push({
                ...producto, 
                cantidad: 1,
                descripcionPersonalizada: descripcion 
            });
        }
        console.log("Producto agregado:", producto.title);
    },

    calcularTotal() {
        const totalUSD = this.items.reduce((total, item) => {
            return total + (item.price * item.cantidad);
        }, 0);
        
        return totalUSD * TASA_CAMBIO_USD_COP; 
    },

    renderizarCarrito() {
        const ul = document.getElementById('carrito-items');
        const totalSpan = document.getElementById('carrito-total');
        
        ul.innerHTML = '';

        this.items.forEach(item => {
            const precioCOP = item.price * TASA_CAMBIO_USD_COP;
            const subtotalCOP = precioCOP * item.cantidad;

            const li = document.createElement('li');
            li.className = 'carrito-item';
            li.innerHTML = `
                ${item.title} (${item.cantidad}x) - ${FORMATO_COP.format(subtotalCOP)}
            `;
            ul.appendChild(li);
        });

        totalSpan.textContent = FORMATO_COP.format(this.calcularTotal());
    }
};

async function cargarProductos() {
    const catalogo = document.getElementById('catalogo-productos');
    const contenedorTarjetas = document.createElement('div'); 
    catalogo.appendChild(contenedorTarjetas);

    try {
        const response = await fetch('https://fakestoreapi.com/products');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const productos = await response.json();

        productos.forEach(producto => {
            const card = document.createElement('div');
            card.className = 'producto-card';

            const precioCOP = producto.price * TASA_CAMBIO_USD_COP;
            const precioFormateado = FORMATO_COP.format(precioCOP);
            
            const descripcion = DESCRIPCIONES_PERSONALIZADAS[producto.id] || producto.description;

            card.innerHTML = `
                <img src="${producto.image}" alt="${producto.title}">
                <h3>${producto.title}</h3>
                <p><strong>${precioFormateado}</strong></p>
                <p class="desc">${descripcion.substring(0, 80)}...</p>
                <button class="add-btn" data-id="${producto.id}">Añadir al carrito</button>
            `;
            
            const boton = card.querySelector('.add-btn');
            boton.addEventListener('click', () => {
                carrito.agregarItem(producto); 
                carrito.renderizarCarrito();
            });

            contenedorTarjetas.appendChild(card);
        });

    } catch (error) {
        catalogo.innerHTML = `<p style="color:red;">Error al cargar productos: ${error.message}</p>`;
        console.error("Error al cargar productos:", error);
    }
}

const loginModal = document.getElementById('login-modal');
const btnLogin = document.getElementById('btn-login');
const closeModal = document.getElementById('close-modal');
const submitLogin = document.getElementById('submit-login');
const inputUsername = document.getElementById('input-username');
const inputPassword = document.getElementById('input-password');
const loginMessage = document.getElementById('login-message');
const mainContent = document.getElementById('main-content');
const userInfo = document.getElementById('user-info');
const usernameDisplay = document.getElementById('username-display');

btnLogin.addEventListener('click', () => {
    loginModal.style.display = 'block';
});

closeModal.addEventListener('click', () => {
    loginModal.style.display = 'none';
    loginMessage.textContent = '';
});

submitLogin.addEventListener('click', async () => {
    const username = inputUsername.value.trim();
    const password = inputPassword.value.trim();

    if (!username || !password) {
        loginMessage.textContent = "Por favor, ingresa usuario y contraseña.";
        return;
    }

    loginMessage.textContent = "Iniciando sesión...";

    try {
        const response = await fetch('https://fakestoreapi.com/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username, 
                password: password  
            })
        });

        if (!response.ok) {
            throw new Error('Credenciales incorrectas. Intenta con usuario: mor_2314 y contraseña: 83r5^_');
        }

        const data = await response.json();
        
        localStorage.setItem('userToken', data.token); 
        localStorage.setItem('username', username);

        loginModal.style.display = 'none';
        mainContent.style.display = 'flex';
        btnLogin.style.display = 'none';
        userInfo.style.display = 'block';
        usernameDisplay.textContent = username;
        loginMessage.textContent = '';

        cargarProductos();

    } catch (error) {
        loginMessage.textContent = `Error de inicio de sesión: ${error.message}`;
        console.error("Error en login:", error);
    }
});

document.addEventListener('DOMContentLoaded', () => {
});