# CryptoTracker DevOps Project

Aplicacion web full stack para consultar el top 10 de criptomonedas y almacenar el historial de consultas realizadas. El proyecto fue desarrollado integrando frontend, backend, base de datos, Docker, automatizacion con Bash y despliegue en AWS.

## Descripcion del proyecto

CryptoTracker es una aplicacion que consume informacion del mercado de criptomonedas desde una API externa y muestra los resultados en una interfaz web. Cada consulta realizada queda registrada en MongoDB y tambien se generan logs en el servidor para evidenciar la operacion del sistema.

## Arquitectura

```text
Usuario
   |
   v
EC2 (AWS)
   |
   v
Docker Compose
   |-- Frontend (React + Nginx) -> Puerto 80
   |-- Backend (Node.js + Express) -> Puerto 3001
   |-- Base de datos (MongoDB) -> Puerto 27017 interno
   |
   v
Logs en /app/logs/app.log
   |
   v
Respaldo en S3
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
- GitHub

## Estructura del proyecto

```text
project/
|-- backend/
|-- frontend/
|-- logs/
|-- cloudformation/
|   `-- template.yaml
|-- docker-compose.yml
|-- deploy.sh
|-- start_app.sh
|-- stop_app.sh
`-- README.md
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

Verificacion esperada:

- Frontend: `http://localhost`
- Backend: `http://localhost:3001/health`
- Logs: `logs/app.log`

Para detener la aplicacion:

```bash
docker compose down
```

## Despliegue en EC2

1. Crear la infraestructura con `cloudformation/template.yaml`.
2. Conectarse a la instancia EC2.
3. Instalar Git, Docker y Docker Compose.
4. Clonar el repositorio desde GitHub.
5. Asignar permisos a los scripts Bash.
6. Ejecutar `./deploy.sh`.
7. Abrir la aplicacion en `http://IP_PUBLICA_EC2`.

Comandos usados en EC2:

```bash
sudo yum update -y
sudo yum install -y git docker
sudo service docker start
sudo usermod -aG docker ec2-user
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
git clone <URL_DEL_REPOSITORIO>
cd CryptoTracker
chmod +x deploy.sh start_app.sh stop_app.sh
./deploy.sh
```

## Scripts Bash

### deploy.sh

Prepara y despliega la aplicacion construyendo las imagenes y levantando los contenedores con Docker Compose.

### start_app.sh

Inicia la aplicacion con Docker Compose.

### stop_app.sh

Detiene la aplicacion con Docker Compose.

## Automatizacion con cron

Ejemplo para programar el encendido y apagado automatico en Linux:

```cron
0 8 * * * /home/ec2-user/CryptoTracker/start_app.sh /home/ec2-user/CryptoTracker >> /home/ec2-user/start_app_cron.log 2>&1
0 22 * * * /home/ec2-user/CryptoTracker/stop_app.sh /home/ec2-user/CryptoTracker >> /home/ec2-user/stop_app_cron.log 2>&1
```

## Logs generados

El backend escribe eventos en `logs/app.log` con un formato como el siguiente:

```text
[2026-04-09 10:00:00] INFO: Consulta realizada: /api/coins
[2026-04-09 10:02:15] ERROR: Fallo MongoDB: connection refused
```

## Uso de S3

El bucket S3 creado con CloudFormation puede utilizarse para respaldar logs de la aplicacion:

```bash
aws s3 cp logs/app.log s3://NOMBRE_DEL_BUCKET/logs/app-$(date +%F-%H%M%S).log
```

## Infraestructura como codigo

El archivo `cloudformation/template.yaml` crea:

- una instancia EC2
- un bucket S3
- un Security Group con reglas para SSH, frontend y backend

## Repositorio

El proyecto debe versionarse en GitHub con al menos:

- 3 commits significativos
- una rama de trabajo, por ejemplo `feature/devops-delivery`

## Evidencias recomendadas

- aplicacion funcionando en localhost
- stack de CloudFormation creado
- instancia EC2 en ejecucion
- terminal con `./deploy.sh`
- aplicacion abierta desde la IP publica de EC2
- logs generados en `app.log`
