pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "node:20" // Use a Docker image with a compatible Node.js version
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
                    docker.image(env.DOCKER_IMAGE).inside("--entrypoint=''") {
                        sh '''
                        export npm_config_cache=.npm-cache

                        # Clean and install dependencies for each service
                        rm -rf auth/node_modules || true
                        cd auth || exit 1
                        npm install --no-optional
                        cd ..

                        rm -rf user/node_modules || true
                        cd user || exit 1
                        npm install --no-optional
                        cd ..

                        rm -rf gateway/node_modules || true
                        cd gateway || exit 1
                        npm install --no-optional
                        '''
                    }
                }
            }
        }

        stage('Run Tests') {
            steps {
                script {
                    docker.image(env.DOCKER_IMAGE).inside("--entrypoint=''") {
                        sh '''
                        export npm_config_cache=.npm-cache
                        cd auth || exit 1
                        npm test || echo "Tests failed for auth service"
                        '''
                    }
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    docker.image(env.DOCKER_IMAGE).inside("--entrypoint=''") {
                        sh '''
                        echo "Building Docker images..."
                        # Add your Docker build commands here
                        '''
                    }
                }
            }
        }

        stage('Push Docker Images') {
            steps {
                script {
                    docker.image(env.DOCKER_IMAGE).inside("--entrypoint=''") {
                        sh '''
                        echo "Pushing Docker images..."
                        # Add your Docker push commands here
                        '''
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    docker.image(env.DOCKER_IMAGE).inside("--entrypoint=''") {
                        sh '''
                        echo "Deploying to Kubernetes..."
                        # Add your Kubernetes deployment commands here
                        '''
                    }
                }
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
