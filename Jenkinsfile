stage('Install Dependencies') {
    steps {
        script {
            docker.image('node:20').inside {
                sh '''
                export npm_config_cache=.npm-cache
                cd auth && npm install
                cd ../user && npm install
                cd ../getway && npm install
                '''
            }
        }
    }
}
