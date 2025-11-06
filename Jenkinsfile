pipeline {
    agent any
    
    tools {
        nodejs 'nodejs'  // Ensure Node.js is configured in Jenkins
    }

    parameters{
        choice{
            name:'TEST_SUITE',
            choices:['all', 'login', 'regression', 'smoke', 'login'],
            description:'Select the test suite'
        }
        choice{
            name:'PROJECT',
            choices:['chromium', 'firefox', 'webkit'],
            description:'Select the project corresponding to the device and browser
            chromium for Desktop Chrome, firefox for Desktop Firefox, webkit for Desktop Safari'
        }
        booleanParam{
            name:'HEADLESS',
            defaultValue:false,
            description:'Run tests in headless mode'
        }
    }
    
    environment {
        CI = 'true'
        BASE_URL = 'https://www.demoblaze.com/'
        PLAYWRIGHT_HTML_REPORT = 'playwright-report/'
    }
    
    stages {
        stage('Checkout') {
            retry(3) {
                timeout(time:1, unit:'MINUTES'){
                    git branch: 'master'
                    url: ''
                }
            }
        }
        
        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }
        
        stage('Install Playwright Browsers') {
            steps {
                sh 'npx playwright install --with-deps'
            }
        }
        
        stage('Run Tests') {
            steps{
                script{
                    def testCommand = "npx playwright test --project '${params.PROJECT}"

                    //Add suite if not all
                    if(params.TEST_SUITE != 'all'){
                        testCommand += "--grep '${params.TEST_SUITE}'";
                    }

                    if(params.HEADLESS.toBoolean()){
                        testCommand += "--heeded'";
                    }

                    // Execute tests - dpn't fail the build for test failures
                    catchError(buildResult: "SUCCESS", stageResult: "UNSTABLE"){
                        if(isUnix()){
                            sh testCommand
                        }
                        else{
                            bat testCommand
                        }
                    }
                }
            }
        }
        
        stage('Publish Reports') {
            steps {
                // Publish HTML reports
                publishHTML([
                    allowMissing: false,
                    alwaysLinkToLastBuild: true,
                    keepAll: true,
                    reportDir: 'playwright-report',
                    reportFiles: 'index.html',
                    reportName: 'Playwright HTML Report'
                ])
                
                // Archive test results
                archiveArtifacts artifacts: 'test-results/**/*', fingerprint: false
                
                // Archive traces and videos for failed tests
                archiveArtifacts artifacts: 'test-results/**/traces/*.zip', fingerprint: false
                archiveArtifacts artifacts: 'test-results/**/videos/*.webm', fingerprint: false
            }
        }
    }
    
    post {
        always {
            // Clean up workspace
            cleanWs()
        }
        
        success {
            echo 'Build completed successfully! All tests passed'
        }
        
        failure {
            echo 'Build failed due to test failures'
        }
        
        unstable {
            echo 'Build complated with unstable status'
        }
    }
}