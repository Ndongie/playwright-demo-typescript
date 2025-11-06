import { Reporter, TestCase, TestResult } from '@playwright/test/reporter';
import {logger} from '../utils/logger';
import { TestInfo } from '@playwright/test';

class TestListener implements Reporter {
  private testStartTimes = new Map<string, number>();

  onTestBegin(test: TestCase): void {
    this.testStartTimes.set(test.id, Date.now());
    logger.info(`🚀 STARTED TEST: ${test.title}`);
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    const startTime = this.testStartTimes.get(test.id) || Date.now();
    const duration = Date.now() - startTime;
    
    switch (result.status) {
      case 'passed':
        logger.info(`✅ ${test.title} PASSED:  (${duration}ms)`);
        break;
      case 'failed':
        logger.info(`❌ ${test.title} FAILED: (${duration}ms)`);
        if (result.error) {
          logger.info(`Error: ${result.error.message}`);
        }
        break;
      case 'timedOut':
        logger.info(`⏰ Test TIMEOUT: ${test.title} (${duration}ms)`);
        break;
      case 'skipped':
        logger.info(`⏭️ ${test.title} SKIPPED`);
        break;
      case 'interrupted':
        logger.info(`⏹️  ${test.title} INTERRUPTED`);
        break;
    }
    
    // Clean up
    this.testStartTimes.delete(test.id);
  }

  onBegin() {
    logger.info('Test suite started');
  }

  onEnd() {
    logger.info('Test suite completed');
  }
}

export default TestListener;