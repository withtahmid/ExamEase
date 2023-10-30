function lcsLength(s, t) {
    let dp = Array.from({ length: s.length }, () => new Array(t.length).fill(-1));
    function lcs(l1, l2) {
        if (l1 === s.length || l2 === t.length)
            return 0;

        let ans = 0;
        if (dp[l1][l2] != -1) {
            return dp[l1][l2];
        }
        if (s[l1] == t[l2]) {
            ans = Math.max(ans, 1 + lcs(l1 + 1, l2 + 1))
        } else {
            ans = Math.max(ans, Math.max(lcs(l1 + 1, l2), lcs(l1, l2 + 1)));
        }
        dp[l1][l2] = ans;
        return ans;

    }
    return lcs(0, 0);
}

export { lcsLength };