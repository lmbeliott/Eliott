#include <iostream>
#include <vector>
using namespace std;

int n, LOG;
vector<int> profondeur;
vector<vector<int>> haut;  // haut[j][v] = ancêtre de v situé 2^j niveaux plus haut (0 si on sort)

// Remonte de k niveaux en décomposant k en puissances de deux.
int ancetre(int v, int k) {
    for (int j = 0; k > 0; j++, k >>= 1)
        if (k & 1) v = haut[j][v];
    return v;
}

int lca(int u, int v) {
    if (profondeur[u] < profondeur[v]) swap(u, v);
    u = ancetre(u, profondeur[u] - profondeur[v]);
    if (u == v) return u;
    for (int j = LOG - 1; j >= 0; j--)
        if (haut[j][u] != haut[j][v]) {
            u = haut[j][u];
            v = haut[j][v];
        }
    return haut[0][u];
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int q;
    cin >> n >> q;
    LOG = 1;
    while ((1 << LOG) <= n) LOG++;
    haut.assign(LOG, vector<int>(n + 1, 0));
    vector<vector<int>> enfants(n + 1);
    for (int v = 2; v <= n; v++) {
        cin >> haut[0][v];  // le parent de la racine est 0
        enfants[haut[0][v]].push_back(v);
    }

    // Profondeurs, par un parcours en largeur depuis la racine.
    profondeur.assign(n + 1, 0);
    vector<int> ordre = {1};
    for (size_t i = 0; i < ordre.size(); i++)
        for (int v : enfants[ordre[i]]) {
            profondeur[v] = profondeur[ordre[i]] + 1;
            ordre.push_back(v);
        }

    for (int j = 1; j < LOG; j++)
        for (int v = 0; v <= n; v++) haut[j][v] = haut[j - 1][haut[j - 1][v]];

    for (int i = 0; i < q; i++) {
        int u, v, k;
        cin >> u >> v >> k;
        int w = lca(u, v);
        int montee = profondeur[u] - profondeur[w];    // nombre d'arêtes de u à w
        int descente = profondeur[v] - profondeur[w];  // nombre d'arêtes de w à v
        if (k > montee + descente) cout << -1 << "\n";
        else if (k <= montee) cout << ancetre(u, k) << "\n";
        else cout << ancetre(v, montee + descente - k) << "\n";  // compté depuis v
    }
    return 0;
}
