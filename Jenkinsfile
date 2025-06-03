pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-creds') // à configurer dans Jenkins > Credentials
        DOCKERHUB_USERNAME = 'eline2016'
        KUBECONFIG_CREDENTIALS = credentials('kubeconfig') // si tu as kubeconfig à gérer dans Jenkins, sinon configurer autrement
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    // Construire et taguer les images
                    sh 'docker build -t auth:latest ./auth'
                    sh "docker tag auth:latest ${DOCKERHUB_USERNAME}/auth:latest"

                    sh 'docker build -t user:latest ./user'
                    sh "docker tag user:latest ${DOCKERHUB_USERNAME}/user:latest"

                    sh 'docker build -t getway:latest ./getway'
                    sh "docker tag getway:latest ${DOCKERHUB_USERNAME}/getway:latest"
                }
            }
        }

        stage('Docker Login & Push') {
            steps {
                script {
                    sh "echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_USERNAME --password-stdin"
                    sh "docker push ${DOCKERHUB_USERNAME}/auth:latest"
                    sh "docker push ${DOCKERHUB_USERNAME}/user:latest"
                    sh "docker push ${DOCKERHUB_USERNAME}/getway:latest"
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    // Appliquer les manifests K8s (adapter le chemin selon ton repo)
                    sh 'kubectl apply -f k8s/auth-deployment.yaml'
                    sh 'kubectl apply -f k8s/user-deployment.yaml'
                    sh 'kubectl apply -f k8s/getway-deployment.yaml'
                    sh 'kubectl apply -f k8s/postgres-deployment.yaml'
                }
            }
        }
    }
}

