#include <algorithm>
#include <iostream>
#include <string>
#include <utility>
#include <vector>
using namespace std;

typedef unsigned long long ull;
const ull MOD = (1ULL << 61) - 1;  // grand module premier : les collisions deviennent très improbables
const ull BASE = 911382323;

ull mulmod(ull a, ull b) {
    unsigned __int128 p = (unsigned __int128)a * b;
    ull r = (ull)(p & MOD) + (ull)(p >> 61);
    if (r >= MOD) r -= MOD;
    return r;
}

int n, k;
vector<ull> h, pw;

// Plus petite position d'un mot de longueur lg qui a k occurrences disjointes, ou -1.
int premierePosition(int lg) {
    vector<pair<ull, int>> fen;
    fen.reserve(n - lg + 1);
    for (int i = 0; i + lg <= n; i++) {
        ull x = (h[i + lg] + MOD - mulmod(h[i], pw[lg])) % MOD;
        fen.push_back({x, i});
    }
    // Les fenêtres de même hachage deviennent consécutives, dans l'ordre des positions.
    sort(fen.begin(), fen.end());
    int meilleure = -1;
    size_t a = 0;
    while (a < fen.size()) {
        size_t b = a;
        while (b < fen.size() && fen[b].first == fen[a].first) b++;
        // glouton : on retient chaque occurrence qui ne chevauche pas la précédente retenue
        int derniere = fen[a].second, nombre = 1;
        for (size_t j = a + 1; j < b && nombre < k; j++) {
            if (fen[j].second >= derniere + lg) {
                derniere = fen[j].second;
                nombre++;
            }
        }
        if (nombre >= k && (meilleure == -1 || fen[a].second < meilleure)) meilleure = fen[a].second;
        a = b;
    }
    return meilleure;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    string s;
    cin >> k >> s;
    n = s.size();
    h.assign(n + 1, 0);
    pw.assign(n + 1, 1);
    for (int i = 0; i < n; i++) {
        h[i + 1] = (mulmod(h[i], BASE) + (ull)s[i]) % MOD;
        pw[i + 1] = mulmod(pw[i], BASE);
    }

    // Si un mot de longueur L convient, son préfixe de longueur L - 1 aussi : on dichotomise.
    int bas = 1, haut = n / k;  // la longueur 1 convient toujours (garanti)
    while (bas < haut) {
        int milieu = (bas + haut + 1) / 2;
        if (premierePosition(milieu) != -1) bas = milieu;
        else haut = milieu - 1;
    }
    cout << bas << " " << premierePosition(bas) + 1 << "\n";
    return 0;
}
