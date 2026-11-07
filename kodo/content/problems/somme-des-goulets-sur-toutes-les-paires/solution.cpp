#include <algorithm>
#include <iostream>
#include <numeric>
#include <tuple>
#include <vector>
using namespace std;

vector<int> parent;
vector<long long> taille;

int trouver(int x) {
    int racine = x;
    while (parent[racine] != racine) racine = parent[racine];
    while (parent[x] != racine) {
        int suivant = parent[x];
        parent[x] = racine;
        x = suivant;
    }
    return racine;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m;
    cin >> n >> m;
    vector<tuple<long long, int, int>> aretes(m);
    for (auto& [w, a, b] : aretes) cin >> a >> b >> w;
    sort(aretes.begin(), aretes.end());
    parent.resize(n + 1);
    iota(parent.begin(), parent.end(), 0);
    taille.assign(n + 1, 1);

    // Kruskal : l'arête qui fusionne A et B est le goulet de toutes les paires (a, b) de A × B
    long long total = 0;
    for (auto [w, a, b] : aretes) {
        a = trouver(a);
        b = trouver(b);
        if (a != b) {
            total += w * taille[a] * taille[b];
            if (taille[a] < taille[b]) swap(a, b);
            parent[b] = a;
            taille[a] += taille[b];
        }
    }
    cout << total << "\n";
    return 0;
}
