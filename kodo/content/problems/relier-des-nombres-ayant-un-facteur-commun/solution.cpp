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

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin >> n;
    vector<int> a(n);
    for (int& x : a) cin >> x;

    // crible : plus petit facteur premier jusqu'au maximum
    int vmax = *max_element(a.begin(), a.end());
    vector<int> ppf(vmax + 1);
    for (int i = 0; i <= vmax; i++) ppf[i] = i;
    for (int i = 2; (long long)i * i <= vmax; i++)
        if (ppf[i] == i)
            for (int j = i * i; j <= vmax; j += i)
                if (ppf[j] == j) ppf[j] = i;

    // pour chaque nombre premier p : la position du plus petit multiple de p
    vector<int> plusPetit(vmax + 1, -1);
    vector<vector<int>> facteurs(n);
    for (int i = 0; i < n; i++) {
        int x = a[i];
        while (x > 1) {
            int p = ppf[x];
            facteurs[i].push_back(p);
            if (plusPetit[p] == -1 || a[i] < a[plusPetit[p]]) plusPetit[p] = i;
            while (x % p == 0) x /= p;
        }
    }

    // seules servent les liaisons entre le plus petit multiple de p et les autres multiples de p
    vector<tuple<long long, int, int>> aretes;
    for (int j = 0; j < n; j++)
        for (int p : facteurs[j]) {
            int m = plusPetit[p];
            if (m != j) aretes.push_back({(long long)a[m] + a[j], m, j});
        }
    sort(aretes.begin(), aretes.end());

    parent.resize(n);
    iota(parent.begin(), parent.end(), 0);
    taille.assign(n, 1);
    long long total = 0;
    int nb = 0;
    for (auto [c, i, j] : aretes) {  // Kruskal
        int ri = trouver(i), rj = trouver(j);
        if (ri != rj) {
            if (taille[ri] < taille[rj]) swap(ri, rj);
            parent[rj] = ri;
            taille[ri] += taille[rj];
            total += c;
            nb++;
        }
    }
    cout << (nb == n - 1 ? total : -1) << "\n";
    return 0;
}
