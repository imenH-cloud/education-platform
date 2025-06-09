pipeline {
    agent any

    environment {
        DOCKER_REGISTRY = 'docker.io/eline2016'
        PROJECT_NAME = 'education-platform'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/imenH-cloud/education-platform'
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
