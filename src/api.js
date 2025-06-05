class ApiClient {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    async obtenerTemas() {
        try {
            const response = await fetch(`${this.baseUrl}/api/Tema/Obtener_por_idUsuario`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    Valor: 1,
                    Parametro: "string",
                    token1: "string",
                    Token: "string",
                    AppName: "string",
                    AppVersion: "string",
                    AppData: "string"
                })
            });

            if (!response.ok) {
                throw new Error('Error al obtener temas');
            }

            const data = await response.json();
            if (data.respuesta !== 1) {
                throw new Error(data.Mensaje || 'Error en la respuesta del servidor');
            }

            return data.Data;
        } catch (error) {
            console.error('Error:', error);
            return [];
        }
    }

    async obtenerSubtemas(idTema) {
        try {
            const response = await fetch(`${this.baseUrl}/api/Subtema/Obtener_por_idTema`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    Valor: idTema,
                    Parametro: "string",
                    token1: "string",
                    Token: "string",
                    AppName: "string",
                    AppVersion: "string",
                    AppData: "string"
                })
            });

            if (!response.ok) {
                throw new Error('Error al obtener subtemas');
            }

            const data = await response.json();
            if (data.respuesta !== 1) {
                throw new Error(data.Mensaje || 'Error en la respuesta del servidor');
            }

            return data.Data;
        } catch (error) {
            console.error('Error:', error);
            return [];
        }
    }

    async obtenerNotas(idSubtema) {
        try {
            const response = await fetch(`${this.baseUrl}/api/Nota/Obtener_por_idSubtema`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    Valor: idSubtema,
                    Parametro: "string",
                    token1: "string",
                    Token: "string",
                    AppName: "string",
                    AppVersion: "string",
                    AppData: "string"
                })
            });

            if (!response.ok) {
                throw new Error('Error al obtener notas');
            }

            const data = await response.json();
            if (data.respuesta !== 1) {
                throw new Error(data.Mensaje || 'Error en la respuesta del servidor');
            }

            return data.Data;
        } catch (error) {
            console.error('Error:', error);
            return [];
        }
    }
}

// Configuración inicial
const apiClient = new ApiClient('http://186.64.122.174:8037');

// Función para cargar y mostrar temas
async function cargarTemas() {
    const temasList = document.getElementById('temas-list');
    temasList.innerHTML = '<div class="text-center py-3">Cargando temas...</div>';

    const temas = await apiClient.obtenerTemas();
    temasList.innerHTML = '';

    temas.forEach(tema => {
        const temaElement = document.createElement('div');
        temaElement.className = 'list-item d-flex justify-content-between align-items-center';
        temaElement.textContent = tema.nombre;

        // Agregar menú de tres puntos
        const dropdown = document.createElement('div');
        dropdown.className = 'dropdown';

        const dropdownButton = document.createElement('button');
        dropdownButton.className = 'btn btn-sm btn-link text-secondary';
        dropdownButton.type = 'button';
        dropdownButton.setAttribute('data-bs-toggle', 'dropdown');

        const dotsIcon = document.createElement('i');
        dotsIcon.className = 'bi bi-three-dots-vertical';
        dropdownButton.appendChild(dotsIcon);

        const dropdownMenu = document.createElement('ul');
        dropdownMenu.className = 'dropdown-menu';

        // Opciones del menú
        const opciones = [
            { icon: 'bi-pencil', text: 'Editar' },
            { icon: 'bi-trash', text: 'Eliminar' },
            { icon: 'bi-share', text: 'Compartir' },
            { icon: 'bi-arrow-right-circle', text: 'Mover' },
            { icon: 'bi-files', text: 'Duplicar' }
        ];

        opciones.forEach(opcion => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.className = 'dropdown-item';
            a.href = '#';

            const opcionIcon = document.createElement('i');
            opcionIcon.className = `${opcion.icon} me-2`;
            a.appendChild(opcionIcon);
            a.appendChild(document.createTextNode(opcion.text));

            li.appendChild(a);
            dropdownMenu.appendChild(li);
        });

        dropdown.appendChild(dropdownButton);
        dropdown.appendChild(dropdownMenu);
        temaElement.appendChild(dropdown);

        temaElement.dataset.id = tema.id;
        temasList.appendChild(temaElement);
    });
}

// Función para cargar y mostrar subtemas
async function cargarSubtemas(idTema) {
    const subtemasList = document.getElementById('subtemas-list');
    subtemasList.innerHTML = '<div class="text-center py-3">Cargando subtemas...</div>';

    const subtemas = await apiClient.obtenerSubtemas(idTema);
    subtemasList.innerHTML = '';

    subtemas.forEach(subtema => {
        const subtemaElement = document.createElement('div');
        subtemaElement.className = 'list-item';
        subtemaElement.textContent = subtema.nombre;
        subtemaElement.dataset.id = subtema.id;
        subtemasList.appendChild(subtemaElement);
    });
}

// Función para cargar y mostrar notas
async function cargarNotas(idSubtema) {
    const notasList = document.getElementById('notas-list');
    notasList.innerHTML = '<div class="text-center py-3">Cargando notas...</div>';

    try {
        const notas = await apiClient.obtenerNotas(idSubtema);
        window.notas = notas || []; // Guardar notas en variable global
        notasList.innerHTML = '';

        if (notas && notas.length > 0) {
            notas.forEach(nota => {
                const notaElement = document.createElement('div');
                notaElement.className = 'list-item';
                notaElement.textContent = nota.titulo;
                notaElement.dataset.id = nota.id;
                notasList.appendChild(notaElement);
            });
        } else {
            notasList.innerHTML = '<div class="text-center py-3 text-muted">No hay notas disponibles</div>';
        }
    } catch (error) {
        console.error('Error al cargar notas:', error);
        notasList.innerHTML = '<div class="text-center py-3 text-danger">Error al cargar notas</div>';
    }
}

// Exportar para uso en otros archivos
window.apiClient = apiClient;
window.cargarTemas = cargarTemas;
window.cargarSubtemas = cargarSubtemas;
window.cargarNotas = cargarNotas;
