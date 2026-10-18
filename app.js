// js/app.js
// Shared utilities for the Wellness Hub.
// Includes helpers for daily verse, mood matching, and rendering.

(function () {
  // --- Utility: escape HTML when rendering user content ---
  function escapeHtml(unsafe) {
    return String(unsafe)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // --- Random verse from shared data ---
  function getRandomVerse() {
    if (typeof versesData === 'undefined' || !versesData.length) return null;
    return versesData[Math.floor(Math.random() * versesData.length)];
  }

  // --- Pick a verse that matches a "mood tag" (used by simulators & journal) ---
  const moodKeywords = {
    anxious: ['anxiety', 'worry', 'afraid', 'fear', 'trust', 'still'],
    sad: ['brokenhearted', 'mourn', 'weep', 'downcast', 'comfort', 'hope'],
    lonely: ['lonely', 'forsake', 'leave you', 'with you', 'family'],
    tired: ['weary', 'rest', 'strength', 'renew', 'faint', 'give up'],
    grateful: ['joy', 'thank', 'rejoice', 'peace', 'cheerful'],
    hopeful: ['hope', 'future', 'anchor', 'plans', 'new every morning'],
    loved: ['love', 'children of God', 'wonderfully made', 'delight', 'beloved'],
    grieving: ['mourn', 'wipe every tear', 'Jesus wept', 'bind up'],
    weak: ['weak', 'grace', 'sufficient', 'strength', 'power'],
    fearful: ['fear', 'courageous', 'strong', 'not be afraid', 'with you']
  };

  function getVerseByMood(mood) {
    if (typeof versesData === 'undefined' || !versesData.length) return null;
    const keywords = moodKeywords[mood];
    if (!keywords) return getRandomVerse();

    const matches = versesData.filter(v => {
      const haystack = (v.text + ' ' + v.ref).toLowerCase();
      return keywords.some(k => haystack.includes(k.toLowerCase()));
    });

    if (matches.length === 0) return getRandomVerse();
    return matches[Math.floor(Math.random() * matches.length)];
  }

  // --- Render a verse into DOM elements with given ids ---
  function renderVerseInto(textId, refId, verse) {
    const v = verse || getRandomVerse();
    if (!v) return;
    const textEl = document.getElementById(textId);
    const refEl = document.getElementById(refId);
    if (textEl) textEl.textContent = '"' + v.text + '"';
    if (refEl) refEl.textContent = '— ' + v.ref;
  }

  // --- Daily verse render (used on index.html) ---
  function renderDailyVerse(textId, refId) {
    renderVerseInto(textId, refId, getRandomVerse());
  }

  // --- Public API ---
  window.wellnessUtils = {
    escapeHtml: escapeHtml,
    getRandomVerse: getRandomVerse,
    getVerseByMood: getVerseByMood,
    renderVerseInto: renderVerseInto,
    renderDailyVerse: renderDailyVerse,

    showMoodVerse: function (mood, textId, refId) {
      const verse = getVerseByMood(mood);
      renderVerseInto(textId, refId, verse);
      return verse;
    }
  };
})();
