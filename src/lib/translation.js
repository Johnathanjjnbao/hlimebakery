const META_KEYS = ['vi_content_version', 'ko_translation_status', 'ko_source_vi_version', 'ko_updated_at'];
const MYMEMORY_ENDPOINT = 'https://api.mymemory.translated.net/get';
const MAX_CHUNK_BYTES = 450;
const SUPPORTED_PAIRS = new Set(['vi|ko', 'ko|vi']);

const normalize = (value) => String(value ?? '').trim();

function translationError(code, message) {
  const error = new Error(message);
  error.code = code;
  return error;
}

function splitTranslationText(text) {
  const characters = Array.from(text);
  const encoder = new TextEncoder();
  const chunks = [];
  let start = 0;

  while (start < characters.length) {
    let end = start;
    let byteLength = 0;
    let preferredEnd = -1;
    while (end < characters.length) {
      const characterBytes = encoder.encode(characters[end]).length;
      if (byteLength + characterBytes > MAX_CHUNK_BYTES) break;
      byteLength += characterBytes;
      end += 1;
      if (byteLength >= MAX_CHUNK_BYTES * 0.6 && /\s|[.!?;,:]/u.test(characters[end - 1])) {
        preferredEnd = end;
      }
    }
    if (end < characters.length && preferredEnd > start) end = preferredEnd;
    chunks.push(characters.slice(start, end).join(''));
    start = end;
  }

  return chunks;
}

function isRateLimit(status, details) {
  return status === 429 || /rate|quota|limit|too many|available free translations/i.test(details || '');
}

async function translateChunk(text, sourceLanguage, targetLanguage) {
  const url = new URL(MYMEMORY_ENDPOINT);
  url.searchParams.set('q', text);
  url.searchParams.set('langpair', `${sourceLanguage}|${targetLanguage}`);

  let response;
  try {
    response = await fetch(url);
  } catch {
    throw translationError('api_error', 'MyMemory request failed');
  }

  let payload;
  try {
    payload = await response.json();
  } catch {
    if (response.status === 429) throw translationError('rate_limit', 'MyMemory rate limit reached');
    throw translationError('api_error', 'MyMemory returned an invalid response');
  }

  const embeddedStatus = Number(payload?.responseStatus || response.status);
  const details = String(payload?.responseDetails || '');
  if (isRateLimit(response.status, details) || isRateLimit(embeddedStatus, details)) {
    throw translationError('rate_limit', details || 'MyMemory rate limit reached');
  }
  if (!response.ok || embeddedStatus >= 400) {
    throw translationError('api_error', details || 'MyMemory translation failed');
  }

  const translatedText = String(payload?.responseData?.translatedText || '').trim();
  if (!translatedText) throw translationError('api_error', 'MyMemory returned an empty translation');
  return translatedText;
}

export async function translateText({ text, sourceLanguage, targetLanguage }) {
  const sourceText = String(text ?? '');
  if (!sourceText.trim()) throw translationError('empty_source', 'Source text is empty');
  if (!SUPPORTED_PAIRS.has(`${sourceLanguage}|${targetLanguage}`)) {
    throw translationError('unsupported_pair', 'Only vi|ko and ko|vi are supported');
  }

  const translatedChunks = [];
  for (const chunk of splitTranslationText(sourceText)) {
    const leadingWhitespace = chunk.match(/^\s*/u)?.[0] || '';
    const trailingWhitespace = chunk.match(/\s*$/u)?.[0] || '';
    const contentEnd = trailingWhitespace ? chunk.length - trailingWhitespace.length : chunk.length;
    const content = chunk.slice(leadingWhitespace.length, contentEnd);
    if (!content) {
      translatedChunks.push(chunk);
      continue;
    }
    const translated = await translateChunk(content, sourceLanguage, targetLanguage);
    translatedChunks.push(`${leadingWhitespace}${translated}${trailingWhitespace}`);
  }

  const translation = translatedChunks.join('');
  if (!translation.trim()) throw translationError('api_error', 'MyMemory returned an empty translation');
  return translation;
}

export function translationMetaForSave(original, draft, viFields, koFields) {
  const originalRow = original || {};
  const viChanged = viFields.some((field) => normalize(originalRow[field]) !== normalize(draft[field]));
  const koChanged = koFields.some((field) => normalize(originalRow[field]) !== normalize(draft[field]));
  const hasKo = koFields.some((field) => normalize(draft[field]));
  const currentVersion = Number(originalRow.vi_content_version || 1);
  const nextVersion = viChanged && original ? currentVersion + 1 : currentVersion;

  if (!hasKo) {
    return {
      vi_content_version: nextVersion,
      ko_translation_status: 'missing',
      ko_source_vi_version: null,
      ko_updated_at: null,
    };
  }

  if (koChanged || !original) {
    return {
      vi_content_version: nextVersion,
      ko_translation_status: draft.ko_translation_status === 'machine' ? 'machine' : 'manual',
      ko_source_vi_version: nextVersion,
      ko_updated_at: new Date().toISOString(),
    };
  }

  if (viChanged) {
    return {
      vi_content_version: nextVersion,
      ko_translation_status: 'stale',
      ko_source_vi_version: originalRow.ko_source_vi_version || currentVersion,
      ko_updated_at: originalRow.ko_updated_at || new Date().toISOString(),
    };
  }

  return Object.fromEntries(META_KEYS.map((key) => [key, originalRow[key] ?? null]));
}

export function translationStatusLabel(status) {
  return ({
    missing: 'Chưa có bản KO',
    machine: 'Bản dịch máy',
    reviewed: 'Đã review',
    manual: 'Sửa thủ công',
    stale: 'KO có thể đã cũ',
  })[status] || status || 'Chưa xác định';
}
