// 📁 database/warnStore.js
const warnMap = new Map();

function getWarnKey(groupId, userId) {
  return `${groupId}:${userId}`;
}

function addWarning(groupId, userId) {
  const key = getWarnKey(groupId, userId);
  const current = warnMap.get(key) || 0;
  warnMap.set(key, current + 1);
  return current + 1;
}

function resetWarning(groupId, userId) {
  warnMap.delete(getWarnKey(groupId, userId));
}

function getWarnings(groupId, userId) {
  return warnMap.get(getWarnKey(groupId, userId)) || 0;
}

module.exports = { addWarning, resetWarning, getWarnings };
