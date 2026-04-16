# CryptoTracker DevOps Project

Aplicacion web full stack para consultar el top 10 de criptomonedas y almacenar el historial de consultas. El proyecto fue preparado como evidencia de una actividad de Fundamentos de DevOps e integra desarrollo, contenerizacion, automatizacion y despliegue en AWS.

## Descripcion del proyecto

La solucion esta compuesta por:

- Frontend en React que consume el backend y muestra el mercado actual.
- Backend en Node.js con Express que consulta CoinGecko, registra logs y guarda historial.
- Base de datos MongoDB para persistir las consultas realizadas.
- Docker y Docker Compose para ejecutar todo el stack de manera reproducible.
- Scripts Bash para despliegue, inicio y apagado.
- CloudFormation para aprovisionar infraestructura base en AWS.

## Arquitectura

```mermaid
flowchart LR
    U[Usuario] --> FE[Frontend React en Nginx]
    FE --> BE[Backend Node.js / Express]
    BE --> MG[(MongoDB)]
    BE --> LG[/app/logs/app.log]
    LG --> S3[(Bucket S3 para respaldo de logs)]
    AWS[EC2 en AWS] --> FE
    AWS --> BE
    AWS --> MG
```

## Tecnologias utilizadas

- React 18
- Node.js 20
- Express
- MongoDB 7
- Docker
- Docker Compose
- Bash
- AWS EC2
- AWS S3
- AWS CloudFormation

## Estructura del proyecto

```text
project/
├── backend/
├── frontend/
├── logs/
├── cloudformation/
│   └── template.yaml
├── docker-compose.yml
├── deploy.sh
├── start_app.sh
├── stop_app.sh
├── README.md
└── REPORT.md
```

## Puertos utilizados

- `80`: frontend servido con Nginx
- `3001`: backend Express
- `27017`: MongoDB dentro de la red interna de Docker

## Ejecucion local

Requisitos:

- Docker
- Docker Compose o `docker compose`

Pasos:

```bash
mkdir -p logs
docker compose build
docker compose up -d
```

Verificacion:

- Frontend: `http://localhost`
- Backend: `http://localhost:3001/health`
- Logs: `logs/app.log`

Para detener:

```bash
docker compose down
```

## Logs generados

El backend escribe logs en `logs/app.log` con formato similar a este:

```text
[2026-04-09 10:00:00] INFO: Consulta realizada: /api/coins
[2026-04-09 10:02:15] ERROR: Fallo MongoDB: connection refused
```

## Scripts Bash

### deploy.sh

Construye y despliega la aplicacion. Puede usarse en el proyecto actual o clonando desde GitHub:

```bash
chmod +x deploy.sh start_app.sh stop_app.sh
./deploy.sh
./deploy.sh https://github.com/usuario/repositorio.git /home/ec2-user/CryptoTracker
```

### start_app.sh

```bash
./start_app.sh
```

### stop_app.sh

```bash
./stop_app.sh
```

## Automatizacion con cron en EC2

Ejemplo para encender todos los dias a las 8:00 y apagar a las 22:00:

```bash
crontab -e
```

```cron
0 8 * * * /home/ec2-user/CryptoTracker/start_app.sh /home/ec2-user/CryptoTracker >> /home/ec2-user/start_app_cron.log 2>&1
0 22 * * * /home/ec2-user/CryptoTracker/stop_app.sh /home/ec2-user/CryptoTracker >> /home/ec2-user/stop_app_cron.log 2>&1
```

## Despliegue en EC2

1. Crear la infraestructura con `cloudformation/template.yaml`.
2. Conectarse por SSH a la instancia EC2.
3. Instalar Git, Docker y Docker Compose.
4. Clonar el repositorio.
5. Asignar permisos a los scripts.
6. Ejecutar `./deploy.sh`.
7. Abrir en el navegador `http://IP_PUBLICA_EC2`.

Comandos sugeridos en Amazon Linux:

```bash
sudo yum update -y
sudo yum install -y git
sudo yum install -y docker
sudo service docker start
sudo usermod -aG docker ec2-user
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
git clone <URL_DEL_REPOSITORIO>
cd CryptoTracker
chmod +x deploy.sh start_app.sh stop_app.sh
./deploy.sh
```

## Uso de S3

El bucket S3 se contempla para respaldar logs del sistema. Un flujo simple de operacion seria:

```bash
aws s3 cp logs/app.log s3://NOMBRE_DEL_BUCKET/logs/app-$(date +%F-%H%M%S).log
```

## Git y control de versiones

Para cumplir con la actividad:

- Inicializa el repositorio con `git init`.
- Crea una rama de trabajo, por ejemplo `feature/devops-delivery`.
- Realiza al menos 3 commits significativos.
- Sube el proyecto a GitHub con `git remote add origin ...` y `git push`.

Ejemplo de secuencia:

```bash
git init
git checkout -b feature/devops-delivery
git add .
git commit -m "feat: add dockerized crypto tracker base"
git commit -m "feat: add deployment scripts and cloudformation"
git commit -m "docs: add readme and project report"
```

## Evidencia requerida

Capturas que te conviene tomar:

- Aplicacion funcionando en `localhost`
- Contenedores levantados con `docker compose ps`
- Contenido de `logs/app.log`
- Bucket S3 creado
- Stack de CloudFormation desplegado
- Aplicacion abierta desde la IP publica de EC2

## Seguridad

No es recomendable usar `0.0.0.0/0` en produccion porque expone los puertos a cualquier origen. En un escenario real se deberia restringir el acceso por IP, balanceador o Security Groups mas cerrados.
