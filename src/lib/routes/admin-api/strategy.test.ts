import supertest from 'supertest';
import { EventEmitter } from 'events';
import { createTestConfig } from '../../../test/config/test-config';
import createStores from '../../../test/fixtures/store';
import permissions from '../../../test/fixtures/permissions';
import getApp from '../../app';
import { createServices } from '../../services';

const eventBus = new EventEmitter();
let destroy;

function getSetup() {
    const randomBase = `/random${Math.round(Math.random() * 1000)}`;
    const perms = permissions();
    const stores = createStores();
    const config = createTestConfig({
        server: { baseUriPath: randomBase },
        preRouterHook: perms.hook,
    });
    const services = createServices(stores, config);
    const app = getApp(config, stores, services, eventBus);

    destroy = () => {
        services.versionService.destroy();
        services.clientMetricsService.destroy();
        services.apiTokenService.destroy();
    };

    return {
        base: randomBase,
        strategyStore: stores.strategyStore,
        request: supertest(app),
        perms,
    };
}

afterEach(() => {
    destroy();
});

test('add version numbers for /strategies', () => {
    const { request, base } = getSetup();
    return request
        .get(`${base}/api/admin/strategies`)
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((res) => {
            expect(res.body.version).toBe(1);
        });
});

test('require a name when creating a new strategy', () => {
    const { request, base } = getSetup();
    return request
        .post(`${base}/api/admin/strategies`)
        .send({})
        .expect(400)
        .expect((res) => {
            expect(res.body.details[0].message === '"name" is required').toBe(
                true,
            );
        });
});

test('require parameters array when creating a new stratey', () => {
    const { request, base } = getSetup();
    return request
        .post(`${base}/api/admin/strategies`)
        .send({ name: 'TestStrat' })
        .expect(400)
        .expect((res) => {
            expect(res.body.details[0].message).toEqual(
                '"parameters" is required',
            );
        });
});

test('create a new strategy with empty parameters', async () => {
    const { request, base } = getSetup();
    return request
        .post(`${base}/api/admin/strategies`)
        .send({ name: 'TestStrat', parameters: [] })
        .expect(201);
});

test('not be possible to override name', () => {
    const { request, base, strategyStore } = getSetup();
    strategyStore.createStrategy({ name: 'Testing', parameters: [] });

    return request
        .post(`${base}/api/admin/strategies`)
        .send({ name: 'Testing', parameters: [] })
        .expect(409);
});

test('update strategy', () => {
    const { request, base, strategyStore } = getSetup();
    const name = 'AnotherStrat';
    strategyStore.createStrategy({ name, parameters: [] });

    return request
        .put(`${base}/api/admin/strategies/${name}`)
        .send({ name, parameters: [], description: 'added' })
        .expect(200);
});

test('not update unknown strategy', () => {
    const { request, base } = getSetup();
    const name = 'UnknownStrat';
    return request
        .put(`${base}/api/admin/strategies/${name}`)
        .send({ name, parameters: [], description: 'added' })
        .expect(404);
});

test('validate format when updating strategy', () => {
    const { request, base, strategyStore } = getSetup();
    const name = 'AnotherStrat';
    strategyStore.createStrategy({ name, parameters: [] });

    return request
        .put(`${base}/api/admin/strategies/${name}`)
        .send({})
        .expect(400);
});

test('editable=false will stop delete request', () => {
    jest.spyOn(global.console, 'error').mockImplementation(() => jest.fn());
    const { request, base } = getSetup();
    const name = 'default';
    return request.delete(`${base}/api/admin/strategies/${name}`).expect(500);
});

test('editable=false will stop edit request', () => {
    jest.spyOn(global.console, 'error').mockImplementation(() => jest.fn());
    const { request, base } = getSetup();
    const name = 'default';
    return request
        .put(`${base}/api/admin/strategies/${name}`)
        .send({ name, parameters: [] })
        .expect(500);
});

test('editable=true will allow delete request', () => {
    const { request, base, strategyStore } = getSetup();
    const name = 'deleteStrat';
    strategyStore.createStrategy({ name, parameters: [] });

    return request
        .delete(`${base}/api/admin/strategies/${name}`)
        .send({})
        .expect(200);
});

test('editable=true will allow edit request', () => {
    const { request, base, strategyStore } = getSetup();
    const name = 'editStrat';
    strategyStore.createStrategy({ name, parameters: [] });

    return request
        .put(`${base}/api/admin/strategies/${name}`)
        .send({ name, parameters: [] })
        .expect(200);
});

test('deprecating a strategy works', async () => {
    const { request, base, strategyStore } = getSetup();
    const name = 'editStrat';
    strategyStore.createStrategy({ name, parameters: [] });

    await request
        .post(`${base}/api/admin/strategies/${name}/deprecate`)
        .set('Content-Type', 'application/json')
        .send()
        .expect(200);
    return request
        .get(`${base}/api/admin/strategies/${name}`)
        .expect(200)
        .expect((res) => expect(res.body.deprecated).toBe(true));
});

test('deprecating a non-existent strategy yields 404', () => {
    const { request, base } = getSetup();
    return request
        .post(`${base}/api/admin/strategies/non-existent-strategy/deprecate`)
        .set('Content-Type', 'application/json')
        .expect(404);
});

test('reactivating a strategy works', async () => {
    const { request, base, strategyStore } = getSetup();
    const name = 'editStrat';
    strategyStore.createStrategy({ name, parameters: [] });

    await request
        .post(`${base}/api/admin/strategies/${name}/reactivate`)
        .set('Content-Type', 'application/json')
        .send()
        .expect(200);
    return request
        .get(`${base}/api/admin/strategies/${name}`)
        .expect(200)
        .expect((res) => expect(res.body.deprecated).toBe(false));
});

test('reactivating a non-existent strategy yields 404', () => {
    const { request, base } = getSetup();
    return request
        .post(`${base}/api/admin/strategies/non-existent-strategy/reactivate`)
        .set('Content-Type', 'application/json')
        .expect(404);
});
test("deprecating 'default' strategy will yield 403", () => {
    jest.spyOn(global.console, 'error').mockImplementation(() => jest.fn());
    const { request, base } = getSetup();
    return request
        .post(`${base}/api/admin/strategies/default/deprecate`)
        .set('Content-Type', 'application/json')
        .expect(403);
});
