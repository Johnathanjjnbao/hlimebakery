const META_KEYS = ['vi_content_version', 'ko_translation_status', 'ko_source_vi_version', 'ko_updated_at'];

const normalize = (value) => String(value ?? '').trim();

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
      ko_translation_status: 'manual',
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
