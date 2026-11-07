#include <iostream>
#include <vector>
using namespace std;

int n;
vector<int> arbre;  // Fenwick sur les positions l

void ajoute(int i, int delta) {
    for (; i <= n; i += i & -i) arbre[i] += delta;
}

int somme(int i) {
    int s = 0;
    for (; i > 0; i -= i & -i) s += arbre[i];
    return s;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int q;
    long long graine;
    cin >> n >> q >> graine;
    vector<int> a(n + 1), L(q), R(q);
    if (graine == 0) {
        for (int i = 1; i <= n; i++) cin >> a[i];
        for (int k = 0; k < q; k++) cin >> L[k] >> R[k];
    } else {
        // Générateur décrit dans l'énoncé
        long long vMax, d;
        cin >> vMax >> d;
        unsigned long long x = graine;
        auto suivant = [&]() {
            x = x * 6364136223846793005ULL + 1442695040888963407ULL;  // modulo 2^64 automatiquement
            return (long long)(x >> 33);
        };
        for (int i = 1; i <= n; i++) a[i] = 1 + suivant() % vMax;
        for (int k = 0; k < q; k++) {
            int l = 1 + suivant() % d;
            int r = n - suivant() % d;
            if (l > r) swap(l, r);
            L[k] = l;
            R[k] = r;
        }
    }

    // Requêtes regroupées par extrémité droite
    vector<vector<int>> parDroite(n + 1);
    for (int k = 0; k < q; k++) parDroite[R[k]].push_back(k);

    arbre.assign(n + 2, 0);
    // Pour chaque valeur : dernière, avant-dernière et antépénultième occurrence (0 = aucune)
    vector<int> der(n + 1, 0), avant(n + 1, 0), ante(n + 1, 0), reponses(q);
    for (int r = 1; r <= n; r++) {
        int v = a[r];
        // Avant r : v est présente exactement deux fois dans [l, r-1] pour ante < l <= avant.
        // Après r : pour avant < l <= der.
        if (avant[v]) {
            ajoute(ante[v] + 1, -1);
            ajoute(avant[v] + 1, 1);
        }
        if (der[v]) {
            ajoute(avant[v] + 1, 1);
            ajoute(der[v] + 1, -1);
        }
        ante[v] = avant[v];
        avant[v] = der[v];
        der[v] = r;
        for (int k : parDroite[r]) reponses[k] = somme(L[k]);
    }
    for (int k = 0; k < q; k++) cout << reponses[k] << "\n";
    return 0;
}
