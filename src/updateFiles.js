/**
 * updateFiles.js - Handles file update operations including Excel file processing
 */

/**
 * Processes an Excel file and creates notes from the data
 * @param {File} file - The Excel file to process
 * @returns {Promise} Resolves when processing is complete
 */
function processExcelFile(source) {
    return new Promise((resolve, reject) => {
        // Update progress UI
        function updateProgress(current, total) {
            const progressText = document.getElementById('progress-text');
            if (progressText) {
                progressText.textContent = `Procesando ${current} de ${total} registros...`;
            }
        }

        // Process data from either URL or File
        const processData = (data) => {
            try {
                const workbook = XLSX.read(new Uint8Array(data), { type: 'array' });
                const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: ['titulo', 'detalle', 'ayuda'] });

                // Prepare notes data
                const notesToCreate = jsonData
                    .filter(row => row.titulo && row.detalle)
                    .map(row => ({
                        titulo: row.titulo || '',
                        detalle: row.detalle || '',
                        ayuda: row.ayuda || '',
                        fecha: "",
                        libre: 0,
                        idTema: idTemaSeleccionado || 0,
                        idSubtema: idSubtemaSeleccionado || 0,
                        idUsuario: JSON.parse(localStorage.getItem('userData'))?.id || 0,
                        repaso: 0,
                        favorito: 0,
                        importancia: 0,
                        Token: "",
                        AppName: "",
                        AppVersion: "",
                        AppData: ""
                    }));

                // Process records sequentially with progress updates
                const processRecords = async () => {
                    updateProgress(0, notesToCreate.length);

                    for (let i = 0; i < notesToCreate.length; i++) {
                        await fetch('http://186.64.122.174:8037/api/Nota/Crear', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(notesToCreate[i])
                        });
                        updateProgress(i + 1, notesToCreate.length);
                    }
                };

                return processRecords()
                    .then(() => {
                        if (idSubtemaSeleccionado) {
                            cargarNotas(idSubtemaSeleccionado);
                        }
                        resolve();
                    });
            } catch (error) {
                console.error('Error procesando Excel:', error);
                reject(error);
            }
        };

        // Read local file
        const reader = new FileReader();
        reader.onload = function (e) {
            processData(e.target.result);
        };
        reader.onerror = function (error) {
            console.error('Error leyendo archivo:', error);
            reject(error);
        };
        reader.readAsArrayBuffer(source);
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
