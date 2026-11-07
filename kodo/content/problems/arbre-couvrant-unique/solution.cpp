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
    int n, m;
    cin >> n >> m;
    vector<tuple<long long, int, int>> aretes(m);
    for (auto& [w, a, b] : aretes) cin >> a >> b >> w;
    sort(aretes.begin(), aretes.end());
    parent.resize(n + 1);
    iota(parent.begin(), parent.end(), 0);
    taille.assign(n + 1, 1);

    long long total = 0;
    bool unique = true;
    for (int i = 0, j; i < m; i = j) {
        j = i;
        while (j < m && get<0>(aretes[j]) == get<0>(aretes[i])) j++;
        // groupe des arêtes de même poids : on compte d'abord les arêtes utiles
        int utiles = 0, choisies = 0;
        for (int k = i; k < j; k++)
            if (trouver(get<1>(aretes[k])) != trouver(get<2>(aretes[k]))) utiles++;
        for (int k = i; k < j; k++) {
            auto [w, a, b] = aretes[k];
            a = trouver(a);
            b = trouver(b);
            if (a != b) {
                if (taille[a] < taille[b]) swap(a, b);
                parent[b] = a;
                taille[a] += taille[b];
                total += w;
                choisies++;
            }
        }
        if (utiles > choisies) unique = false;  // une arête utile laissée de côté pouvait remplacer une choisie
    }
    cout << total << "\n" << (unique ? "OUI" : "NON") << "\n";
    return 0;
}
