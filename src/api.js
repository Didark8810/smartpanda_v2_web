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

    async eliminarTema(idTema) {
        try {
            const response = await fetch(`${this.baseUrl}/api/Tema/Eliminar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: idTema,
                    idRemoto: 0,
                    nombre: "",
                    color: "",
                    idUsuario: 0,
                    detalle: "",
                    Token: "",
                    AppName: "",
                    AppVersion: "",
                    AppData: ""
                })
            });

            if (!response.ok) {
                throw new Error('Error al eliminar tema');
            }

            const data = await response.json();
            if (data.respuesta !== 1) {
                throw new Error(data.Mensaje || 'Error en la respuesta del servidor');
            }

            return data.Data;
        } catch (error) {
            console.error('Error:', error);
            throw error;
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

            if (opcion.text === 'Eliminar') {
                a.classList.add('eliminar-tema-btn');
            }

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
        subtemaElement.className = 'list-item d-flex justify-content-between align-items-center';
        subtemaElement.textContent = subtema.nombre;

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

            if (opcion.text === 'Eliminar') {
                a.classList.add('eliminar-subtema-btn');
            }

            li.appendChild(a);
            dropdownMenu.appendChild(li);
        });

        // Agregar evento de eliminación
        dropdownMenu.querySelector('.eliminar-subtema-btn').addEventListener('click', async (e) => {
            e.preventDefault();
            mostrarModalEliminarSubtema(subtema.id);
        });

        dropdown.appendChild(dropdownButton);
        dropdown.appendChild(dropdownMenu);
        subtemaElement.appendChild(dropdown);

        subtemaElement.dataset.id = subtema.id;
        subtemasList.appendChild(subtemaElement);
    });
}

// Función para mostrar modal de confirmación de eliminación de subtema
function mostrarModalEliminarSubtema(idSubtema) {
    const modalHTML = `
        <div class="modal fade" id="confirmarEliminarSubtemaModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Confirmar eliminación</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        ¿Está seguro que desea eliminar este subtema?
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-danger" id="confirmar-eliminar-subtema-btn">Eliminar</button>
                    </div>
                </div>
            </div>
        </div>`;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    const modal = new bootstrap.Modal(document.getElementById('confirmarEliminarSubtemaModal'));
    modal.show();

    document.getElementById('confirmar-eliminar-subtema-btn').addEventListener('click', function () {
        fetch('http://186.64.122.174:8037/api/Subtema/Eliminar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: idSubtema,
                idRemoto: 0,
                idUsuario: 0,
                nombre: "",
                color: "",
                idTema: 0,
                detalle: "",
                Token: "",
                AppName: "",
                AppVersion: "",
                AppData: ""
            })
        })
            .then(response => response.json())
            .then(data => {
                modal.hide();
                document.getElementById('confirmarEliminarSubtemaModal').remove();
                // Actualizar lista de subtemas del tema actual
                const temaSeleccionado = document.querySelector('#temas-list .list-item.active');
                if (temaSeleccionado) {
                    cargarSubtemas(temaSeleccionado.dataset.id);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error al eliminar el subtema');
            });
    });

    // Configurar botón Cancelar
    document.querySelector('#confirmarEliminarSubtemaModal .btn-secondary').addEventListener('click', function () {
        const modal = bootstrap.Modal.getInstance(document.getElementById('confirmarEliminarSubtemaModal'));
        modal.hide();
        document.getElementById('confirmarEliminarSubtemaModal').remove();
    });

    // Eliminar modal al cerrar
    document.getElementById('confirmarEliminarSubtemaModal').addEventListener('hidden.bs.modal', function () {
        this.remove();
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
                notaElement.className = 'list-item d-flex justify-content-between align-items-center';
                notaElement.textContent = nota.titulo;

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

                    if (opcion.text === 'Eliminar') {
                        a.classList.add('eliminar-nota-btn');
                    }

                    li.appendChild(a);
                    dropdownMenu.appendChild(li);
                });

                // Agregar evento de eliminación
                dropdownMenu.querySelector('.eliminar-nota-btn').addEventListener('click', async (e) => {
                    e.preventDefault();
                    mostrarModalEliminarNota(nota.id);
                });

                dropdown.appendChild(dropdownButton);
                dropdown.appendChild(dropdownMenu);
                notaElement.appendChild(dropdown);

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
// Función para mostrar modal de confirmación de eliminación de nota
function mostrarModalEliminarNota(idNota) {
    const modalHTML = `
        <div class="modal fade" id="confirmarEliminarNotaModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Confirmar eliminación</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        ¿Está seguro que desea eliminar esta nota?
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-danger" id="confirmar-eliminar-nota-btn">Eliminar</button>
                    </div>
                </div>
            </div>
        </div>`;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    const modal = new bootstrap.Modal(document.getElementById('confirmarEliminarNotaModal'));
    modal.show();

    document.getElementById('confirmar-eliminar-nota-btn').addEventListener('click', function () {
        fetch('http://186.64.122.174:8037/api/Nota/Eliminar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: idNota,
                idRemoto: 0,
                titulo: "",
                detalle: "",
                ayuda: "",
                fecha: "",
                libre: 0,
                idTema: 0,
                idSubtema: 0,
                idUsuario: 0,
                repaso: 0,
                favorito: 0,
                importancia: 0,
                Token: "",
                AppName: "",
                AppVersion: "",
                AppData: ""
            })
        })
            .then(response => response.json())
            .then(data => {
                modal.hide();
                document.getElementById('confirmarEliminarNotaModal').remove();
                // Actualizar lista de notas del subtema actual
                const subtemaSeleccionado = document.querySelector('#subtemas-list .list-item.active');
                if (subtemaSeleccionado) {
                    cargarNotas(subtemaSeleccionado.dataset.id);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error al eliminar la nota');
            });
    });

    // Configurar botón Cancelar
    document.querySelector('#confirmarEliminarNotaModal .btn-secondary').addEventListener('click', function () {
        const modal = bootstrap.Modal.getInstance(document.getElementById('confirmarEliminarNotaModal'));
        modal.hide();
        document.getElementById('confirmarEliminarNotaModal').remove();
    });

    // Eliminar modal al cerrar
    document.getElementById('confirmarEliminarNotaModal').addEventListener('hidden.bs.modal', function () {
        this.remove();
    });
}

// Exportar para uso en otros archivos
window.apiClient = apiClient;
window.cargarTemas = cargarTemas;
window.cargarSubtemas = cargarSubtemas;
window.cargarNotas = cargarNotas;
window.mostrarModalEliminarNota = mostrarModalEliminarNota;
