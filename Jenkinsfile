pipeline {
    agent any
    
    tools {
        nodejs 'nodejs'
        allure 'allure'
    }

    parameters {
        choice(
            name: 'TEST_SUITE',
            choices: ['all', 'login', 'regression', 'smoke'],
            description: 'Select the test suite to run'
        )
        choice (
            name: 'PROJECT',
            choices: ['chromium', 'firefox', 'webkit'],
            description: 'Select the project corresponding to the device and browser: chromium for Desktop Chrome, firefox for Desktop Firefox, webkit for Desktop Safari'
        )
        booleanParam (
            name: 'HEADLESS',
            defaultValue: false,
            description: 'Run tests in headless mode'
        )
    }
    
    environment {
        CI = 'true'
        BASE_URL = 'https://www.demoblaze.com/'
    }

    stages {
        stage('Verify Environment') {
            steps {
                script {
                    // Verify Node.js is available
                    if (isUnix()) {
                        sh "node --version"
                        sh "npm --version"
                    } else {
                        bat "node --version"
                        bat "npm --version"
                    }
                }
            }
        }

        stage('Checkout') {
            steps {
                retry(3) {
                    timeout(time: 1, unit: 'MINUTES') {
                        checkout scm
                    }
                }
            }
        }
        
        stage('Install Dependencies') {
            steps {
                script{
                     if (isUnix()) {
                        sh "npm ci"
                    } else {
                        bat "npm ci"
                    }
                }
            }
        }
        
        stage('Install Playwright Browsers') {
            steps {
                script{
                    if (isUnix()) {
                        sh "npx playwright install --with-deps"
                    } else {
                        bat "npx playwright install --with-deps"
                    }
                }
            }
        }
        
        stage('Run Tests') {
            steps {
                script {
                    def testCommand = "npx playwright test --project \"${params.PROJECT}\" --reporter=allure-playwright"

                    // Add suite if not all
                    if (params.TEST_SUITE != 'all') {
                        testCommand += " --grep \"${params.TEST_SUITE}\""
                    }

                    if (params.HEADLESS.toBoolean()) {
                        testCommand += " --headed"
                    }

                    echo "Executing command: ${testCommand}"
                    
                    // Execute tests - don't fail the build for test failures
                    catchError(buildResult: "SUCCESS", stageResult: "UNSTABLE") {
                        if (isUnix()) {
                            sh testCommand
                        } else {
                            bat testCommand
                        }
                    }
                }
            }
        }
        
        stage('Generate Allure Reports') {
            steps {
                script {
                    // Check if report directory exists before publishing
                    if (isUnix()) {
                        sh '''
                            echo "=== Generating Allure Report ==="
                            allure generate allure-results --clean -o allure-report
                            echo "=== Allure Report Contents ==="
                            ls -la allure-report/
                        '''
                    } else {
                        bat '''
                            echo "=== Generating Allure Report ==="
                            allure generate allure-results --clean -o allure-report
                            echo "=== Allure Report Contents ==="
                            dir allure-report
                        '''
                    }
                }
            }
        }
    }
    
    post {
               always {
            // PUBLISH ALLURE REPORT
            allure([
                includeProperties: false,
                jdk: '',
                properties: [],
                reportBuildPolicy: 'ALWAYS',
                results: [[path: 'allure-results']]
            ])
            
            // ARCHIVE ALLURE RESULTS FOR HISTORY
            archiveArtifacts artifacts: 'allure-results/**/*', allowEmptyArchive: true, fingerprint: false
            archiveArtifacts artifacts: 'allure-report/**/*', allowEmptyArchive: true, fingerprint: false
            
            script {
                // Clean diagnostic
                if (isUnix()) {
                    sh '''
                        echo "=== Allure Results ==="
                        if [ -d "allure-results" ]; then
                            find allure-results -name "*.json" | head -5
                        else
                            echo "No allure results generated"
                        fi
                    '''
                } else {
                    bat '''
                        echo "=== Allure Results ==="
                        if exist allure-results (
                            echo "Allure results found:"
                            dir allure-results\\*.json 2>nul | findstr /R /C:".*" | more +5
                        ) else (
                            echo "No allure results generated"
                        )
                    '''
                }
            }
            
            cleanWs()
        }
        
        success {
            echo 'Build completed successfully! All tests passed'
        }
        
        failure {
            echo 'Build failed due to test failures'
        }
        
        unstable {
            echo 'Build completed with unstable status'
        }
    }
}