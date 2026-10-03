/**
 * AltruBiz Newsletter Club: CRM API client (GoHighLevel API v2)
 *
 * Same integration pattern as the GPT Playbook course server: a Private
 * Integration token of the sub-account, used server-side only, to upsert the
 * contact, manage tags, attach notes and send email from the sub-account.
 * No inbound webhooks are involved, so signups do not consume webhook executions.
 *
 * Required environment variable (server-side only):
 * - GHL_API_TOKEN   Private Integration token (contacts + conversations scopes)
 * Optional:
 * - GHL_LOCATION_ID Sub-account id (defaults to AltruBiz)
 */

const API = 'https://services.leadconnectorhq.com';
const DEFAULT_LOCATION = 'O8tlYEQIUn4z3qPCt1FX'; // AltruBiz - אלטרוביז

export const CLUB_TAG = 'מועדון המהלך הבא';
export const PENDING_TAG = 'מועדון - ממתין לאישור';

export function isCrmConfigured(): boolean {
    return !!process.env.GHL_API_TOKEN;
}

async function call(method: 'POST' | 'PUT' | 'DELETE', path: string, body: unknown): Promise<any> {
    const res = await fetch(API + path, {
        method,
        headers: {
            Authorization: `Bearer ${process.env.GHL_API_TOKEN}`,
            Version: '2021-07-28',
            'Content-Type': 'application/json',
            Accept: 'application/json'
        },
        body: JSON.stringify(body)
    });
    const text = await res.text();
    if (!res.ok) throw new Error(`CRM ${method} ${path.replace(/\/contacts\/[^/]+/, '/contacts/:id')} ${res.status}: ${text.slice(0, 300)}`);
    return text ? JSON.parse(text) : {};
}

export interface CrmContact {
    contactId: string;
    isNew: boolean;
    tags: string[];
}

/** Finds the contact by email (the sub-account forbids duplicates) or creates it. */
export async function upsertContactByEmail(email: string, sourceForNewContact: string): Promise<CrmContact> {
    const up = await call('POST', '/contacts/upsert', {
        locationId: process.env.GHL_LOCATION_ID || DEFAULT_LOCATION,
        email
    });
    const contactId = up?.contact?.id;
    if (!contactId) throw new Error('CRM upsert returned no contact id');

    const isNew = !!up.new;
    // Source is set only on contacts created by this signup, never overwritten on existing ones.
    if (isNew) await call('PUT', `/contacts/${contactId}`, { source: sourceForNewContact });

    return { contactId, isNew, tags: Array.isArray(up.contact.tags) ? up.contact.tags : [] };
}

// Tags go through the tags endpoint, so existing tags on the contact are kept.
export async function addContactTags(contactId: string, tags: string[]): Promise<void> {
    await call('POST', `/contacts/${contactId}/tags`, { tags });
}

export async function removeContactTags(contactId: string, tags: string[]): Promise<void> {
    await call('DELETE', `/contacts/${contactId}/tags`, { tags });
}

export async function addContactNote(contactId: string, body: string): Promise<void> {
    await call('POST', `/contacts/${contactId}/notes`, { body });
}

/** Sends an email from the sub-account, logged in the contact's conversation. */
export async function sendContactEmail(contactId: string, subject: string, html: string): Promise<void> {
    await call('POST', '/conversations/messages', { type: 'Email', contactId, subject, html });
}
