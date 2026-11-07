#include <algorithm>
#include <iostream>
#include <numeric>
#include <tuple>
#include <vector>
using namespace std;

vector<int> parent, taille;

int trouver(int v) {
    int racine = v;
    while (parent[racine] != racine) racine = parent[racine];
    while (parent[v] != racine) {
        int suivant = parent[v];
        parent[v] = racine;
        v = suivant;
    }
    return racine;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin >> n;
    vector<long long> x(n), y(n);
    for (int i = 0; i < n; i++) cin >> x[i] >> y[i];

    // seules comptent les arêtes entre voisins dans l'ordre des x et dans l'ordre des y
    vector<tuple<long long, int, int>> aretes;
    for (const vector<long long>* coord : {&x, &y}) {
        const vector<long long>& c = *coord;
        vector<int> ordre(n);
        iota(ordre.begin(), ordre.end(), 0);
        sort(ordre.begin(), ordre.end(), [&](int i, int j) { return c[i] < c[j]; });
        for (int k = 0; k + 1 < n; k++) {
            int i = ordre[k], j = ordre[k + 1];
            aretes.push_back({c[j] - c[i], i, j});
        }
    }
    sort(aretes.begin(), aretes.end());

    parent.resize(n);
    iota(parent.begin(), parent.end(), 0);
    taille.assign(n, 1);
    long long total = 0;
    for (auto [c, i, j] : aretes) {  // Kruskal
        int a = trouver(i), b = trouver(j);
        if (a != b) {
            if (taille[a] < taille[b]) swap(a, b);
            parent[b] = a;
            taille[a] += taille[b];
            total += c;
        }
    }
    cout << total << "\n";
    return 0;
}
