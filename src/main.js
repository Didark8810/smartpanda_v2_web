// Configurar usuario y botón de salir
const userData = JSON.parse(localStorage.getItem('userData')) || { nombre: 'Invitado' };
document.getElementById('user-info').innerHTML = `
            <i class="bi bi-person-circle me-2"></i>
            <span>Usuario: ${userData.nombre || userData.login || 'Invitado'}</span>
        `;

// Configurar botón de salir con confirmación
function setupLogoutButton() {
    const logoutBtn = document.getElementById('logout-btn');
    if (!logoutBtn) return;

    logoutBtn.addEventListener('click', function (e) {
        e.preventDefault();

        // Crear modal de confirmación si no existe
        if (!document.getElementById('confirmModal')) {
            const modalHTML = `
                <div class="modal fade" id="confirmModal" tabindex="-1">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">Confirmar salida</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <div class="modal-body">
                                ¿Está seguro que desea cerrar sesión?
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                                <button type="button" class="btn btn-primary" id="confirmModalAccept">Aceptar</button>
                            </div>
                        </div>
                    </div>
                </div>`;
            document.body.insertAdjacentHTML('beforeend', modalHTML);
        }

        // Configurar modal
        const confirmModal = new bootstrap.Modal(document.getElementById('confirmModal'));
        document.getElementById('confirmModalAccept').onclick = function () {
            localStorage.removeItem('userData');
            window.location.href = 'login.html';
        };

        confirmModal.show();
    });
}

// Configurar al cargar la página
document.addEventListener('DOMContentLoaded', function () {
    setupLogoutButton();
    cargarTemas();
});

// Variables globales para almacenar selecciones
let idTemaSeleccionado = null;
let idSubtemaSeleccionado = null;

// Configurar botones Agregar
document.getElementById('agregar-tema-btn').addEventListener('click', function () {
    // Crear modal para nuevo tema
    const modalHTML = `
                <div class="modal fade" id="nuevoTemaModal" tabindex="-1" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">Nuevo Tema</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <form id="nuevo-tema-form">
                                    <div class="mb-3">
                                        <label class="form-label">Nombre del Tema</label>
                                        <input type="text" class="form-control" id="nombre-tema" required>
                                    </div>
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                                <button type="button" class="btn btn-primary" id="guardar-tema-btn">Guardar</button>
                            </div>
                        </div>
                    </div>
                </div>`;

    // Agregar modal al DOM
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Mostrar modal
    const modal = new bootstrap.Modal(document.getElementById('nuevoTemaModal'));
    modal.show();

    // Configurar evento para guardar
    document.getElementById('guardar-tema-btn').addEventListener('click', function () {
        const nombre = document.getElementById('nombre-tema').value.trim();
        if (nombre) {
            fetch('http://186.64.122.174:8037/api/Tema/Crear', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nombre: nombre,
                    color: "",
                    idUsuario: JSON.parse(localStorage.getItem('userData'))?.id || 0,
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
                    document.getElementById('nuevoTemaModal').remove();
                    cargarTemas(); // Refrescar lista de temas
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Error al crear el tema');
                });
        }
    });

    // Eliminar modal al cerrar
    document.getElementById('nuevoTemaModal').addEventListener('hidden.bs.modal', function () {
        this.remove();
    });
});

document.getElementById('agregar-subtema-btn').addEventListener('click', function () {
    const temaSeleccionado = document.querySelector('#temas-list .list-item.active');
    if (!temaSeleccionado) {
        alert('Por favor seleccione un tema primero');
        return;
    }

    const nombreTema = temaSeleccionado.textContent;

    // Crear modal para nuevo subtema
    const modalHTML = `
                <div class="modal fade" id="nuevoSubtemaModal" tabindex="-1" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">Subtemas de ${nombreTema}</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <form id="nuevo-subtema-form">
                                    <div class="mb-3">
                                        <label class="form-label">Nuevo Subtema</label>
                                        <input type="text" class="form-control" id="nombre-subtema" required>
                                    </div>
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                                <button type="button" class="btn btn-primary" id="guardar-subtema-btn">Guardar</button>
                            </div>
                        </div>
                    </div>
                </div>`;

    // Agregar modal al DOM
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Mostrar modal
    const modal = new bootstrap.Modal(document.getElementById('nuevoSubtemaModal'));
    modal.show();

    // Configurar evento para guardar
    document.getElementById('guardar-subtema-btn').addEventListener('click', function () {
        const nombre = document.getElementById('nombre-subtema').value.trim();
        if (nombre) {
            const temaSeleccionado = document.querySelector('#temas-list .list-item.active');
            if (!temaSeleccionado) {
                alert('No se encontró el tema seleccionado');
                return;
            }
            const idTema = temaSeleccionado.dataset.id;

            fetch('http://186.64.122.174:8037/api/Subtema/Crear', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    idUsuario: JSON.parse(localStorage.getItem('userData'))?.id || 0,
                    nombre: nombre,
                    color: "",
                    idTema: idTema,
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
                    document.getElementById('nuevoSubtemaModal').remove();
                    cargarSubtemas(idTema); // Refrescar lista de subtemas
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Error al crear el subtema');
                });
        }
    });

    // Eliminar modal al cerrar
    document.getElementById('nuevoSubtemaModal').addEventListener('hidden.bs.modal', function () {
        this.remove();
    });
});


document.getElementById('exportar-excel-btn').addEventListener('click', function () {
    if (!idTemaSeleccionado || !idSubtemaSeleccionado) {
        alert('Por favor seleccione un tema y subtema primero');
        return;
    }
    const modalHTML = `
                <div class="modal fade" id="excelModal" tabindex="-1">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">Importar desde Excel</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <div class="modal-body">
                                <h6>Importar desde archivo Excel</h6>
                                <div class="tab-content">
                                    <div class="tab-pane fade show active" id="fileTab">
                                        <div class="mb-3">
                                            <label class="form-label">Seleccionar archivo Excel</label>
                                            <input type="file" class="form-control" id="excel-file" accept=".xlsx,.xls">
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                                <button type="button" class="btn btn-primary" id="subir-excel-btn">Subir información</button>
                            </div>
                        </div>
                    </div>
                </div>`;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    const modal = new bootstrap.Modal(document.getElementById('excelModal'));
    modal.show();

    document.getElementById('subir-excel-btn').addEventListener('click', function () {
        // Mostrar modal de progreso
        const progressHTML = `
                    <div id="excel-progress" class="modal" tabindex="-1" style="display: block; background: rgba(0,0,0,0.5)">
                        <div class="modal-dialog modal-dialog-centered">
                            <div class="modal-content">
                                <div class="modal-body text-center">
                                    <div class="spinner-border text-primary mb-3" style="width: 3rem; height: 3rem;"></div>
                                    <p id="progress-text">Preparando importación...</p>
                                </div>
                            </div>
                        </div>
                    </div>`;
        document.body.insertAdjacentHTML('beforeend', progressHTML);

        const fileInput = document.getElementById('excel-file');
        if (!fileInput.files.length) {
            alert('Por favor seleccione un archivo');
            return;
        }
        processExcelFile(fileInput.files[0])
            .then(() => {
                const progressModal = document.getElementById('excel-progress');
                if (progressModal) progressModal.remove();
                modal.hide();
                document.getElementById('excelModal').remove();
            })
            .catch(err => {
                console.error('Error:', err);
                const progressModal = document.getElementById('excel-progress');
                if (progressModal) progressModal.remove();
                alert('Error al procesar el archivo Excel');
            });
    });

    // Limpiar al cerrar
    document.getElementById('excelModal').addEventListener('hidden.bs.modal', function () {
        this.remove();
    });
});

document.getElementById('agregar-nota-btn').addEventListener('click', function () {
    const subtemaSeleccionado = document.querySelector('#subtemas-list .list-item.active');
    if (!subtemaSeleccionado) {
        alert('Por favor seleccione un subtema primero');
        return;
    }

    const nombreSubtema = subtemaSeleccionado.textContent;


    // Crear modal para nueva nota
    const modalHTML = `
                <div class="modal fade" id="nuevaNotaModal" tabindex="-1" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">Notas de ${nombreSubtema}</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <form id="nueva-nota-form">
                                    <div class="mb-3">
                                        <label class="form-label">Nueva Nota</label>
                                        <input type="text" class="form-control" id="titulo-nota" placeholder="Título" required>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">Detalle</label>
                                        <textarea class="form-control" id="detalle-nota" rows="3"></textarea>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">Ayuda</label>
                                        <textarea class="form-control" id="ayuda-nota" rows="2"></textarea>
                                    </div>
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                                <button type="button" class="btn btn-primary" id="guardar-nota-btn">Guardar</button>
                            </div>
                        </div>
                    </div>
                </div>`;

    // Agregar modal al DOM
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Mostrar modal
    const modal = new bootstrap.Modal(document.getElementById('nuevaNotaModal'));
    modal.show();

    // Configurar evento para guardar
    document.getElementById('guardar-nota-btn').addEventListener('click', function () {
        const titulo = document.getElementById('titulo-nota').value.trim();
        if (titulo) {
            const detalle = document.getElementById('detalle-nota').value;
            const ayuda = document.getElementById('ayuda-nota').value;

            if (!idTemaSeleccionado || !idSubtemaSeleccionado) {
                alert('Por favor seleccione un tema y subtema primero');
                return;
            }

            fetch('http://186.64.122.174:8037/api/Nota/Crear', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    titulo: titulo,
                    detalle: detalle,
                    ayuda: ayuda,
                    fecha: "",
                    libre: 0,
                    idTema: idTemaSeleccionado,
                    idSubtema: idSubtemaSeleccionado,
                    idUsuario: JSON.parse(localStorage.getItem('userData'))?.id || 0,
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
                    document.getElementById('nuevaNotaModal').remove();
                    cargarNotas(idSubtemaSeleccionado); // Refrescar lista de notas
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Error al crear la nota');
                });
        }
    });

    // Eliminar modal al cerrar
    document.getElementById('nuevaNotaModal').addEventListener('hidden.bs.modal', function () {
        this.remove();
    });
});

// Modal de confirmación para eliminar tema
function mostrarModalEliminarTema(idTema) {
    const modalHTML = `
                <div class="modal fade" id="confirmarEliminarTemaModal" tabindex="-1">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">Confirmar eliminación</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <div class="modal-body">
                                ¿Está seguro que desea eliminar este tema?
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                                <button type="button" class="btn btn-danger" id="confirmar-eliminar-tema-btn">Eliminar</button>
                            </div>
                        </div>
                    </div>
                </div>`;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    const modal = new bootstrap.Modal(document.getElementById('confirmarEliminarTemaModal'));
    modal.show();

    document.getElementById('confirmar-eliminar-tema-btn').addEventListener('click', function () {
        fetch('http://186.64.122.174:8037/api/Tema/Eliminar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
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
        })
            .then(response => response.json())
            .then(data => {
                modal.hide();
                document.getElementById('confirmarEliminarTemaModal').remove();
                cargarTemas(); // Actualizar lista
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error al eliminar el tema');
            });
    });

    // Configurar botón Cancelar para cerrar y eliminar el modal
    document.querySelector('#confirmarEliminarTemaModal .btn-secondary').addEventListener('click', function () {
        const modal = bootstrap.Modal.getInstance(document.getElementById('confirmarEliminarTemaModal'));
        modal.hide();
        document.getElementById('confirmarEliminarTemaModal').remove();
    });

    // Eliminar modal al cerrar
    document.getElementById('confirmarEliminarTemaModal').addEventListener('hidden.bs.modal', function () {
        this.remove();
    });
}

// Cargar temas al iniciar
document.addEventListener('DOMContentLoaded', function () {
    cargarTemas();

    // Delegación de eventos para el botón eliminar
    document.getElementById('temas-list').addEventListener('click', function (e) {
        if (e.target.classList.contains('eliminar-tema-btn')) {
            e.preventDefault();
            const temaItem = e.target.closest('.list-item');
            const idTema = temaItem.dataset.id;
            mostrarModalEliminarTema(idTema);
        }
    });
});

// Manejar selección de temas
document.getElementById('temas-list').addEventListener('click', function (e) {
    if (e.target.classList.contains('list-item')) {
        // Limpiar selecciones anteriores (excepto notas/subtemas si estamos seleccionando tema)
        document.querySelectorAll('#temas-list .list-item').forEach(i => i.classList.remove('active'));
        e.target.classList.add('active');

        // Guardar y cargar subtemas del tema seleccionado
        idTemaSeleccionado = e.target.dataset.id;
        idSubtemaSeleccionado = null; // Limpiar subtema seleccionado
        cargarSubtemas(idTemaSeleccionado);

        // Limpiar notas y detalle
        document.getElementById('notas-list').innerHTML = '';
        document.getElementById('nota-detalle').innerHTML = `
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Seleccione un subtema</h5>
                            <p class="card-text text-muted">Las notas aparecerán aquí</p>
                        </div>
                    </div>`;
    }
});

// Manejar selección de subtemas
document.getElementById('subtemas-list').addEventListener('click', function (e) {
    if (e.target.classList.contains('list-item')) {
        // Limpiar solo selecciones de subtemas (mantener tema seleccionado)
        document.querySelectorAll('#subtemas-list .list-item').forEach(i => i.classList.remove('active'));
        e.target.classList.add('active');

        // Guardar y cargar notas del subtema seleccionado
        idSubtemaSeleccionado = e.target.dataset.id;
        cargarNotas(idSubtemaSeleccionado);

        // Limpiar detalle de nota
        document.getElementById('nota-detalle').innerHTML = `
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Seleccione una nota</h5>
                            <p class="card-text text-muted">El detalle aparecerá aquí</p>
                        </div>
                    </div>`;
    }
});

// Función para habilitar/deshabilitar edición
function toggleEdicion(enable) {
    const form = document.getElementById('nota-form');
    if (!form) return; // Si no existe el formulario, salir

    const inputs = form.querySelectorAll('input, textarea');
    const editBtn = document.getElementById('editar-nota-btn');
    const cancelBtn = document.getElementById('cancelar-edicion-btn');
    const saveBtn = document.getElementById('guardar-nota-btn');

    // Verificar que existen los elementos antes de manipularlos
    if (inputs) {
        inputs.forEach(input => {
            if (input) {
                input.readOnly = !enable;
                input.disabled = !enable;
            }
        });
    }

    if (editBtn) editBtn.style.display = enable ? 'none' : 'inline-block';
    if (cancelBtn) cancelBtn.style.display = enable ? 'inline-block' : 'none';
    if (saveBtn) saveBtn.style.display = enable ? 'inline-block' : 'none';
}

// Manejar selección de notas
document.getElementById('notas-list').addEventListener('click', function (e) {
    if (e.target.classList.contains('list-item')) {
        // Limpiar solo selecciones de notas (mantener tema y subtema seleccionados)
        document.querySelectorAll('#notas-list .list-item').forEach(i => i.classList.remove('active'));
        e.target.classList.add('active');

        // Mostrar detalle de la nota seleccionada
        const idNota = e.target.dataset.id;
        const nota = window.notas.find(n => n.id == idNota);

        if (nota) {
            document.getElementById('nota-detalle').innerHTML = `
                        <div class="card">
                            <div class="card-body">
                                <h3>${nota.titulo}</h3>
                                <hr>
                                <div class="mb-4">
                                    <h5>Detalle:</h5>
                                    <p style="white-space: pre-wrap;">${nota.detalle}</p>
                                </div>
                                ${nota.ayuda ? `
                                <div class="mt-4">
                                    <h5>Ayuda:</h5>
                                    <div class="alert alert-info" style="white-space: pre-wrap;">${nota.ayuda}</div>
                                </div>` : ''}
                                <button type="button" class="btn btn-primary mt-3" id="editar-nota-btn">Editar</button>
                            </div>
                        </div>`;
        } else {
            document.getElementById('nota-detalle').innerHTML = `
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title">Error</h5>
                                <p class="card-text text-danger">No se pudo cargar la nota seleccionada</p>
                            </div>
                        </div>`;
        }

        // Configurar evento para el botón Editar
        document.getElementById('editar-nota-btn').addEventListener('click', function () {
            document.getElementById('nota-detalle').innerHTML = `
                        <div class="card">
                            <div class="card-body">
                                <form id="nota-form">
                                    <div class="mb-4">
                                        <label class="form-label">Título</label>
                                        <input type="text" class="form-control" name="titulo" value="${nota.titulo}">
                                    </div>
                                    <div class="mb-4">
                                        <label class="form-label">Detalle</label>
                                        <textarea class="form-control" name="detalle" rows="5" style="white-space: pre-wrap;">${nota.detalle}</textarea>
                                    </div>
                                    <div class="mb-4">
                                        <label class="form-label">Ayuda</label>
                                        <textarea class="form-control" name="ayuda" rows="3" style="white-space: pre-wrap;">${nota.ayuda || ''}</textarea>
                                    </div>
                                    <button type="button" class="btn btn-success" id="guardar-nota-btn">Guardar</button>
                                    <button type="button" class="btn btn-secondary ms-2" id="cancelar-edicion-btn">Cancelar</button>
                                </form>
                            </div>
                        </div>`;
        });
    }

    // Manejar botón Editar
    document.addEventListener('click', function (e) {
        if (e.target.id === 'editar-nota-btn') {
            toggleEdicion(true);
        }
    });

    // Manejar botón Cancelar
    document.addEventListener('click', function (e) {
        if (e.target.id === 'cancelar-edicion-btn') {
            toggleEdicion(false);
            // Recargar la nota original
            const activeNote = document.querySelector('#notas-list .list-item.active');
            if (activeNote) {
                activeNote.click();
            }
        }
    });

    // Manejar botón Guardar
    document.addEventListener('click', function (e) {
        if (e.target.id === 'guardar-nota-btn') {
            const form = document.getElementById('nota-form');
            const formData = {
                titulo: form.querySelector('[name="titulo"]').value,
                detalle: form.querySelector('[name="detalle"]').value,
                ayuda: form.querySelector('[name="ayuda"]').value
            };
            const activeNote = document.querySelector('#notas-list .list-item.active');
            if (!activeNote) return;

            const idNota = activeNote.dataset.id;
            const nota = window.notas.find(n => n.id == idNota);

            console.log('Guardando cambios para la nota:', idNota, formData);
            console.log('Nota original:', nota);

            const requestData = {
                id: parseInt(idNota),
                titulo: formData.titulo,
                detalle: formData.detalle,
                ayuda: formData.ayuda,
                fecha: nota.fecha,
                libre: nota.libre,
                idTema: nota.idTema,
                idSubtema: nota.idSubtema,
                idUsuario: JSON.parse(localStorage.getItem('userData'))?.id || 0,
                repaso: nota.repaso,
                favorito: nota.favorito,
                importancia: nota.importancia,
                Token: "",
                AppName: "",
                AppVersion: "",
                AppData: ""
            };

            console.log("Datos enviados al API:", requestData);

            fetch('http://186.64.122.174:8037/api/Nota/Editar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData)
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Respuesta completa del servidor:', data);
                    if (data.Data == 1) {
                        toggleEdicion(false);
                        // Recargar la nota editada
                        activeNote.click();
                        cargarNotas(idSubtemaSeleccionado);

                    } else {
                        alert(`Error del servidor: ${data.Mensaje || 'Error desconocido'}`);
                    }
                })
                .catch(error => {

                    alert(`Error al guardar los cambios: ${error.message}`);
                });
        }
    });
});
