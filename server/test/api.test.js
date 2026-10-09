import assert from 'assert';
import { getAllUsers, resetToSample } from '../dataStore.js';
import { runFallbackMatching } from '../services/fallbackMatcher.js';

async function runTests() {
  console.log('🧪 Starting SkillSwap Backend Unit Tests...\n');

  // Test 1: Data Store initializes with 10 sample users
  console.log('▶ Test 1: Sample data verification');
  const initialUsers = await resetToSample();
  assert.strictEqual(initialUsers.length, 10, 'Should have exactly 10 sample users');
  console.log(`✅ Loaded ${initialUsers.length} sample student profiles successfully.\n`);

  // Test 2: AI Matching between Ananya (user-1) and Rahul (user-2)
  console.log('▶ Test 2: Complementary Matching (Python <-> UI/UX)');
  const ananya = initialUsers.find(u => u.id === 'user-1');
  const candidates = initialUsers.filter(u => u.id !== 'user-1');

  const matchesForAnanya = runFallbackMatching(ananya, candidates);
  assert(matchesForAnanya.length > 0, 'Matches list should not be empty');

  const rahulMatch = matchesForAnanya.find(m => m.user.id === 'user-2');
  assert(rahulMatch, 'Rahul should be in matches');
  console.log(`   Ananya <-> Rahul Compatibility: ${rahulMatch.compatibility}%`);
  console.log(`   Match Type: ${rahulMatch.matchType}`);
  console.log(`   Suggested Exchange: ${rahulMatch.suggestedExchange}`);
  console.log(`   Explanation: ${rahulMatch.explanation}`);
  assert(rahulMatch.compatibility >= 80, 'Ananya and Rahul should have high compatibility (>= 80%)');
  assert.strictEqual(rahulMatch.matchType, 'Mutual Exchange', 'Should be detected as Mutual Exchange');
  console.log('✅ Ananya <-> Rahul complementary match passed with flying colors!\n');

  // Test 3: Complementary Matching between Priya (Video) and Rohan (Public Speaking)
  console.log('▶ Test 3: Complementary Matching (Video Editing <-> Public Speaking)');
  const priya = initialUsers.find(u => u.id === 'user-3');
  const candidatesForPriya = initialUsers.filter(u => u.id !== 'user-3');
  const matchesForPriya = runFallbackMatching(priya, candidatesForPriya);
  const rohanMatch = matchesForPriya.find(m => m.user.id === 'user-4');

  assert(rohanMatch, 'Rohan should be in matches');
  console.log(`   Priya <-> Rohan Compatibility: ${rohanMatch.compatibility}%`);
  console.log(`   Match Type: ${rohanMatch.matchType}`);
  console.log(`   Suggested Exchange: ${rohanMatch.suggestedExchange}`);
  assert(rohanMatch.compatibility >= 80, 'Priya and Rohan should have high compatibility (>= 80%)');
  assert.strictEqual(rohanMatch.matchType, 'Mutual Exchange', 'Should be detected as Mutual Exchange');
  console.log('✅ Priya <-> Rohan complementary match passed!\n');

  // Test 4: Maya (Data Science/ML) and Carlos (Frontend/React)
  console.log('▶ Test 4: Complementary Matching (ML/Python <-> React/Tailwind)');
  const maya = initialUsers.find(u => u.id === 'user-5');
  const candidatesForMaya = initialUsers.filter(u => u.id !== 'user-5');
  const matchesForMaya = runFallbackMatching(maya, candidatesForMaya);
  const carlosMatch = matchesForMaya.find(m => m.user.id === 'user-6');

  assert(carlosMatch, 'Carlos should be in matches');
  console.log(`   Maya <-> Carlos Compatibility: ${carlosMatch.compatibility}%`);
  console.log(`   Match Type: ${carlosMatch.matchType}`);
  console.log(`   Suggested Exchange: ${carlosMatch.suggestedExchange}`);
  assert(carlosMatch.compatibility >= 80, 'Maya and Carlos should have high compatibility (>= 80%)');
  console.log('✅ Maya <-> Carlos complementary match passed!\n');

  console.log('🎉 ALL BACKEND UNIT TESTS PASSED SUCCESSFULLY! 100% GREEN.\n');
}

runTests().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
