pipeline {
    agent any

    stages {
        stage('Clear npm Cache') {
            steps {
                sh 'npm cache clean --force'
            }
        }

        stage('Set Permissions') {
            steps {
                sh 'chmod -R 777 /var/lib/jenkins/workspace/education-platform'
            }
        }

        stage('Install Dependencies') {
            steps {
                script {
                    withEnv(['PATH+npm=/usr/local/npm-6.14.15/bin']) {
                        sh '''
                        cd auth && npm install
                        cd ../user && npm install
                        cd ../gateway && npm install
                        '''
                    }
                }
            }
        }

        // Other stages...
    }
}
