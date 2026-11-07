#include <algorithm>
#include <iostream>
#include <set>
#include <tuple>
#include <vector>
using namespace std;

vector<int> parent;

int racine(int u) {
    while (parent[u] != u) {
        parent[u] = parent[parent[u]];
        u = parent[u];
    }
    return u;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m, q;
    unsigned long long graine;
    cin >> n >> m >> q >> graine;
    vector<int> couleur(n + 1);
    vector<tuple<long long, int, int>> aretes(m);  // (poids, u, v)
    vector<pair<long long, int>> requetes(q);      // (t, sommet)
    if (graine == 0) {
        for (int i = 1; i <= n; i++) cin >> couleur[i];
        for (int i = 0; i < m; i++) {
            int u, v;
            long long w;
            cin >> u >> v >> w;
            aretes[i] = {w, u, v};
        }
        for (int k = 0; k < q; k++) cin >> requetes[k].second >> requetes[k].first;
    } else {
        // Générateur décrit dans l'énoncé
        long long pa, pb, wMax, kMax;
        cin >> pa >> pb >> wMax >> kMax;
        unsigned long long x = graine;
        auto suivant = [&]() {
            x = x * 6364136223846793005ULL + 1442695040888963407ULL;  // modulo 2^64 automatiquement
            return (long long)(x >> 33);
        };
        for (int i = 1; i <= n; i++) couleur[i] = 1 + suivant() % kMax;
        for (int i = 0; i < m; i++) {
            int u = 1 + suivant() % pa;
            int v = 1 + suivant() % pb;
            long long w = 1 + suivant() % wMax;
            aretes[i] = {w, u, v};
        }
        for (int k = 0; k < q; k++) {
            int v = 1 + suivant() % n;
            long long t = 1 + suivant() % wMax;
            requetes[k] = {t, v};
        }
    }

    // Union-find ; ensembles[r] = couleurs de la composante de racine r
    parent.resize(n + 1);
    vector<set<int>> ensembles(n + 1);
    for (int i = 1; i <= n; i++) {
        parent[i] = i;
        ensembles[i].insert(couleur[i]);
    }

    sort(aretes.begin(), aretes.end());
    vector<int> ordre(q);
    for (int k = 0; k < q; k++) ordre[k] = k;
    stable_sort(ordre.begin(), ordre.end(), [&](int a, int b) { return requetes[a].first < requetes[b].first; });

    vector<int> reponses(q);
    int i = 0;
    for (int k : ordre) {
        long long t = requetes[k].first;
        // On ajoute toutes les arêtes de poids <= t (hors ligne : t croissant)
        while (i < m && get<0>(aretes[i]) <= t) {
            int r1 = racine(get<1>(aretes[i])), r2 = racine(get<2>(aretes[i]));
            i++;
            if (r1 == r2) continue;
            // Petit dans grand : on vide toujours le plus petit ensemble dans le plus grand
            if (ensembles[r1].size() < ensembles[r2].size()) swap(r1, r2);
            for (int c : ensembles[r2]) ensembles[r1].insert(c);
            set<int>().swap(ensembles[r2]);
            parent[r2] = r1;
        }
        reponses[k] = ensembles[racine(requetes[k].second)].size();
    }
    for (int k = 0; k < q; k++) cout << reponses[k] << "\n";
    return 0;
}
