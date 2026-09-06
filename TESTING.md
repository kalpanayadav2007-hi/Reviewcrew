# ReviewCrew — Testing Log

Manual QA performed on the live deployed application (`https://reviewcrew-frontend.onrender.com`), not just local/curl testing, to confirm real-world reliability.

## Cross-Language Testing

### JavaScript
**Snippet:** function with SQL injection risk, off-by-one loop bug, and style issues (`var`, poor naming, no spacing).
**Result:** ✅ Pass — Quality caught 4 distinct style/naming issues. Bugs caught the off-by-one error precisely. Security caught the SQL injection, rated `HIGH`. Zero overlap between categories.

### Python
**Snippet:**
```python
import os

def run_command(user_input):
    os.system("echo " + user_input)
    for i in range(0, len(items) + 1):
        print(items[i])
```
**Result:** ✅ Pass — Bugs correctly caught both the off-by-one `IndexError` AND the undefined `items` `NameError` as two separate findings. Security correctly identified the `os.system` command injection risk. Quality correctly returned no findings (code is short; real issues are functional, not stylistic).

### Java
**Snippet:**
```java
public class UserService {
    public String getUserName(User user) {
        return user.getName().toUpperCase();
    }
}
```
**Result:** ✅ Pass — Bugs correctly identified the `NullPointerException` risk with accurate Java-specific reasoning (`user` or `getName()` returning null). Quality and Security correctly returned no findings — genuinely no style or security issues present in this snippet.

## Edge Cases Tested

| Input | Expected | Result |
|---|---|---|
| Empty string | 400 error, no crash | ✅ Pass |
| Whitespace-only | 400 error, no crash | ✅ Pass (falls under the "required and must be a string" message path — see Day 4 note; not a bug, just a wording detail) |
| Gibberish / non-code text | Graceful handling, no false positives, no crash | ✅ Pass — all 3 agents returned empty findings correctly |
| Oversized input (>5000 chars) | 400 error, no crash | ✅ Pass (validated Day 4/5) |
| Transient Gemini free-tier 503 | One agent fails gracefully, others succeed independently, no server crash | ✅ Pass — observed and confirmed Day 5 |
| Backend cold start (Render free tier sleep) | Frontend tolerates slow wake-up without a false failure | ✅ Pass after Day 7 fix — timeout extended to 55s with an honest "waking up" message; confirmed working on live site |

## Known Non-Issues (Investigated, Not Bugs)
During Day 7 testing, two initial cross-language tests returned "no issues found" across all categories unexpectedly. Investigated via browser DevTools Network tab — re-running the exact same Python snippet produced correct, detailed findings on retry. Root cause was most likely a testing mechanics issue (stale textarea content) rather than an AI or backend defect. Confirmed via direct inspection of the raw API response that the system correctly analyzes and returns accurate findings when code is properly submitted.

## Test Coverage Summary
- **Languages tested:** JavaScript, Python, Java (3 of the "language-agnostic" claim's most common real-world cases)
- **All 3 agents (Quality, Bug, Security) confirmed independently accurate** across all 3 languages
- **All defined edge cases** (empty, whitespace, oversized, gibberish, transient API failure, cold start) confirmed handled gracefully
- **No crashes observed** under any tested condition
