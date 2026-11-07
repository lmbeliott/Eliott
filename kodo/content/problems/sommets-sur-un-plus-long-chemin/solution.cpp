#include <iostream>
#include <vector>
using namespace std;

int n;
vector<vector<int>> voisins;
vector<int> ordre, dist_, parent;

// Parcours en largeur depuis plusieurs sources : remplit l'ordre de visite,
// la distance à la source la plus proche et le parent de chaque sommet.
void parcours(const vector<int>& sources) {
    dist_.assign(n + 1, -1);
    parent.assign(n + 1, 0);
    ordre = sources;
    for (int s : sources) dist_[s] = 0;
    for (size_t i = 0; i < ordre.size(); i++) {
        int u = ordre[i];
        for (int v : voisins[u])
            if (dist_[v] == -1) {
                dist_[v] = dist_[u] + 1;
                parent[v] = u;
                ordre.push_back(v);
            }
    }
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cin >> n;
    voisins.assign(n + 1, {});
    for (int v = 2; v <= n; v++) {
        int p;
        cin >> p;
        voisins[v].push_back(p);
        voisins[p].push_back(v);
    }

    // Diamètre : le sommet a le plus loin de 1, puis le sommet b le plus loin de a.
    parcours({1});
    int a = ordre.back();
    parcours({a});
    int b = ordre.back();
    int d = dist_[b];
    vector<int> chemin = {b};  // le chemin de b à a
    while (chemin.back() != a) chemin.push_back(parent[chemin.back()]);

    // Tous les plus longs chemins passent par le centre (un sommet si d est pair, deux sinon).
    vector<int> centres;
    if (d % 2 == 0) centres = {chemin[d / 2]};
    else centres = {chemin[d / 2], chemin[d / 2 + 1]};
    int h = d / 2;  // distance du centre à chaque bout d'un plus long chemin

    // Depuis le centre, v est sur un plus long chemin si son sous-arbre descend jusqu'à la distance h.
    parcours(centres);
    vector<int> plusBas = dist_;  // plus grande distance au centre dans le sous-arbre de v
    for (int i = n - 1; i >= 0; i--) {
        int v = ordre[i];
        if (dist_[v] > 0 && plusBas[v] > plusBas[parent[v]]) plusBas[parent[v]] = plusBas[v];
    }
    int total = 0;
    for (int v = 1; v <= n; v++)
        if (plusBas[v] == h) total++;
    cout << total << "\n";
    return 0;
}
