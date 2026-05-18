# CryptoTracker DevOps Project

Full-stack web application for checking the top 10 cryptocurrencies and storing the history of performed queries. The project was developed by integrating a frontend, backend, database, Docker, Bash automation, and AWS deployment.

## Project Description

CryptoTracker is an application that consumes cryptocurrency market information from an external API and displays the results in a web interface. Each query is stored in MongoDB, and server logs are also generated to show the system's operation.

## Architecture

```text
User
   |
   v
EC2 (AWS)
   |
   v
Docker Compose
   |-- Frontend (React + Nginx) -> Port 80
   |-- Backend (Node.js + Express) -> Port 3001
   |-- Database (MongoDB) -> Internal port 27017
   |
   v
Logs in /app/logs/app.log
   |
   v
Backup in S3
```

## Technologies Used

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

## Project Structure

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

## Ports Used

- `80`: frontend served with Nginx
- `3001`: backend Express
- `27017`: MongoDB inside the internal Docker network

## Local Execution

Requirements:

- Docker
- Docker Compose or `docker compose`

Steps:

```bash
mkdir -p logs
docker compose build
docker compose up -d
```

Expected verification:

- Frontend: `http://localhost`
- Backend: `http://localhost:3001/health`
- Logs: `logs/app.log`

To stop the application:

```bash
docker compose down
```

## Deployment on EC2

1. Create the infrastructure with `cloudformation/template.yaml`.
2. Connect to the EC2 instance.
3. Install Git, Docker, and Docker Compose.
4. Clone the repository from GitHub.
5. Grant permissions to the Bash scripts.
6. Run `./deploy.sh`.
7. Open the application at `http://EC2_PUBLIC_IP`.

Commands used on EC2:

```bash
sudo yum update -y
sudo yum install -y git docker
sudo service docker start
sudo usermod -aG docker ec2-user
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
git clone <REPOSITORY_URL>
cd CryptoTracker
chmod +x deploy.sh start_app.sh stop_app.sh
./deploy.sh
```

## Scripts Bash

### deploy.sh

Prepares and deploys the application by building the images and starting the containers with Docker Compose.

### start_app.sh

Starts the application with Docker Compose.

### stop_app.sh

Stops the application with Docker Compose.

## Automation with cron

Example for scheduling automatic startup and shutdown on Linux:

```cron
0 8 * * * /home/ec2-user/CryptoTracker/start_app.sh /home/ec2-user/CryptoTracker >> /home/ec2-user/start_app_cron.log 2>&1
0 22 * * * /home/ec2-user/CryptoTracker/stop_app.sh /home/ec2-user/CryptoTracker >> /home/ec2-user/stop_app_cron.log 2>&1
```

## Generated Logs

The backend writes events to `logs/app.log` using a format like the following:

```text
[2026-04-09 10:00:00] INFO: Query performed: /api/coins
[2026-04-09 10:02:15] ERROR: MongoDB failure: connection refused
```

## S3 Usage

The S3 bucket created with CloudFormation can be used to back up application logs:

```bash
aws s3 cp logs/app.log s3://BUCKET_NAME/logs/app-$(date +%F-%H%M%S).log
```

## Infrastructure as Code

The `cloudformation/template.yaml` file creates:

- an EC2 instance
- an S3 bucket
- a Security Group with rules for SSH, frontend, and backend

## Repository

The project should be versioned on GitHub with at least:

- 3 meaningful commits
- a working branch, for example `feature/devops-delivery`

## Recommended Evidence

- application running on localhost
- CloudFormation stack created
- EC2 instance running
- terminal with `./deploy.sh`
- application opened from the EC2 public IP
- logs generated in `app.log`
