/**
 * updateFiles.js - Handles file update operations including Excel file processing
 */

/**
 * Processes an Excel file and creates notes from the data
 * @param {File} file - The Excel file to process
 * @returns {Promise} Resolves when processing is complete
 */
function processExcelFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
                reader.onload = function(e) {
                    // Show loading spinner
                    const spinnerHTML = `
                        <div id="excel-spinner" class="modal" tabindex="-1" style="display: block; background: rgba(0,0,0,0.5)">
                            <div class="modal-dialog modal-dialog-centered">
                                <div class="modal-content">
                                    <div class="modal-body text-center">
                                        <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status">
                                            <span class="visually-hidden">Cargando...</span>
                                        </div>
                                        <p class="mt-3">Procesando archivo: ${file.name}</p>
                                    </div>
                                </div>
                            </div>
                        </div>`;
                    document.body.insertAdjacentHTML('beforeend', spinnerHTML);
                    
                    try {
                        const data = new Uint8Array(e.target.result);
                        const workbook = XLSX.read(data, {type: 'array'});
                const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                const jsonData = XLSX.utils.sheet_to_json(firstSheet, {header: ['titulo', 'detalle', 'ayuda']});

                // Filter out empty rows and process each row
                const notesToCreate = jsonData
                    .filter(row => row.titulo && row.detalle) // At least title and detail required
                    .map(row => ({
                        titulo: row.titulo || '',
                        detalle: row.detalle || '',
                        ayuda: row.ayuda || '',
                        fecha: "",
                        libre: 0,
                        idTema: idTemaSeleccionado || 0,
                        idSubtema: idSubtemaSeleccionado || 0, 
                        idUsuario: 1,
                        repaso: 0,
                        favorito: 0,
                        importancia: 0,
                        Token: "",
                        AppName: "",
                        AppVersion: "",
                        AppData: ""
                    }));

                // Create notes sequentially
                const createNotesSequentially = async () => {
                    for (const note of notesToCreate) {
                        await fetch('http://186.64.122.174:8037/api/Nota/Crear', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(note)
                        })
                        .then(response => response.json())
                        .catch(error => {
                            console.error('Error creating note:', error);
                            throw error;
                        });
                    }
                };

                        createNotesSequentially()
                            .then(() => {
                                // Remove spinner
                                const spinner = document.getElementById('excel-spinner');
                                if (spinner) spinner.remove();
                                
                                // Show success message
                                const successHTML = `
                                    <div class="alert alert-success alert-dismissible fade show" role="alert">
                                        ${notesToCreate.length} notas creadas exitosamente
                                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                                    </div>`;
                                document.body.insertAdjacentHTML('afterbegin', successHTML);
                                
                                if (idSubtemaSeleccionado) {
                                    cargarNotas(idSubtemaSeleccionado); // Refresh notes list
                                }
                                resolve();
                            })
                    .catch(error => {
                        console.error('Error processing Excel file:', error);
                        // Remove spinner
                        const spinner = document.getElementById('excel-spinner');
                        if (spinner) spinner.remove();
                        
                        // Show error message
                        const errorHTML = `
                            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                                Error al procesar el archivo Excel
                                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                            </div>`;
                        document.body.insertAdjacentHTML('afterbegin', errorHTML);
                        reject(error);
                    });

            } catch (error) {
                console.error('Error reading Excel file:', error);
                alert('Error al leer el archivo Excel');
                reject(error);
            }
        };

        reader.onerror = function(error) {
            console.error('FileReader error:', error);
            alert('Error al leer el archivo');
            reject(error);
        };

        reader.readAsArrayBuffer(file);
    });
}

/**
 * Updates application data from file changes
 * @param {Object} changes - Object containing file changes
 * @returns {Promise} Resolves when updates are complete
 */
function updateFromFileChanges(changes) {
    return new Promise((resolve, reject) => {
        // TODO: Implement update logic based on file changes
        console.log('Updating from file changes:', changes);
        resolve();
    });
}

// Make functions available globally
window.processExcelFile = processExcelFile;
window.updateFromFileChanges = updateFromFileChanges;

// Verify XLSX is loaded
if (typeof XLSX === 'undefined') {
    console.error('XLSX library not loaded!');
    alert('Error: La biblioteca XLSX no está cargada');
}
