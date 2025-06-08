
pipeline {
    agent any
    
    environment {
        DOCKER_REGISTRY = 'docker.io/eline2016'
        PROJECT_NAME = 'education-platform'
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            steps {
                sh '''
                cd auth && npm install
                cd ../user && npm install
                cd ../getway && npm install
                '''
            }
        }
        
        stage('Run Tests') {
            steps {
                sh '''
                cd auth && npm run test
                cd ../user && npm run test
                cd ../getway && npm run test
                '''
            }
        }
        
        stage('Build Docker Images') {
            steps {
                sh '''
                docker build -t ${DOCKER_REGISTRY}/${PROJECT_NAME}/auth:${BUILD_NUMBER} ./auth
                docker build -t ${DOCKER_REGISTRY}/${PROJECT_NAME}/user:${BUILD_NUMBER} ./user
                docker build -t ${DOCKER_REGISTRY}/${PROJECT_NAME}/gateway:${BUILD_NUMBER} ./getway
                '''
            }
        }
        
        stage('Push Docker Images') {
            steps {
                withCredentials([string(credentialsId: 'docker-registry-credentials', variable: 'DOCKER_CREDENTIALS')]) {
                    sh '''
                    echo ${DOCKER_CREDENTIALS} | docker login ${DOCKER_REGISTRY} -u user --password-stdin
                    docker push ${DOCKER_REGISTRY}/${PROJECT_NAME}/auth:${BUILD_NUMBER}
                    docker push ${DOCKER_REGISTRY}/${PROJECT_NAME}/user:${BUILD_NUMBER}
                    docker push ${DOCKER_REGISTRY}/${PROJECT_NAME}/gateway:${BUILD_NUMBER}
                    '''
                }
            }
        }
        
        stage('Deploy to Kubernetes') {
            steps {
                withCredentials([file(credentialsId: 'kubeconfig', variable: 'KUBECONFIG')]) {
                    sh '''
                    export KUBECONFIG=${KUBECONFIG}
                    
                    # Mettre à jour les tags d'image dans les fichiers Kubernetes
                    sed -i "s|image: auth-service:latest|image: ${DOCKER_REGISTRY}/${PROJECT_NAME}/auth:${BUILD_NUMBER}|g" ./k8s/auth-service.yaml
                    sed -i "s|image: user-service:latest|image: ${DOCKER_REGISTRY}/${PROJECT_NAME}/user:${BUILD_NUMBER}|g" ./k8s/user-service.yaml
                    sed -i "s|image: api-gateway:latest|image: ${DOCKER_REGISTRY}/${PROJECT_NAME}/gateway:${BUILD_NUMBER}|g" ./k8s/gateway.yaml
                    
                    # Appliquer les configurations
                    kubectl apply -f ./k8s/postgres.yaml
                    kubectl apply -f ./k8s/user-service.yaml
                    kubectl apply -f ./k8s/auth-service.yaml
                    kubectl apply -f ./k8s/gateway.yaml
                    kubectl apply -f ./k8s/ingress.yaml
                    '''
                }
            }
        }
    }
    
    post {
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}
