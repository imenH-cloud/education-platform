pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "your-docker-image-name" // Remplace par le nom réel
    }

    stages {
        stage('Checkout') {
            steps {
                git 'https://github.com/imenH-cloud/education-platform'
            }
        }

        stage('Install Dependencies') {
            steps {
                script {
                    docker.image('node:20').inside {
                        sh '''
                        export npm_config_cache=.npm-cache

                        rm -rf auth/node_modules
                        cd auth
                        npm install
                        cd ..

                        rm -rf user/node_modules
                        cd user
                        npm install
                        cd ..

                        rm -rf getway/node_modules
                        cd getway
                        npm install
                        cd ..
                        '''
                    }
                }
            }
        }

        stage('Run Tests') {
            steps {
                script {
                    docker.image('node:20').inside {
                        sh '''
                        export npm_config_cache=.npm-cache
                        cd auth
                        npm test
                        '''
                    }
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                echo "✅ Docker build skipped or add docker build logic here"
            }
        }

        stage('Push Docker Images') {
            steps {
                echo "📦 Docker push skipped or add push logic here"
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                echo "🚀 Deployment logic placeholder"
            }
        }
    }

    post {
        success {
            echo '✅ Pipeline succeeded!'
        }
        failure {
            echo '❌ Pipeline failed!'
        }
    }
}
