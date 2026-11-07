#include <iostream>
#include <string>
#include <vector>
using namespace std;

const int MONTE = 0, DESCEND = 1;  // sens imposé au prochain chiffre : plus grand / plus petit
const int LMAX = 19;
int m;
vector<long long> p10;
// g[L][d][s][r] = nombre de suites de L chiffres qui peuvent suivre le chiffre d,
// dont le premier pas va dans le sens s, et dont la valeur vaut r modulo m.
vector<vector<vector<vector<long long>>>> g;

// nombre d'entiers en zigzag dans [1, n] multiples de m
long long compte(long long n) {
    if (n <= 0) return 0;
    string s = to_string(n);
    int k = s.size();
    vector<int> ch(k);
    for (int i = 0; i < k; i++) ch[i] = s[i] - '0';
    long long total = 0;
    // 1) les nombres qui ont moins de k chiffres
    for (int lg = 1; lg < k; lg++) {
        for (int f = 1; f <= 9; f++) {
            if (lg == 1) {
                total += (f % m == 0);
            } else {
                int cible = (int)((m - f * p10[lg - 1] % m) % m);
                total += g[lg - 1][f][MONTE][cible] + g[lg - 1][f][DESCEND][cible];
            }
        }
    }
    // 2) les nombres de k chiffres : on suit les chiffres de n, puis on passe en dessous
    long long pref = 0;
    for (int i = 0; i < k; i++) {
        bool chiffreValide = false;
        for (int c = (i == 0 ? 1 : 0); c <= ch[i]; c++) {
            // le préfixe ch[0..i-1] suivi de c doit rester en zigzag
            if (i >= 1 && c == ch[i - 1]) continue;
            if (i >= 2 && (c > ch[i - 1]) == (ch[i - 1] > ch[i - 2])) continue;
            if (c == ch[i]) {
                chiffreValide = true;
                break;
            }
            int reste = k - 1 - i;
            long long v = (pref * 10 + c) % m;
            if (reste == 0) {
                total += (v == 0);
            } else {
                int cible = (int)((m - v * p10[reste] % m) % m);
                if (i == 0) {
                    total += g[reste][c][MONTE][cible] + g[reste][c][DESCEND][cible];
                } else {
                    int sens = (c > ch[i - 1]) ? DESCEND : MONTE;
                    total += g[reste][c][sens][cible];
                }
            }
        }
        if (!chiffreValide) return total;  // le chiffre ch[i] casse le zigzag : n est exclu
        pref = (pref * 10 + ch[i]) % m;
    }
    return total + (pref == 0);  // n lui-même
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int t;
    cin >> m >> t;
    p10.assign(LMAX + 1, 1 % m);
    for (int i = 1; i <= LMAX; i++) p10[i] = p10[i - 1] * 10 % m;

    // Ce tableau ne dépend pas des bornes : on le calcule une seule fois.
    g.assign(LMAX, vector<vector<vector<long long>>>(10, vector<vector<long long>>(2, vector<long long>(m, 0))));
    for (int d = 0; d < 10; d++)
        for (int s = 0; s < 2; s++) g[0][d][s][0] = 1;
    for (int L = 1; L < LMAX; L++) {
        long long p = p10[L - 1];
        for (int d = 0; d < 10; d++) {
            for (int e = 0; e < 10; e++) {
                if (e == d) continue;
                // après d, on va vers e ; ensuite, le sens doit s'inverser
                int s = (e > d) ? MONTE : DESCEND;
                int suite = (e > d) ? DESCEND : MONTE;
                int dec = (int)(e * p % m);
                const vector<long long>& src = g[L - 1][e][suite];
                vector<long long>& dst = g[L][d][s];
                for (int r = 0; r < m; r++) dst[(r + dec) % m] += src[r];  // valeur + e × 10^(L-1)
            }
        }
    }

    for (int q = 0; q < t; q++) {
        long long a, b;
        cin >> a >> b;
        cout << compte(b) - compte(a - 1) << "\n";
    }
    return 0;
}
