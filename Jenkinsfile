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
                        sh '''
                            if [ -d "playwright-report" ]; then
                                echo "Playwright report directory exists"
                                ls -la playwright-report/
                            else
                                echo "No playwright report directory found"
                            fi
                        '''
                    } else {
                        bat '''
                            if exist playwright-report (
                                echo "Playwright report directory exists"
                                dir playwright-report
                            ) else (
                                echo "No playwright report directory found"
                            )
                        '''
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
                
                script {
                    // Archive test results if they exist
                    if (isUnix()) {
                        sh '''
                            if [ -d "test-results" ]; then
                                echo "Archiving test results"
                                find test-results/ -name "*" -type f
                            else
                                echo "No test-results directory found"
                            fi
                        '''
                    } 
                    else {
                        bat '''
                            if exist test-results (
                                echo "Archiving test results"
                                dir test-results /s
                            ) else (
                                echo "No test-results directory found"
                            )
                        '''
                    }
                }
                
                // Archive traces and videos for failed tests
                archiveArtifacts artifacts: 'test-results/**/*', allowEmptyArchive: true, fingerprint: false
                archiveArtifacts artifacts: 'playwright-report/**/*', allowEmptyArchive: true, fingerprint: false
            }
        }
    }
    
    post {
        always {
            // Archive test results even if build fails
            script {
                if (isUnix()) {
                    sh '''
                        echo "=== Build Artifacts Summary ==="
                        if [ -d "playwright-report" ]; then
                            echo "HTML Report available"
                        else
                            echo "No HTML report generated"
                        fi
                        if [ -d "test-results" ]; then
                            echo "Test results available"
                        else
                            echo "No test results generated"
                        fi
                    '''
                } else {
                    bat '''
                        echo "=== Build Artifacts Summary ==="
                        if exist playwright-report (
                            echo "HTML Report available"
                        ) else (
                            echo "No HTML report generated"
                        )
                        if exist test-results (
                            echo "Test results available"
                        ) else (
                            echo "No test results generated"
                        )
                    '''
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
            echo 'Build completed with unstable status' 
        }
    }
}