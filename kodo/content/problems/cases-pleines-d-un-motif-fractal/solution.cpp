#include <iostream>
#include <map>
#include <string>
#include <tuple>
#include <vector>
using namespace std;

int m, k;
vector<string> motif;
vector<long long> cote, total;      // côté et nombre de cases pleines de la grille d'ordre t
long long avant[6][6];              // '#' du motif dans les lignes < i et les colonnes < j
map<tuple<int, long long, long long>, long long> memo;

// cases pleines dans les r premières lignes et les c premières colonnes
// de la grille d'ordre t (0 <= r, c <= cote[t])
long long pleines(int t, long long r, long long c) {
    if (r == 0 || c == 0) return 0;
    if (r == cote[t] && c == cote[t]) return total[t];
    auto cle = make_tuple(t, r, c);
    auto it = memo.find(cle);
    if (it != memo.end()) return it->second;
    long long s = cote[t - 1];
    int br = int(r / s), bc = int(c / s);   // blocs entiers en hauteur et en largeur
    long long rr = r % s, rc = c % s;
    long long res = avant[br][bc] * total[t - 1];          // les blocs entiers
    if (rr > 0) {
        // bande du bas : les blocs (br, j < bc) sont tous coupés de la même façon
        long long nb = avant[br + 1][bc] - avant[br][bc];
        if (nb > 0) res += nb * pleines(t - 1, rr, s);
    }
    if (rc > 0) {
        // bande de droite : les blocs (i < br, bc)
        long long nb = avant[br][bc + 1] - avant[br][bc];
        if (nb > 0) res += nb * pleines(t - 1, s, rc);
    }
    if (rr > 0 && rc > 0 && motif[br][bc] == '#') res += pleines(t - 1, rr, rc);  // le bloc du coin
    memo[cle] = res;
    return res;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int q;
    cin >> m >> k >> q;
    motif.resize(m);
    for (int i = 0; i < m; i++) cin >> motif[i];

    long long nb_motif = 0;
    for (int i = 0; i < m; i++)
        for (int j = 0; j < m; j++)
            if (motif[i][j] == '#') nb_motif++;
    cote.assign(1, 1);
    total.assign(1, 1);
    for (int t = 1; t <= k; t++) {
        cote.push_back(cote.back() * m);
        total.push_back(total.back() * nb_motif);
    }
    for (int i = 0; i <= m; i++)
        for (int j = 0; j <= m; j++) avant[i][j] = 0;
    for (int i = 0; i < m; i++)
        for (int j = 0; j < m; j++)
            avant[i + 1][j + 1] = avant[i][j + 1] + avant[i + 1][j] - avant[i][j] + (motif[i][j] == '#');

    for (int i = 0; i < q; i++) {
        long long l1, c1, l2, c2;
        cin >> l1 >> c1 >> l2 >> c2;
        cout << pleines(k, l2, c2) - pleines(k, l1 - 1, c2) - pleines(k, l2, c1 - 1)
                    + pleines(k, l1 - 1, c1 - 1) << "\n";
    }
    return 0;
}
