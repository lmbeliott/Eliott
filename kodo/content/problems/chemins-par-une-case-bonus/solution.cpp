#include <algorithm>
#include <iostream>
#include <tuple>
#include <vector>
using namespace std;

const long long MOD = 1000000007LL;

long long puissance(long long a, long long e) {
    long long r = 1;
    a %= MOD;
    while (e > 0) {
        if (e & 1) r = r * a % MOD;
        a = a * a % MOD;
        e >>= 1;
    }
    return r;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int h, w, k, b;
    cin >> h >> w >> k >> b;
    vector<tuple<int, int, bool>> points;  // (ligne, colonne, est_un_piege)
    for (int t = 0; t < k + b; t++) {
        int l, c;
        cin >> l >> c;
        points.push_back({l, c, t < k});
    }
    sort(points.begin(), points.end());
    points.push_back({h, w, false});  // l'arrivée, traitée en dernier
    int n = points.size();

    // Factorielles et inverses jusqu'à h + w
    int m = h + w;
    vector<long long> fact(m + 1, 1), inv(m + 1, 1);
    for (int i = 1; i <= m; i++) fact[i] = fact[i - 1] * i % MOD;
    inv[m] = puissance(fact[m], MOD - 2);
    for (int i = m; i >= 1; i--) inv[i - 1] = inv[i] * i % MOD;
    // nombre de chemins (droite / bas) pour descendre de dl lignes et avancer de dc colonnes
    auto chemins = [&](int dl, int dc) { return fact[dl + dc] * inv[dl] % MOD * inv[dc] % MOD; };

    // sansPiege[i] : chemins du départ à i qui n'ont croisé aucun piège avant i
    // sansRien[i]  : chemins du départ à i qui n'ont croisé ni piège ni bonus avant i
    vector<long long> sansPiege(n), sansRien(n);
    for (int i = 0; i < n; i++) {
        auto [li, ci, pi] = points[i];
        long long total = chemins(li - 1, ci - 1);
        long long a = total, r = total;
        for (int j = 0; j < i; j++) {
            auto [lj, cj, piege] = points[j];
            if (cj > ci) continue;
            long long p = chemins(li - lj, ci - cj);
            // on retire les chemins dont la PREMIÈRE case spéciale (interdite) est j
            if (piege) a = (a - sansPiege[j] * p % MOD + MOD) % MOD;
            r = (r - sansRien[j] * p % MOD + MOD) % MOD;
        }
        sansPiege[i] = a;
        sansRien[i] = r;
    }

    // (évitent les pièges) - (évitent les pièges et les bonus) = (évitent les pièges, au moins un bonus)
    cout << (sansPiege[n - 1] - sansRien[n - 1] + MOD) % MOD << "\n";
    return 0;
}
