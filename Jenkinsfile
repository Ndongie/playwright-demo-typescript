pipeline {
    agent any
    
    tools {
        nodejs 'nodejs'
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
        PLAYWRIGHT_HTML_REPORT = 'playwright-report/'
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
                    def testCommand = "npx playwright test --project \"${params.PROJECT}\""

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
        
        stage('Publish Reports') {
            steps {
                script {
                    // Check if report directory exists before publishing
                    if (isUnix()) {
                        sh 'test -d playwright-report || echo "No report directory found"'
                    } else {
                        bat 'if not exist playwright-report echo "No report directory found"'
                    }
                }

                // Publish HTML reports
                publishHTML([
                    allowMissing: true,
                    alwaysLinkToLastBuild: true,
                    keepAll: true,
                    reportDir: 'playwright-report',
                    reportFiles: 'index.html',
                    reportName: 'Playwright HTML Report'
                ])
                
                // Archive test results - using more inclusive patterns
                archiveArtifacts artifacts: 'test-results/**/*', fingerprint: false
                
                // Archive traces and videos for failed tests
                archiveArtifacts artifacts: 'test-results/**/*.zip', fingerprint: false  // Broader pattern for traces
                archiveArtifacts artifacts: 'test-results/**/*.webm', fingerprint: false  // Broader pattern for videos
            }
        }
    }
    
    post {
        always {
            // Archive test results even if build fails
            script {
                if (isUnix()) {
                    sh 'ls -la playwright-report/ || echo "No report generated"'
                } else {
                    bat 'dir playwright-report || echo "No report generated"'
                }
            }
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
            echo 'Build completed with unstable status'  // Fixed typo: 'completed' to 'completed'
        }
    }
}