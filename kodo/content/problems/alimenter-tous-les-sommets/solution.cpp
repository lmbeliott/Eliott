#include <algorithm>
#include <iostream>
#include <tuple>
#include <vector>
using namespace std;

vector<int> parent, taille;

int racine(int x) {
    while (parent[x] != x) {
        parent[x] = parent[parent[x]];
        x = parent[x];
    }
    return x;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m;
    cin >> n >> m;
    // Le sommet fictif 0 représente « la source » : installer une source en i,
    // c'est construire l'arête 0 — i de coût P[i].
    vector<tuple<long long, int, int>> aretes;
    for (int i = 1; i <= n; i++) {
        long long p;
        cin >> p;
        aretes.push_back({p, 0, i});
    }
    for (int i = 0; i < m; i++) {
        int a, b;
        long long c;
        cin >> a >> b >> c;
        aretes.push_back({c, a, b});
    }
    sort(aretes.begin(), aretes.end());

    // Union-find avec union par taille et compression de chemin.
    parent.resize(n + 1);
    taille.assign(n + 1, 1);
    for (int v = 0; v <= n; v++) parent[v] = v;

    // Algorithme de Kruskal sur les N + 1 sommets.
    long long total = 0;
    int restantes = n;  // nombre d'arêtes encore nécessaires pour tout relier
    for (auto [c, a, b] : aretes) {
        int ra = racine(a), rb = racine(b);
        if (ra == rb) continue;
        if (taille[ra] < taille[rb]) swap(ra, rb);
        parent[rb] = ra;
        taille[ra] += taille[rb];
        total += c;
        if (--restantes == 0) break;
    }
    cout << total << "\n";
    return 0;
}
