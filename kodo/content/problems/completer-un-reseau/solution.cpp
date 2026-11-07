#include <algorithm>
#include <iostream>
#include <numeric>
#include <tuple>
#include <vector>
using namespace std;

vector<int> parent, taille;

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

bool unir(int a, int b) {
    a = trouver(a);
    b = trouver(b);
    if (a == b) return false;
    if (taille[a] < taille[b]) swap(a, b);
    parent[b] = a;
    taille[a] += taille[b];
    return true;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, k, m;
    cin >> n >> k >> m;
    parent.resize(n + 1);
    iota(parent.begin(), parent.end(), 0);
    taille.assign(n + 1, 1);

    int composantes = n;
    for (int i = 0; i < k; i++) {  // les liaisons existantes sont gratuites
        int a, b;
        cin >> a >> b;
        if (unir(a, b)) composantes--;
    }
    vector<tuple<long long, int, int>> candidates(m);
    for (auto& [c, a, b] : candidates) cin >> a >> b >> c;

    // Kruskal sur les liaisons à construire, de la moins chère à la plus chère
    sort(candidates.begin(), candidates.end());
    long long total = 0;
    for (auto [c, a, b] : candidates) {
        if (unir(a, b)) {
            total += c;
            composantes--;
        }
    }
    cout << (composantes == 1 ? total : -1) << "\n";
    return 0;
}
