import test from 'node:test';
import assert from 'node:assert';
import { createServer } from '../src/server.ts';

test('Command lower transforms a string to lowercase', async () => {
    const app = createServer();

    const message = 'make THIS message '; 
    const expectedResponse = message.toLowerCase();
    const response = await app.inject({
        method: 'POST',
        url: '/chat',
        body: { question: message }
    });
    assert.strictEqual(response.statusCode, 200);
    assert.equal(response.body, expectedResponse);
});