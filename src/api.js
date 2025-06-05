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
        temaElement.className = 'list-item';
        temaElement.textContent = tema.nombre;
        temaElement.dataset.id = tema.id;
        temasList.appendChild(temaElement);
    });
}

// Exportar para uso en otros archivos
window.apiClient = apiClient;
window.cargarTemas = cargarTemas;
