import { describe, it, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { sevalla } from '../helpers/cli.ts'
import { safeDelete } from '../helpers/cleanup.ts'

interface Webhook {
  id: string
  endpoint?: string
  allowed_events?: string[]
  is_enabled?: boolean
  description?: string | null
  secret?: string
  created_at?: string
  updated_at?: string
  [key: string]: unknown
}

describe('webhooks', () => {
  const ts = Date.now()
  let createdWebhookId: string | undefined
  let secondWebhookId: string | undefined

  before(async () => {
    const res = await sevalla(['api-keys', 'validate'])
    assert.equal(res.exitCode, 0, `api-keys validate failed: ${res.stderr}`)
  })

  after(async () => {
    if (createdWebhookId) {
      await safeDelete(['webhooks'], createdWebhookId)
    }
    if (secondWebhookId) {
      await safeDelete(['webhooks'], secondWebhookId)
    }
  })

  // ---------------------------------------------------------------------------
  // List
  // ---------------------------------------------------------------------------
  it('should list webhooks', async () => {
    const res = await sevalla(['webhooks', 'list'])
    assert.equal(res.exitCode, 0, `webhooks list failed: ${res.stderr}`)
    const webhooks = res.json<Webhook[]>()
    assert.ok(Array.isArray(webhooks), 'response should be an array')
  })

  // ---------------------------------------------------------------------------
  // Create
  // ---------------------------------------------------------------------------
  it('should create a webhook', async () => {
    const res = await sevalla([
      'webhooks', 'create',
      '--endpoint', 'https://httpbin.org/post',
      '--events', 'APP_CREATE',
      '--description', `e2e-webhook-${ts}`,
    ])
    assert.equal(res.exitCode, 0, `webhooks create failed: ${res.stderr}`)
    const webhook = res.json<Webhook>()
    assert.ok(webhook.id, 'created webhook should have an id')
    createdWebhookId = webhook.id
  })

  it('should create a second webhook for delete testing', async () => {
    const res = await sevalla([
      'webhooks', 'create',
      '--endpoint', 'https://httpbin.org/anything',
      '--events', 'APP_DEPLOY',
      '--description', `e2e-webhook-2nd-${ts}`,
    ])
    assert.equal(res.exitCode, 0, `webhooks create failed: ${res.stderr}`)
    const webhook = res.json<Webhook>()
    assert.ok(webhook.id)
    secondWebhookId = webhook.id
  })

  // ---------------------------------------------------------------------------
  // Read
  // ---------------------------------------------------------------------------
  it('should get a webhook by ID', async () => {
    assert.ok(createdWebhookId, 'createdWebhookId must be set')
    const res = await sevalla(['webhooks', 'get', createdWebhookId])
    assert.equal(res.exitCode, 0, `webhooks get failed: ${res.stderr}`)
    const webhook = res.json<Webhook>()
    assert.equal(webhook.id, createdWebhookId)
  })

  it('should fail to get a non-existent webhook', async () => {
    const res = await sevalla(['webhooks', 'get', '00000000-0000-0000-0000-000000000000'])
    assert.equal(res.exitCode, 1)
  })

  // ---------------------------------------------------------------------------
  // Update
  // ---------------------------------------------------------------------------
  it('should update a webhook endpoint', async () => {
    assert.ok(createdWebhookId, 'createdWebhookId must be set')
    const res = await sevalla([
      'webhooks', 'update', createdWebhookId,
      '--endpoint', 'https://httpbin.org/anything',
    ])
    assert.equal(res.exitCode, 0, `webhooks update failed: ${res.stderr}`)
    const webhook = res.json<Webhook>()
    assert.equal(webhook.id, createdWebhookId)
  })

  it('should update webhook events', async () => {
    assert.ok(createdWebhookId, 'createdWebhookId must be set')
    const res = await sevalla([
      'webhooks', 'update', createdWebhookId,
      '--events', 'APP_CREATE,APP_DEPLOY',
    ])
    assert.equal(res.exitCode, 0, `webhooks update events failed: ${res.stderr}`)
  })

  // ---------------------------------------------------------------------------
  // Toggle
  // ---------------------------------------------------------------------------
  it('should toggle webhook to disabled', async () => {
    assert.ok(createdWebhookId, 'createdWebhookId must be set')
    const res = await sevalla(['webhooks', 'toggle', createdWebhookId])
    assert.equal(res.exitCode, 0, `webhooks toggle failed: ${res.stderr}`)
  })

  it('should toggle webhook back to enabled', async () => {
    assert.ok(createdWebhookId, 'createdWebhookId must be set')
    const res = await sevalla(['webhooks', 'toggle', createdWebhookId])
    assert.equal(res.exitCode, 0, `webhooks toggle failed: ${res.stderr}`)
  })

  // ---------------------------------------------------------------------------
  // Roll Secret
  // ---------------------------------------------------------------------------
  it('should roll webhook secret', async () => {
    assert.ok(createdWebhookId, 'createdWebhookId must be set')
    const res = await sevalla(['webhooks', 'roll-secret', createdWebhookId])
    assert.equal(res.exitCode, 0, `webhooks roll-secret failed: ${res.stderr}`)
  })

  // ---------------------------------------------------------------------------
  // Deliveries
  // ---------------------------------------------------------------------------
  it('should list webhook deliveries', async () => {
    assert.ok(createdWebhookId, 'createdWebhookId must be set')
    const res = await sevalla(['webhooks', 'deliveries', 'list', '--webhook-id', createdWebhookId])
    assert.equal(res.exitCode, 0, `webhooks deliveries list failed: ${res.stderr}`)
    const data = res.json<unknown[]>()
    assert.ok(Array.isArray(data), 'deliveries should be an array')
  })

  // ---------------------------------------------------------------------------
  // Delete
  // ---------------------------------------------------------------------------
  it('should delete a webhook', async () => {
    assert.ok(secondWebhookId, 'secondWebhookId must be set')
    const res = await sevalla(['webhooks', 'delete', secondWebhookId, '--confirm'])
    assert.equal(res.exitCode, 0, `webhooks delete failed: ${res.stderr}`)
    const body = res.json<{ deleted: boolean; id: string }>()
    assert.equal(body.deleted, true)
    assert.equal(body.id, secondWebhookId)
    secondWebhookId = undefined
  })
})
