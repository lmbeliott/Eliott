#include <iostream>
#include <vector>
using namespace std;

int n, LOG;
vector<int> parent_, profondeur, debut, fin;
vector<vector<int>> haut;
vector<long long> f1, f2;  // Fenwick : c[z] et c[z] × profondeur[z], aux positions debut[z]

int lca(int u, int v) {
    if (profondeur[u] < profondeur[v]) swap(u, v);
    int diff = profondeur[u] - profondeur[v];
    for (int j = 0; diff; j++, diff >>= 1)
        if (diff & 1) u = haut[j][u];
    if (u == v) return u;
    for (int j = LOG - 1; j >= 0; j--)
        if (haut[j][u] != haut[j][v]) u = haut[j][u], v = haut[j][v];
    return parent_[u];
}

void marque(int z, long long x) {
    long long y = x * profondeur[z];
    for (int i = debut[z]; i <= n; i += i & -i) {
        f1[i] += x;
        f2[i] += y;
    }
}

void prefixes(int i, long long& s1, long long& s2) {
    s1 = s2 = 0;
    for (; i > 0; i -= i & -i) {
        s1 += f1[i];
        s2 += f2[i];
    }
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int q;
    cin >> n >> q;
    parent_.assign(n + 1, 0);
    vector<vector<int>> enfants(n + 1);
    for (int v = 2; v <= n; v++) {
        cin >> parent_[v];
        enfants[parent_[v]].push_back(v);
    }

    // Parcours en profondeur sans récursion : profondeur, et positions debut[v] .. fin[v]
    // occupées par le sous-arbre de v dans l'ordre de visite.
    profondeur.assign(n + 1, 0);
    debut.assign(n + 1, 0);
    fin.assign(n + 1, 0);
    vector<int> pile = {1};
    int compteur = 0;
    while (!pile.empty()) {
        int v = pile.back();
        pile.pop_back();
        if (v > 0) {
            debut[v] = ++compteur;
            pile.push_back(-v);
            for (int e : enfants[v]) {
                profondeur[e] = profondeur[v] + 1;
                pile.push_back(e);
            }
        } else {
            fin[-v] = compteur;
        }
    }

    // Remontée binaire pour l'ancêtre commun.
    LOG = 1;
    while ((1 << LOG) <= n) LOG++;
    haut.assign(LOG, vector<int>(n + 1, 0));
    haut[0] = parent_;
    for (int j = 1; j < LOG; j++)
        for (int v = 0; v <= n; v++) haut[j][v] = haut[j - 1][haut[j - 1][v]];

    f1.assign(n + 1, 0);
    f2.assign(n + 1, 0);
    for (int i = 0; i < q; i++) {
        int t;
        cin >> t;
        if (t == 1) {
            int u, v;
            long long x;
            cin >> u >> v >> x;
            // La valeur d'un sommet est la somme des marques de son sous-arbre.
            int w = lca(u, v);
            marque(u, x);
            marque(v, x);
            marque(w, -x);
            if (parent_[w]) marque(parent_[w], -x);
        } else {
            int v;
            cin >> v;
            long long a1, a2, b1, b2;
            prefixes(fin[v], a1, a2);
            prefixes(debut[v] - 1, b1, b2);
            // Une marque c[z] en z compte pour les profondeur[z] - profondeur[v] + 1 sommets
            // du chemin de v à z.
            cout << (a2 - b2) - (long long)(profondeur[v] - 1) * (a1 - b1) << "\n";
        }
    }
    return 0;
}
