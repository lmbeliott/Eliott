#include <iostream>
#include <string>
#include <vector>
using namespace std;

typedef unsigned long long ull;
const ull MOD = (1ULL << 61) - 1;  // grand module premier : les collisions deviennent très improbables
const ull BASE = 1000003;

ull mulmod(ull a, ull b) {
    unsigned __int128 p = (unsigned __int128)a * b;
    ull r = (ull)(p & MOD) + (ull)(p >> 61);
    if (r >= MOD) r -= MOD;
    return r;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    string s;
    int q;
    cin >> s >> q;
    int n = s.size();

    // Hachages des préfixes et puissances de la base
    vector<ull> h(n + 1, 0), pw(n + 1, 1);
    for (int i = 0; i < n; i++) {
        h[i + 1] = (mulmod(h[i], BASE) + (unsigned char)s[i]) % MOD;
        pw[i + 1] = mulmod(pw[i], BASE);
    }
    // hachage de s[a..b-1]
    auto hache = [&](int a, int b) { return (h[b] + MOD - mulmod(h[a], pw[b - a])) % MOD; };

    // ppd[x] = plus petit diviseur premier de x (crible)
    vector<int> ppd(n + 1);
    for (int x = 0; x <= n; x++) ppd[x] = x;
    for (long long p = 2; p * p <= n; p++)
        if (ppd[p] == p)
            for (long long m = p * p; m <= n; m += p)
                if (ppd[m] == m) ppd[m] = p;

    for (int k = 0; k < q; k++) {
        int l, r;
        cin >> l >> r;
        l--;  // morceau s[l..r-1]
        int longueur = r - l, t = longueur, x = longueur;
        while (x > 1) {
            int p = ppd[x];
            while (x % p == 0) x /= p;
            // On retire le facteur p tant que t / p reste une période du morceau.
            while (t % p == 0) {
                int d = t / p;
                if (hache(l, r - d) != hache(l + d, r)) break;
                t = d;
            }
        }
        cout << t << "\n";
    }
    return 0;
}
