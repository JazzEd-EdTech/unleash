import { setupAppWithAuth } from '../../helpers/test-helper';
import metricsExample from '../../../examples/client-metrics.json';
import dbInit from '../../helpers/database-init';
import getLogger from '../../../fixtures/no-logger';
import { ApiTokenType } from '../../../../lib/types/models/api-token';

let app;
let db;

beforeAll(async () => {
    db = await dbInit('metrics_api_e2e_access_client', getLogger);
    app = await setupAppWithAuth(db.stores);
});

afterAll(async () => {
    await app.destroy();
    await db.destroy();
});

test('should enrich metrics with environment from api-token', async () => {
    const { apiTokenService } = app.services;
    const { environmentStore, clientMetricsStore } = db.stores;

    await environmentStore.create({
        name: 'some',
        type: 'test',
    });

    const token = await apiTokenService.createApiToken({
        type: ApiTokenType.CLIENT,
        username: 'test',
        environment: 'some',
        project: '*',
    });

    await app.request
        .post('/api/client/metrics')
        .set('Authorization', token.secret)
        .send(metricsExample)
        .expect(202);

    const all = await clientMetricsStore.getAll();
    expect(all[0].metrics.environment).toBe('some');
});
